import 'dotenv/config';
import { TavilySearch } from '@langchain/tavily';

const searchTool = new TavilySearch({
  maxResults: 4,
  topic: 'general',
  includeAnswer: true
});

export default searchTool;