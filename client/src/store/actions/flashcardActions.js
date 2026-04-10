import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setflashcardloading,
  setflashcardsets,
  setflashcards,
  setflashcarderror,
  updateFlashcardSet,
} from '../reducers/flashcardSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgetallflashcardsets = () => async (dispatch) => {
  try {
    dispatch(setflashcardloading());
    const { data } = await api.get('/flashcards');
    const response = extractdata(data);
    dispatch(setflashcardsets(response || []));
    return response || [];
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch flashcard sets';
    dispatch(setflashcarderror(message));
    toast.error(message);
    return null;
  }
};

export const asyncgetflashcards = (documentId) => async (dispatch) => {
  try {
    dispatch(setflashcardloading());
    const { data } = await api.get(`/flashcards/${documentId}`);
    const response = extractdata(data);
    dispatch(setflashcards(response?.cards || response || []));
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch flashcards';
    dispatch(setflashcarderror(message));
    toast.error(message);
    return null;
  }
};

export const asyncreviewflashcard = (cardId) => async (dispatch) => {
  try {
    const { data } = await api.post(`/flashcards/${cardId}/review`);
    const response = extractdata(data);
    dispatch(setflashcards(response?.cards || []));
    dispatch(updateFlashcardSet(response));
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to review flashcard';
    dispatch(setflashcarderror(message));
    toast.error(message);
    return null;
  }
};

export const asynctogglestarflashcard = (cardId) => async (dispatch) => {
  try {
    const { data } = await api.put(`/flashcards/${cardId}/star`);
    const response = extractdata(data);
    dispatch(setflashcards(response?.cards || []));
    dispatch(updateFlashcardSet(response));
    toast.success('Flashcard updated successfully');
    return response;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update flashcard';
    dispatch(setflashcarderror(message));
    toast.error(message);
    return null;
  }
};

export const asyncdeleteflashcardset = (id) => async (dispatch) => {
  try {
    dispatch(setflashcardloading());
    await api.delete(`/flashcards/${id}`);
    await dispatch(asyncgetallflashcardsets());
    toast.success('Flashcard set deleted successfully');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete flashcard set';
    dispatch(setflashcarderror(message));
    toast.error(message);
    return false;
  }
};