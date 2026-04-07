import Quiz from '../models/quiz.model.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// @desc Get All quizzes for a document
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      user: req.user.id,
      document: req.params.documentId
    }).populate('document', 'title fileName').sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, quizzes, 'Quizzes fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc get a single quiz by id
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, quiz, 'Quiz fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc submit quiz answer
export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new AppError('Invalid answers format', 400);
    }

    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user.id });
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    if (quiz.completedAt) {
      throw new AppError('Quiz already completed', 400);
    }

    let correctCount = 0;
    const userAnswers = [];

    answers.forEach(answer => {
      const { questionIndex, selectedAnswer } = answer;

      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        const isCorrect = question.correctAnswer === selectedAnswer;

        if (isCorrect) {
          correctCount++;
        }

        userAnswers.push({
          questionIndex,
          selectedOption: selectedAnswer,
          isCorrect,
          answeredAt: new Date()
        });
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();

    res.status(200).json(new ApiResponse(
      200, 
      {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers
      }, 
      'Quiz submitted successfully'
    ));
  } catch (error) {
    next(error);
  }
};


// @desc get quiz results
export const getQuizResults = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('document', 'title');

    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    if (!quiz.completedAt) {
      throw new AppError('Quiz not completed yet', 400);
    }

    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);
      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer?.selectedOption || null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation || null
      };
    });
    
    res.status(200).json(new ApiResponse(
      200,
      {
        quiz: {
          id: quiz._id,
          title: quiz.document.title,
          document: quiz.document,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          correctAnswers: quiz.userAnswers.filter((answer) => answer.isCorrect).length,
          percentage: quiz.score
        },
        results: detailedResults
      },
      'Quiz results fetched successfully'
    ));
  } catch (error) {
    next(error);
  }
};


// @desc delete quiz
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }
    
    await quiz.deleteOne();
    
    res.status(200).json(new ApiResponse(
      200, 
      null, 
      'Quiz deleted successfully'
    ));
  } catch (error) {
    next(error);
  }
};


