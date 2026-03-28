import { useState, useEffect } from 'react';
import {
  Brain,
	ChevronLeft,
	ChevronRight,
	Sparkles,
	Trash2,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
	asyncgetflashcards,
	asyncdeleteflashcardset,
  asyncgetallflashcardsets,
  asyncreviewflashcard,
} from '../../store/actions/flashcardActions';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import Flashcard from './Flashcard';
import { asyncgenerateflashcards } from '../../store/actions/aiActions';

const FlashcardManager = ({ documentId }) => {
	const dispatch = useDispatch();

	const { flashcardsets, flashcards, status, error } = useSelector(
		(state) => state.flashcard
	);

  const [isGenerating, setIsGenerating] = useState(false);
	const [selectedSet, setSelectedSet] = useState(null);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [setToDelete, setSetToDelete] = useState(null);

	useEffect(() => {
		if (documentId) {
			dispatch(asyncgetflashcards(documentId));
		}
	}, [documentId, dispatch]);

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true);
    try {
      await dispatch(asyncgenerateflashcards(documentId));
      await dispatch(asyncgetallflashcardsets());
    } catch (error) {
      console.error('Error generating flashcards:', error);      
    } finally {
      setIsGenerating(false);
    }
  }

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      )
    }
  }

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      )
    }
  }

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await dispatch(asyncreviewflashcard(currentCard._id, index));
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
    }
  }

  const asyncToggleStar = async (cardId) => {

  }

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  }

  const handleDeleteConfirm = async () => {

  }

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  }

  const renderFlashCardViewer = () => {
    return "Render FlashCard Viewer";
  }

  const renderSetList = () => {
    if (status === 'loading') {
      return (
        <div className='flex items-center justify-center py-20'>
          <Spinner />
        </div>
      )
    }

    return (
      <div className='flex flex-col items-center py-16 px-6'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-bg-emerald-100 to-teal-100 mb-6'>
          <Brain className='w-8 h-8 text-emerald-600' strokeWidth={2} />
        </div>
        <h3 className='text-xl font-semibold text-slate-900 mb-2'>
          No Flashcard yet.
        </h3>
        <p className='text-sm text-slate-500 mb-8 text-center max-w-sm'>
          Generate flashcards from your document to start learning and reinforce your knowledge.
        </p>
        <button
          onClick={handleGenerateFlashcards}
          disabled={isGenerating}
          className='groupt inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold'
        >
          {isGenerating ? (
            <>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              Generating
            </>
          ) : (
            <>
              <Sparkles className='w-4 h-4' strokeWidth={2} />
              Generate Flashcard
            </>
          )}
        </button>
      </div>
    )
  }

	return (
		<div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate/50 p-8">
      {selectedSet ? renderFlashCardViewer() : renderSetList()}
		</div>
	);
};

export default FlashcardManager;