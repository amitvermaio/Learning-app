import Document from '../models/document.model.js';
import Flashcard from '../models/flashcard.model.js';
import Quiz from '../models/quiz.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalDocuments = await Document.countDocuments({ user: userId });
    const totalFlashcardSets = await Flashcard.countDocuments({ user: userId });
    const totalQuizzes = await Quiz.countDocuments({ user: userId });
    const completedQuizzes = await Quiz.countDocuments({ user: userId, completedAt: { $ne: null } });

    const flashcardSets = await Flashcard.find({ user: userId });
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter((card) => card.reviewCount > 0).length;
      starredFlashcards += set.cards.filter((card) => card.isStarred).length;
    });

    // quiz statistics
    const quizzes = await Quiz.find({ user: userId, completedAt: { $ne: null } });
    const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length) : 0;

    // Recent Activity
    const recentDocument = await Document.find({user: userId})
      .sort({lastAccessed: -1})
      .limit(5)
      .select('title fileName lastAccessed status');

    const recentDocuments = await Document.find({ user: userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('title fileName lastAccessed status');

    const recentQuizzes = await Quiz.find({ user: userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('document', 'title')
      .select('title score totalQuestions completedAt');

      const studyStreak = Math.floor(Math.random() * 7) + 1;

      res.status(200).json(
      new ApiResponse(
        200,
        {
          overview: {
            totalDocuments,
            totalFlashcardSets,
            totalQuizzes,
            completedQuizzes,
            totalFlashcards,
            reviewedFlashcards,
            starredFlashcards,
            averageScore,
            studyStreak,
          },
          recentActivity: {
            recentDocuments,
            recentQuizzes,
          }
        },
        'Dashboard data retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
}

