1. Document Upload & Indexing (Backend)
```js
// services/indexDocument.js
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  model: 'embedding-001',
});

export async function indexDocument({ localFilePath, userId, documentId, fileName }) {
  // 1. Load document based on file type
  const ext = fileName.split('.').pop().toLowerCase();
  let loader;
  if (ext === 'pdf') loader = new PDFLoader(localFilePath);
  else if (ext === 'docx') loader = new DocxLoader(localFilePath);
  else throw new Error('Unsupported file type');

  const docs = await loader.load();

  // 2. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(docs);

  // 3. Embed all chunks
  const texts = chunks.map(c => c.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  // 4. Upsert into Pinecone
  // namespace = userId → hard user isolation
  // documentId in metadata → per-doc filtering within that user
  const index = pinecone.index(process.env.PINECONE_INDEX);
  const upsertPayload = chunks.map((chunk, i) => ({
    id: `${documentId}-chunk-${i}`,        // unique ID per chunk
    values: vectors[i],
    metadata: {
      userId,
      documentId,
      fileName,
      chunkIndex: i,
      text: chunk.pageContent,             // store text so we can retrieve it later
    },
  }));

  // upsert in batches of 100 (Pinecone limit)
  const batchSize = 100;
  for (let i = 0; i < upsertPayload.length; i += batchSize) {
    await index.namespace(userId).upsert(upsertPayload.slice(i, i + batchSize));
  }

  return { chunkCount: chunks.length };
}
```


2. Upload Route (Express)
```js
// routes/document.js
import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import { indexDocument } from '../services/indexDocument.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const userId = req.user.id;          // from JWT
  const file = req.file;
  const documentId = uuidv4();

  try {
    // 1. Upload to Azure Blob
    const blobClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);
    const blobName = `${userId}/${documentId}/${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadFile(file.path);
    const blobUrl = blockBlobClient.url;

    // 2. Save document record to MongoDB (status: processing)
    const doc = await Document.create({
      userId,
      documentId,
      fileName: file.originalname,
      blobUrl,
      status: 'processing',
      chunkCount: 0,
    });

    // 3. Index document into Pinecone
    const { chunkCount } = await indexDocument({
      localFilePath: file.path,
      userId,
      documentId,
      fileName: file.originalname,
    });

    // 4. Update MongoDB record
    await Document.findByIdAndUpdate(doc._id, { status: 'indexed', chunkCount });

    // 5. Cleanup temp file
    fs.unlinkSync(file.path);

    res.json({ success: true, documentId, chunkCount });
  } catch (err) {
    await Document.findOneAndUpdate({ documentId }, { status: 'failed' });
    fs.unlinkSync(file.path);
    res.status(500).json({ error: err.message });
  }
});

export default router;
```


3. MongoDB Document Model
```js
// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  documentId: { type: String, required: true, unique: true },
  fileName: String,
  blobUrl: String,
  status: { type: String, enum: ['processing', 'indexed', 'failed'], default: 'processing' },
  chunkCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', documentSchema);
```

4. RAG Query Service
```js
// services/queryDocument.js
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  model: 'embedding-001',
});

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  model: 'gemini-pro',
});

const RAG_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't have enough information in this document."

Context:
{context}

Question: {question}

Answer:
`);

export async function queryDocument({ userId, documentId, question }) {
  // 1. Embed the user's question
  const questionVector = await embeddings.embedQuery(question);

  // 2. Query Pinecone — namespace isolates by user, filter isolates by document
  const index = pinecone.index(process.env.PINECONE_INDEX);
  const results = await index.namespace(userId).query({
    vector: questionVector,
    topK: 5,
    filter: { documentId: { $eq: documentId } },  // only this document
    includeMetadata: true,
  });

  // 3. Build context from retrieved chunks
  const context = results.matches
    .map(m => m.metadata.text)
    .join('\n\n---\n\n');

  // 4. Run LangChain RAG chain
  const chain = RunnableSequence.from([
    { context: () => context, question: new RunnablePassthrough() },
    RAG_PROMPT,
    llm,
    new StringOutputParser(),
  ]);

  const answer = await chain.invoke(question);

  // 5. Return answer + source references
  return {
    answer,
    sources: results.matches.map(m => ({
      chunkIndex: m.metadata.chunkIndex,
      fileName: m.metadata.fileName,
      score: m.score,
      preview: m.metadata.text.slice(0, 150) + '...',
    })),
  };
}
```


5. Query Route (Express)
```js
// routes/chat.js
import express from 'express';
import Document from '../models/Document.js';
import { queryDocument } from '../services/queryDocument.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/query', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { documentId, question } = req.body;

  // Verify this document belongs to this user (critical auth check)
  const doc = await Document.findOne({ documentId, userId });
  if (!doc) return res.status(403).json({ error: 'Document not found or unauthorized' });
  if (doc.status !== 'indexed') return res.status(400).json({ error: 'Document not yet indexed' });

  const result = await queryDocument({ userId, documentId, question });
  res.json(result);
});

export default router;
```

---

## How it all connects
```
POST /upload
  → multer saves file to tmp/
  → Azure Blob (permanent storage)
  → MongoDB (document registry with status)
  → Pinecone upsert (namespace=userId, metadata.documentId=documentId)

POST /query
  → Auth check (JWT)
  → MongoDB verify ownership
  → Pinecone query (namespace=userId + filter documentId)
  → LangChain RAG chain
  → { answer, sources[] }
```


The MongoDB ownership check in the query route is the critical security layer — even if someone guesses a documentId, they can't query it because the backend validates { documentId, userId } together before touching Pinecone. The namespace + metadata filter then double-enforce isolation at the vector DB level.