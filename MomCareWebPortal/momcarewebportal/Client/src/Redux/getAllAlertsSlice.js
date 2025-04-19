import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async () => {
    const response = await axiosInstance.get('/alerts');
    // Make sure we handle both possible response structures
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
);

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default alertsSlice.reducer;
