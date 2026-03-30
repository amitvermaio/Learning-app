// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Trash2
// } from 'lucide-react';
// import { asyncgetflashcards, asyncreviewflashcard, asynctogglestarflashcard } from '../../store/actions/flashcardActions';
// import { } from '../../store/actions/aiActions';
// import PageHeader from '../../components/common/PageHeader';
// import Spinner from '../../components/common/Spinner';
// import EmptyState from '../../components/common/EmptyState';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/Modal';
// import Flashcard from '../../components/flashcards/Flashcard';
// import { useDispatch, useSelector } from 'react-redux';

// const FlashcardPage = () => {
//   const { id: documentId } = useParams();
//   const dispatch = useDispatch();

//   const [flashcardSets, setFlashcardSets] = useState([]);
//   const [flashcards, setFlashcards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const fetchFlashcards = async () => {
//     setLoading(true);
//     try {
//       const response = await dispatch(asyncgetflashcards(documentId));
//       setFlashcardSets(response.data[0])
//       setFlashcards(response.data[0]?.cards || []);
//     } catch (error) {
//       console.error('Error fetching flashcards:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFlashcards();
//   }, [documentId, dispatch]);

//   const handleNextCard = () => {
//     handleReview(currentCardIndex);
//     setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
//   };

//   const handlePrevCard = () => {
//     handleReview(currentCardIndex);
//     setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
//   }

//   const handleReview = async (index) => {
//     const currentCard = flashcards[currentCardIndex];
//     if (!currentCard) return;

//     try {
//       await dispatch(asyncreviewflashcard(currentCard._id, index));
//     } catch (error) {
//       console.error('Error reviewing flashcard:', error);
//     }
//   }

//   const handleGenerateFlashcards = async () => {

//   }

//   const handleToggleStar = async (cardId) => {
//     try {
//       await dispatch(asynctogglestarflashcard(cardId));
//       setFlashcards((prevFlashcard) =>
//         prevFlashcard.map((card) =>
//           card._id === cardId ? { ...card, starred: !card.starred } : card
//         )
//       )
//     } catch (error) {
//       console.error('Error toggling star on flashcard:', error);
//     }
//   }

//   const handleDeleteFlashcardContent = () => {
//     if (loading) {
//       return <Spinner />;
//     }

//     if (flashcards.length === 0) {
//       return (
//         <EmptyState
//           title={"No Flashcards Yet."}
//           description={"Generate Flashcards from your document to start learning"}
//         />
//       )
//     }

//     const currentCard = flashcards[currentCardIndex];

//     return (
//       <div className='flex flex-col items-center space-y-6'>
//         <div className='w-full max-w-md'>
//           <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
//         </div>

//         <div className='flex items-center gap-4'>
//           <Button
//             onClick={handlePrevCard}
//             variant='secondary'
//             disabled={flashcards.length <= 1}
//           >
//             <ChevronLeft size={16} /> Previous
//           </Button>

//           <span className='text-sm text-neutral-600'>
//             {currentCardIndex + 1} / {flashcards.length}
//           </span>

//           <Button
//             onClick={handleNextCard}
//             variant='secondary'
//             disabled={flashcards.length <= 1}
//           >
//             Next <ChevronRight size={16} />
//           </Button>
//         </div>
//       </div>
//     )

//   }

//   return (
//     <div>
//       <div className=''>
//         <Link
//           to={`/documents/${documentId}`}
//           className=''
//         >

//           <ArrowLeft size={16} /> Back to Document
//         </Link>
//       </div>

//       <PageHeader title={"Flashcards"}>
//         <div className=''>
//           {!loading && (
//             flashcards.length > 0 ? (
//               <>
//                 <Button
//                   onClick={() => setIsDeleteModalOpen(true)}
//                   disabled={deleting}
//                 >
//                   <Trash2 size={16} /> Delete Set
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 onClick={handleGenerateFlashcards}
//                 disabled={generating}
//               >
//                 {generating ? (
//                   <Spinner />
//                 ) : (
//                   <>
//                     <Plus size={16} /> Generate Flashcards
//                   </>
//                 )}
//               </Button>
//             )
//           )}
//         </div>
//       </PageHeader>

//       {renderFlashcardContent()}


//     </div>
//   )
// }

// export default FlashcardPage