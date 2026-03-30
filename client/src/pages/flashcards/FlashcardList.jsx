import { useState, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import { useDispatch, useSelector } from 'react-redux';
import { asyncgetallflashcardsets } from '../../store/actions/flashcardActions';

const FlashcardList = () => {

  const dispatch = useDispatch();
  const { flashcardsets, status, error } = useSelector((state) => state.flashcard);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(asyncgetallflashcardsets());
    }
  }, [dispatch]);

  const renderContent = () => {
    if (status === 'loading') {
      return <Spinner />;
    }

    if (flashcardsets.length === 0) {
      return (
        <EmptyState 
          title={"No Flashcard Sets Found"}
          description={"You haven't generated any flashcards. Go to documents to generate you first set"}
        />
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {flashcardsets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={"All Flashcard Sets"} />
      {renderContent()}
    </div>
  )
}

export default FlashcardList