import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setauthloading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    setauthsuccess: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
      state.isAuthenticated = true;
    },
    setautherror: (state, action) => {
      state.status = 'failed';
      state.error = action.payload || null;
    }
  }
});

export default authSlice.reducer;
export const { setautherror, setauthloading, setauthsuccess } = authSlice.actions;