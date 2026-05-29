import config from '../config/config.js';
import { ChatOpenAI } from "@langchain/openai";

export const createLLM = (modelName) => {

  process.env.OPENAI_API_KEY = config.openrouterApiKey;

  return new ChatOpenAI({
    modelName: modelName,
    apiKey: config.openrouterApiKey,
    configuration: {
      baseURL: config.openrouterUrlEndpoint
    },
    temperature: 0.3
  });
}