import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  currentdocument: null,
  currentdocumentLoading: false,
  status: 'idle',
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setdocumentloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },

    setdocuments: (state, action) => {
      state.status = 'succeeded';
      state.documents = action.payload ?? [];
      state.error = null;
    },

    setcurrentdocument: (state, action) => {
      state.status = 'succeeded';
      state.currentdocument = action.payload ?? null;
      state.error = null;
    },

    setcurrentdocumentloading: (state, action) => {
      state.currentdocumentLoading = action.payload;
    },

    setdocumenterror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload ?? 'Something went wrong';
    },
  },
});

export const {
  setdocumentloading,
  setdocuments,
  setcurrentdocument,
  setdocumenterror,
  setcurrentdocumentloading,
} = documentSlice.actions;

export default documentSlice.reducer;