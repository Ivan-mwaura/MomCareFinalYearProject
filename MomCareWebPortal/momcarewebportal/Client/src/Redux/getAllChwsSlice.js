// In your CHW Redux slice (getAllChwsSlice.js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

export const fetchCHWs = createAsyncThunk(
  'chws/fetchCHWs',
  async () => {
    const response = await axiosInstance.get('/chws');
    return response.data.data;
  }
);

const chwSlice = createSlice({
  name: 'chws',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCHWs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCHWs.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCHWs.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default chwSlice.reducer;
