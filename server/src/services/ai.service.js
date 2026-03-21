import config from "../config/config.js";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from "@langchain/core/runnables";
import { pineconeIndex } from '../config/pinecone.js';

const genAI = new GoogleGenAI({ apiKey: config.googleApiKey });

export const embeddings = {
  async embedDocuments(texts) {
    const results = await Promise.all(
      texts.map(text =>
        genAI.models.embedContent({
          model: "gemini-embedding-001",
          contents: text,
          config: {
            taskType: "RETRIEVAL_DOCUMENT",
            outputDimensionality: 768,
          },
        })
      )
    );
    return results.map(r => r.embeddings[0].values);
  },

  async embedQuery(text) {
    const result = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      },
    });
    return result.embeddings[0].values;
  }
};

export const llm = new ChatGoogleGenerativeAI({
  apiKey: config.googleApiKey,
  model: "gemini-2.5-flash",
  temperature: 0.5,
});

export async function getRelevantChunks(userId, documentId, query, topK = 5) {
  const queryVector = await embeddings.embedQuery(query);

  const results = await pineconeIndex.namespace(userId).query({
    vector: queryVector,
    topK,
    filter: {
      documentId: { $eq: documentId },
    },
    includeMetadata: true,
  });

  return results.matches.map(match => ({
    text: match.metadata.text,
    chunkIndex: match.metadata.chunkIndex,
    score: match.score,
  }));
}

export function buildContext(chunks) {
  return chunks.map(chunk => chunk.text).join('\n\n---\n\n');
}

export async function runChain(promptTemplate, variables) {
  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const chain = RunnableSequence.from([prompt, llm, new StringOutputParser()]);
  return await chain.invoke(variables);
}