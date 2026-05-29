import { generateResponseWithAgent } from './agent.service.js';

export const MODELS = {
  normal: 'nvidia/nemotron-3-super-120b-a12b:free',
  fast: 'openai/gpt-oss-120b:free',
}

const history = [];

export const getAvailableModels = () => {
  return Object.entries(MODELS).map(([modelType, modelId]) => ({
    modelType,
    modelId
  }));
};

export const generateResponseFromModel = async (query, modelType = 'normal') => {
  try {
    const { reply, sources } = await generateResponseWithAgent(query, modelType, history);

    history.push({ role: 'user', content: query });
    history.push({ role: 'assistant', content: reply });

    if (history.length > 10) history.splice(0, 2);

    return { reply, sources };
  } catch (error) {
    throw new Error('Error generating response from model: ' + error.message);
  }
};