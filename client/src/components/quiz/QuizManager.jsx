import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncgetquizzes,
  asyncgetquizbyid,
  asyncsubmitquiz,
  asyncgetquizresults,
  asyncdeletequiz
} from '../../store/actions/quizActions';
import { asyncgeneratequiz } from '../../store/actions/aiActions';
import QuizCard from './QuizCard';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';

const QuizManager = ({ documentId }) => {
  const dispatch = useDispatch();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleGenerateQuiz = async () => {
    try {
      console.log('Generating quiz with', { documentId, numQuestions });
    } catch (error) {
      console.error('Error generating quiz:', error);
    }
  }

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {

  }

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Yet."
          description="Generate a quiz from your document to test your knowledge."
        />
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    )
  }


  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
      <div className='flex justify-end gap-2 mb-4'>
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {renderQuizContent()}

    </div>
  )
}

export default QuizManager