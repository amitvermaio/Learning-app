import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { createLLM } from './llm.js';
import searchTool from './searchTools.js';

const AGENT_SYSTEM_PROMPT = `You are Brainwave AI.
Today's actual date is: ${new Date().toDateString()}

Use the web search tool ONLY when:
- The user asks about today's date, current time, or "right now"
- The user asks about recent events, news, or current data
- You are unsure or your knowledge might be outdated
- The question requires real-time information (prices, scores, weather, etc.)

Do NOT search for general knowledge, coding questions, or things you already know well.
When you do search, always cite your sources with the URL.`;

export const createAgentForModel = (modelName) => {
  const llmInstance = createLLM(modelName);

  return createReactAgent({
    llm: llmInstance,
    tools: [searchTool],
    messageModifier: AGENT_SYSTEM_PROMPT,
  });
};