import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk to fetch mothers' data from the API with token authentication
export const fetchMothers = createAsyncThunk(
  'mothers/fetchMothers',
  async () => {
    const token = Cookies.get("token");
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mothers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Assuming the backend returns { data: [ ... ] }
    return response.data.data;
  }
);

const motherSlice = createSlice({
  name: 'mothers',
  initialState: {
    data: [],  // Array to store the list of mothers
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMothers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMothers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchMothers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default motherSlice.reducer;
