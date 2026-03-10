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