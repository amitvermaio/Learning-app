import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setprogressloading,
  setdashboard,
  setprogresserror,
  setquizperformanceloading,
  setquizperformance,
  setquizperformanceerror,
  setdocumenttypesloading,
  setdocumenttypes,
  setdocumenttypeserror,
} from '../reducers/progressSlice';

const extractdata = (responseData) => responseData?.data || responseData;

export const asyncgetdashboard = () => async (dispatch) => {
  try {
    dispatch(setprogressloading());
    const { data } = await api.get('/progress/dashboard');
    dispatch(setdashboard(extractdata(data) || null));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard';
    dispatch(setprogresserror(message));
    toast.error(message);
    return false;
  }
};

export const asyncfetchquizperformance = () => async (dispatch) => {
  try {
    dispatch(setquizperformanceloading());
    const { data } = await api.get('/progress/quiz-performance');
    dispatch(setquizperformance(extractdata(data) || []));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quiz performance';
    dispatch(setquizperformanceerror(message));
    toast.error(message);
    return false;
  }
}

export const asyncfetchdocumenttypes = () => async (dispatch) => {
  try {
    dispatch(setdocumenttypesloading());
    const { data } = await api.get('/progress/document-types');
    dispatch(setdocumenttypes(extractdata(data) || []));
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch document types';
    dispatch(setdocumenttypeserror(message));
    toast.error(message);
    return false;
  }
}