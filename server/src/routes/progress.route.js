import { Router } from 'express';
import { getDashboard, getDocumentTypes, getQuizPerformance } from '../controllers/progress.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/document-types', getDocumentTypes);
router.get('/quiz-performance', getQuizPerformance)

export default router;