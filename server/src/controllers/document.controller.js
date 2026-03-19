import config from '../config/config.js';
import Document from '../models/document.model.js';
import FlashCard from '../models/flashcard.model.js';
import Quiz from '../models/quiz.model.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToAzureBlob } from '../utils/azureBlob.js';
import { pineconeIndex } from '../config/pinecone.js';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Blob } from 'buffer';

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.googleApiKey,
  modelName: 'gemini-embedding-001',
});

const storeChunksInPinecone = async (chunks, documentId, userId) => {
  const docsWithMetadata = chunks.map((chunk, i) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      userId: userId.toString(),
      documentId: documentId.toString(),
      chunkIndex: i,
    },
  }));

  await PineconeStore.fromDocuments(docsWithMetadata, embeddings, {
    pineconeIndex,
    namespace: userId.toString(),   // each user gets their own namespace
    maxConcurrency: 5,
  });
};


const deleteDocumentFromPinecone = async (documentId, totalChunks, userId) => {
  const ids = Array.from(
    { length: totalChunks },
    (_, i) => `${documentId}_chunk_${i}`
  );

  const BATCH_SIZE = 100;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    await pineconeIndex.namespace(userId.toString()).deleteMany(ids.slice(i, i + BATCH_SIZE));  // 👈
  }
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

    case 'text/plain':
      loader = new TextLoader(blob);
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
  return chunks;
};


export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    const { title } = req.body;
    if (!title) {
      return next(new AppError('Document title is required', 400));
    }

    const userId = req.user.id;
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    // 1. Upload raw file to Azure Blob
    const uploadResponse = await uploadToAzureBlob({
      buffer: fileBuffer,
      mimeType: req.file.mimetype,
      originalName,
    });

    // 2. Extract text + chunk using LangChain 
    const chunks = await extractAndChunkDocument(fileBuffer, req.file.mimetype);

    if (!chunks || chunks.length === 0) {
      return next(
        new AppError(
          'Could not extract text from the file. It may be scanned/image-based.',
          400
        )
      );
    }

    // 3. Save document to MongoDB 
    const document = await Document.create({
      user: userId,
      title,
      fileName: originalName,
      fileUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileSize: req.file.size,
      mimeType: req.file.mimetype, 
      totalChunks: chunks.length,
      status: 'processing',
    });

    // 4. Store chunks in Pinecone
    try {
      await storeChunksInPinecone(chunks, document._id, userId);
      document.status = 'ready';
    } catch (embeddingError) {
      console.error('Embedding error:', embeddingError.message);
      document.status = 'failed';
    }

    await document.save();

    res.status(201).json(
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
    next(error);
  }
};


export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({ uploadDate: -1 });

    res.status(200).json(
      new ApiResponse(200, { documents }, 'Documents fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};


export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    document.lastAccessed = new Date();
    await document.save();

    res.status(200).json(
      new ApiResponse(200, { document }, 'Document fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};


export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    if (document.fileId) {
      try {
        await uploadToAzureBlob.deleteFile(document.fileId);
      } catch (azureError) {
        console.error('Azure Blob deletion error:', azureError.message);
      }
    }

    if (document.totalChunks > 0) {
      try {
        await deleteDocumentFromPinecone(document._id, document.totalChunks, req.user.id);
      } catch (pcError) {
        console.error('Pinecone deletion error:', pcError.message);
      }
    }

    await Promise.all([
      FlashCard.deleteMany({ document: document._id }),
      Quiz.deleteMany({ document: document._id }),
    ]);

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
    if (!title) {
      return next(new AppError('Title is required', 400));
    }

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    );

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json(
      new ApiResponse(200, { document }, 'Document updated successfully')
    );
  } catch (error) {
    next(error);
  }
};