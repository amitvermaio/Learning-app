import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: null,
  quizPerformance: [],
  documentTypes: [],
  status: 'idle',
  quizPerformanceStatus: 'idle',
  documentTypesStatus: 'idle',
  error: null,
  quizPerformanceError: null,
  documentTypesError: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setprogressloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setdashboard: (state, action) => {
      state.status = 'succeeded';
      state.dashboard = action.payload || null;
    },
    setquizperformanceloading: (state) => {
      state.quizPerformanceStatus = 'loading';
      state.quizPerformanceError = null;
    },
    setquizperformance: (state, action) => {
      state.quizPerformanceStatus = 'succeeded';
      state.quizPerformance = action.payload || [];
    },
    setquizperformanceerror: (state, action) => {
      state.quizPerformanceStatus = 'failed';
      state.quizPerformanceError = action.payload || null;
    },
    setdocumenttypesloading: (state) => {
      state.documentTypesStatus = 'loading';
      state.documentTypesError = null;
    },
    setdocumenttypes: (state, action) => {
      state.documentTypesStatus = 'succeeded';
      state.documentTypes = action.payload || [];
    },
    setdocumenttypeserror: (state, action) => {
      state.documentTypesStatus = 'failed';
      state.documentTypesError = action.payload || null;
    },
    setprogresserror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    },
  },
});

export const {
  setprogressloading,
  setdashboard,
  setquizperformanceloading,
  setquizperformance,
  setquizperformanceerror,
  setdocumenttypesloading,
  setdocumenttypes,
  setdocumenttypeserror,
  setprogresserror
} = progressSlice.actions;

export default progressSlice.reducer;
