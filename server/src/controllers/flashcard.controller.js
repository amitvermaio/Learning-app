import Flashcard from '../models/flashcard.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';

// @desc Get all flashcards for a document
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      user: req.user.id,
      document: req.params.documentId
    }).populate('document', 'title fileName')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200, 
        flashcards, 
        "Flashcards fetched successfully"
      ));
  } catch (error) {
    next(error)
  }
}

// @desc Get all flashcard sets for a user
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({
      user: req.user.id
    }).populate('document', 'title')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        flashcardSets,
        "Flashcard sets fetched successfully"
      ));
  } catch (error) {
    next(error)
  }
}

// @desc Review a flashcard
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashCardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      user: req.user.id
    });

    if (!flashCardSet) {
      return res.status(404).json(
        new AppError(404, "Flashcard not found")
      );
    }

    const cardIndex = flashCardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if (cardIndex === -1) {
      return res.status(404).json(
        new AppError(404, "Flashcard not found")
      );
    }

    flashCardSet.cards[cardIndex].lastReviewed = new Date();
    flashCardSet.cards[cardIndex].reviewCount += 1;
    await flashCardSet.save();

    res.status(200).json(
      new ApiResponse(
        200,
        flashCardSet,
        "Flashcard reviewed successfully"
      )
    );

  } catch (error) {
    next(error)
  }
}

// @desc Toggle star a flashcard set
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      user: req.user.id
    });

    if (!flashcardSet) {
      return res.status(404).json(
        new AppError(404, "Flashcard not found")
      );
    }

    const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if (cardIndex === -1) {
      return res.status(404).json(
        new AppError(404, "Flashcard not found")
      );
    }

    flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
    await flashcardSet.save();

    res.status(200).json(
      new ApiResponse(
        200,
        flashcardSet,
        flashcardSet.cards[cardIndex].isStarred ? "starred" : "unstarred"
      )
    );
  } catch (error) {
    next(error)
  }
}


// @desc Delete a flashcard set
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!flashcardSet) {
      return res.status(404).json(
        new AppError(404, "Flashcard set not found")
      );
    }

    await flashcardSet.deleteOne();
    
    res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Flashcard set deleted successfully"
      )
    );
  } catch (error) {
    next(error)
  }
}