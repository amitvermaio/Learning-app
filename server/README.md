# Implementation

```js
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RetrievalQAChain } from "langchain/chains";

// 1. Initialize Embeddings (FREE via Google AI Studio key)
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",  // 768 dimensions, free
});

// 2. Initialize Pinecone
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.index("your-index-name");

// 3. Store documents
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const chunks = await splitter.splitDocuments(documents); // your loaded docs

const vectorStore = await PineconeStore.fromDocuments(
  chunks,
  embeddings,
  { pineconeIndex }
);

// 4. Initialize Gemini LLM (FREE tier)
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.0-flash",  // free tier available
  temperature: 0,
});

// 5. Build RAG chain
const retriever = vectorStore.asRetriever({ k: 3 });
const chain = RetrievalQAChain.fromLLM(llm, retriever);

// 6. Query
const response = await chain.invoke({ query: "Your question here" });
console.log(response.text);
```


### Solution to the unique doc and user based search in vector db
```js
// When you upsert chunks into Pinecone, you attach metadata to each vector:

await pinecone.index('your-index').upsert([
  {
    id: 'chunk-uuid-1',
    values: embeddingVector, // float array from Google GenAI
    metadata: {
      userId: 'user_123',
      documentId: 'doc_abc',
      fileName: 'report.pdf',
      blobUrl: 'https://yourstorage.blob.core.windows.net/...',
      chunkIndex: 0,
      text: 'actual chunk text here...'
    }
  }
]);

// At time of query

const queryEmbedding = await embedText(userQuery); // Google GenAI

const results = await pinecone.index('your-index').query({
  vector: queryEmbedding,
  topK: 5,
  filter: {
    userId: { $eq: 'user_123' },
    documentId: { $eq: 'doc_abc' }  // if user selected a specific doc
  },
  includeMetadata: true
});
```

This ensures Pinecone **only searches within that user's document** — other users' vectors are completely ignored at the DB level.

## Full Flow (LangChain + MERN)
```
Upload → Azure Blob → LangChain Loader → Split → Embed → Upsert to Pinecone (with metadata)
Query  → Embed query → Pinecone filtered search → LangChain RAG chain → Response
```

Tracking "Which doc is where" in MongoDB
Store a document registry in MongoDB:
// MongoDB schema
{
  _id: ObjectId,
  userId: 'user_123',
  documentId: 'doc_abc',          // same ID used in Pinecone metadata
  fileName: 'report.pdf',
  blobUrl: 'https://...',
  pineconeNamespace: 'user_123',  // optional (see below)
  status: 'indexed' | 'processing' | 'failed',
  chunkCount: 42,
  createdAt: Date
}

```js
// Pinecone also supports namespaces — you can use userId as the namespace, which gives hard isolation:

pinecone.index('your-index').namespace('user_123').upsert([...]);
pinecone.index('your-index').namespace('user_123').query({...});
```