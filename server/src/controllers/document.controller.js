import Document from '../models/document.model.js';
import FlashCard from '../models/flashcard.model.js';
import Quiz from '../models/quiz.model.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToAzureBlob, deleteFromAzureBlob } from '../utils/azureBlob.js';
import { pineconeIndex } from '../config/pinecone.js';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Blob } from 'buffer';
import { embeddings } from '../services/ai.service.js';

const storeChunksInPinecone = async (chunks, documentId, userId) => {
  const BATCH_SIZE = 90;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((chunk) => chunk.pageContent);
    const vectors = await embeddings.embedDocuments(texts);

    const upsertPayload = batch.map((chunk, j) => ({
      id: `${documentId}_chunk_${i + j}`,
      values: vectors[j],
      metadata: {
        userId: userId.toString(),
        documentId: documentId.toString(),
        chunkIndex: i + j,
        text: chunk.pageContent,
        source: chunk.metadata?.source || '',
        pageNumber: chunk.metadata?.pageNumber ?? chunk.metadata?.page ?? 0,
      },
    }));

    await pineconeIndex.namespace(userId.toString()).upsert(upsertPayload);
  }
};

const deleteDocumentFromPinecone = async (documentId, userId) => {
  await pineconeIndex.namespace(userId.toString()).deleteMany({
    filter: { documentId: { $eq: documentId.toString() } },
  });
};

const extractAndChunkDocument = async (fileBuffer, mimeType) => {
  const blob = new Blob([fileBuffer], { type: mimeType });

  let loader;
  switch (mimeType) {
    case 'application/pdf':
      loader = new PDFLoader(blob);
      break;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      loader = new DocxLoader(blob);
      break;
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      loader = new PPTXLoader(blob);
      break;
    default:
      throw new AppError('Unsupported file type for text extraction', 400);
  }

  const rawDocs = await loader.load();
  if (!rawDocs || rawDocs.length === 0) {
    throw new AppError(
      'Could not extract text from the file. It may be scanned/image-based.',
      400
    );
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(rawDocs);

  if (!chunks || chunks.length === 0) {
    throw new AppError('Failed to split document into chunks.', 400);
  }

  return { chunks, rawDocs };
};

export const uploadDocument = async (req, res, next) => {
 
  const rollback = {
    azureFileId: null,
    mongoDocumentId: null,
    userId: null, 
    pineconeDocumentId: null,
  };

  try {
    if (!req.file) return next(new AppError('No file uploaded', 400));
    if (!req.body.title) return next(new AppError('Document title is required', 400));

    const userId = req.user.id;
    const { title } = req.body;
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const uploadResponse = await uploadToAzureBlob({
      buffer: fileBuffer,
      mimeType: req.file.mimetype,
      originalName,
    });
    rollback.azureFileId = uploadResponse.fileId;

   
    const { chunks, rawDocs } = await extractAndChunkDocument(fileBuffer, req.file.mimetype);
    const extractedText = rawDocs.map((d) => d.pageContent).join('\n\n');

    const document = await Document.create({
      user: userId,
      title,
      fileName: originalName,
      fileUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      totalChunks: chunks.length,
      extractedText,
      status: 'processing',
    });
    rollback.mongoDocumentId = document._id; 

    await storeChunksInPinecone(chunks, document._id, userId);
    rollback.pineconeDocumentId = document._id; 
    rollback.userId = userId;            

    document.status = 'ready';
    await document.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          document: {
            _id: document._id,
            title: document.title,
            fileName: document.fileName,
            fileUrl: document.fileUrl,
            fileSize: document.fileSize,
            status: document.status,
            totalChunks: chunks.length,
            uploadDate: document.uploadDate,
          },
        },
        'Document uploaded and processed successfully'
      )
    );
  } catch (error) {
    console.error('Upload failed, initiating rollback...', error);

    const rollbackResults = await Promise.allSettled([
      rollback.azureFileId
        ? deleteFromAzureBlob(rollback.azureFileId)
        : Promise.resolve(),

      rollback.mongoDocumentId
        ? Document.findByIdAndDelete(rollback.mongoDocumentId)
        : Promise.resolve(),

      rollback.pineconeDocumentId && rollback.userId       
        ? deleteDocumentFromPinecone(rollback.pineconeDocumentId, rollback.userId)
        : Promise.resolve(),
    ]);

    rollbackResults.forEach((result, i) => {
      const labels = ['Azure', 'MongoDB', 'Pinecone'];
      if (result.status === 'rejected') {
        console.error(`Rollback failed for ${labels[i]}:`, result.reason);
      }
    });

    next(error);
  }
};


export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user.id })
      .select('-extractedText -__v -summary')
      .sort({ uploadDate: -1 });

    res.status(200).json(new ApiResponse(200, { documents }, 'Documents fetched successfully'));
  } catch (error) {
    next(error);
  }
};


export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user.id })
      .select('-extractedText -__v -summary');

    if (!document) return next(new AppError('Document not found', 404));

    document.lastAccessed = new Date();
    await document.save();

    res.status(200).json(new ApiResponse(200, { document }, 'Document fetched successfully'));
  } catch (error) {
    next(error);
  }
};


export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user.id });
    if (!document) return next(new AppError('Document not found', 404));

    // 1. Delete from Azure Blob
    if (document.fileId) {
      try {
        await deleteFromAzureBlob(document.fileId); 
      } catch (azureError) {
        console.error('Azure Blob deletion error:', azureError.message);
      }
    }

    // 2. Delete all vectors for this document from Pinecone by metadata filter
    try {
      await deleteDocumentFromPinecone(document._id, req.user.id);
    } catch (pcError) {
      console.error('Pinecone deletion error:', pcError.message);
    }

    // 3. Delete related flashcards and quizzes
    await Promise.all([
      FlashCard.deleteMany({ document: document._id }),
      Quiz.deleteMany({ document: document._id }),
    ]);

    // 4. Delete document record from MongoDB
    await Document.findByIdAndDelete(document._id);

    res.status(200).json(
      new ApiResponse(200, null, 'Document and all related data deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};


export const updateDocument = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return next(new AppError('Title is required', 400));

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    ).select('-extractedText');

    if (!document) return next(new AppError('Document not found', 404));

    res.status(200).json(new ApiResponse(200, { document }, 'Document updated successfully'));
  } catch (error) {
    next(error);
  }
};