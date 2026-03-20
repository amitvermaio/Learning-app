import { Router } from 'express';
import {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
} from '../controllers/ai.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  generateFlashcardsRules,
  generateQuizRules,
  generateSummaryRules,
  chatRules,
  explainConceptRules,
  getChatHistoryRules,
} from '../validations/ai.validation.js';

const router = Router();

router.use(authenticate);

router.post('/generate-flashcards', generateFlashcardsRules, generateFlashcards);
router.post('/generate-quiz', generateQuizRules, generateQuiz);
router.post('/generate-summary', generateSummaryRules, generateSummary);
router.post('/chat', chatRules, chat);
router.post('/explain-concept', explainConceptRules, explainConcept);
router.get('/chat-history/:documentId', getChatHistoryRules, getChatHistory);

export default router;