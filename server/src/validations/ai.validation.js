import { body, param, validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(message, 422));
  }
  next();
};

export const generateFlashcardsRules = [
  body('documentId').notEmpty().withMessage('Document ID is required'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Count must be between 1 and 20'),
  validate,
];

export const generateQuizRules = [
  body('documentId').notEmpty().withMessage('Document ID is required'),
  body('numQuestions').notEmpty().withMessage('Number of questions is required'),
  body('numQuestions').isInt({ min: 1 }).withMessage('Number of questions must be at least 1'),
  body('title').optional().isString(),
  validate,
];

export const generateSummaryRules = [
  body('documentId').notEmpty().withMessage('Document ID is required'),
  validate,
];

export const chatRules = [
  body('documentId').notEmpty().withMessage('Document ID is required'),
  body('query').notEmpty().withMessage('Query is required'),
  validate,
];

export const explainConceptRules = [
  body('documentId').notEmpty().withMessage('Document ID is required'),
  body('concept').notEmpty().withMessage('Concept is required'),
  validate,
];

export const getChatHistoryRules = [
  param('documentId').notEmpty().withMessage('Document ID is required'),
  validate,
];
