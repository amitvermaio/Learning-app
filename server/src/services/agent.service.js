import { createAgentForModel } from '../utils/agent.js';
import { MODELS } from './chat.service.js';
import { HumanMessage } from '@langchain/core/messages';

export const generateResponseWithAgent = async (query, modelType = 'normal', history = []) => {
  try {
    const modelName = MODELS[modelType] || MODELS.normal;
    const agent = createAgentForModel(modelName);

    const messages = [
      ...history.map(m =>
        m.role === 'user'
          ? new HumanMessage(m.content)
          : { role: 'assistant', content: m.content }
      ),
      new HumanMessage(query),
    ];

    const result = await agent.invoke({ messages });

    const lastMessage = result.messages.at(-1);
    const reply = lastMessage.content;

    const sources = extractSources(result.messages);

    return { reply, sources };

  } catch (error) {
    throw new Error('Agent error: ' + error.message);
  }
};

const extractSources = (messages) => {
  const sources = [];

  for (const msg of messages) {
    const isToolMessage = msg._getType?.() === 'tool' ||
      msg.constructor?.name === 'ToolMessage' ||
      msg.role === 'tool';

    if (isToolMessage) {
      try {
        const parsed = JSON.parse(msg.content); 

        if (Array.isArray(parsed.results)) {
          parsed.results.forEach(r => {
            if (r.url) sources.push({ url: r.url, title: r.title || r.url });
          });
        }
      } catch (e) {
        console.error('Source extraction error:', e.message);
      }
    }
  }

  return sources;
};