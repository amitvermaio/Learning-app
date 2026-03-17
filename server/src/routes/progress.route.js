import { Router } from 'express';
import { getDashboard } from '../controllers/progress.controller.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);

export default router;