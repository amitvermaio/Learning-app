import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setquizloading,
  setquizzes,
  setcurrentquiz,
  setquizresult,
  removequiz,
  setquizerror,
} from '../reducers/quizSlice';

const extractdata = (res) => res?.data ?? res;

export const asyncgetquizzes = (documentId) => async (dispatch) => {
  try {
    dispatch(setquizloading());

    const { data } = await api.get(`/quiz/${documentId}`);

    dispatch(setquizzes(data?.data || []));

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quizzes';
    dispatch(setquizerror(message));
    toast.error(message);
  }
};

export const asyncgetquizbyid = (quizId) => async (dispatch) => {
  try {
    dispatch(setquizloading());

    const { data } = await api.get(`/quiz/${quizId}`);
    const res = extractdata(data);

    dispatch(setcurrentquiz(res?.data ?? null));

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quiz';
    dispatch(setquizerror(message));
    toast.error(message);
  }
};

export const asyncsubmitquiz = (id, answers) => async (dispatch) => {
  try {
    dispatch(setquizloading());

    const { data } = await api.post(`/quiz/${id}/submit`, { answers });
    const res = extractdata(data);

    dispatch(setquizresult(res?.data ?? null));

    toast.success('Quiz submitted successfully');

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit quiz';
    dispatch(setquizerror(message));
    toast.error(message);
  }
};

export const asyncgetquizresults = (id) => async (dispatch) => {
  try {
    dispatch(setquizloading());

    const { data } = await api.get(`/quiz/${id}/results`);
    const res = extractdata(data);

    dispatch(setquizresult(res?.data ?? null));

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch results';
    dispatch(setquizerror(message));
    toast.error(message);
  }
};

export const asyncdeletequiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setquizloading());

    await api.delete(`/quiz/${quizId}`);

    dispatch(removequiz(quizId));
    toast.success('Quiz deleted successfully');

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete quiz';
    dispatch(setquizerror(message));
    toast.error(message);
  }
};