// In your CHW Redux slice (getAllChwsSlice.js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchCHWs = createAsyncThunk(
  'chws/fetchCHWs',
  async () => {
    const token = Cookies.get("token");
    const response = await axios.get('http://localhost:5000/api/chws', {
      headers: { Authorization: `Bearer ${token}` }
    });
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
