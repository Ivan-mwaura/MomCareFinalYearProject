import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axiosInstance.get('/notifications');
    // Notifications are returned as a direct array, not nested under data property
    return Array.isArray(response.data) ? response.data : [];
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default notificationsSlice.reducer;
