import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async () => {
    const token = Cookies.get("token");
    const response = await axios.get('http://localhost:5000/api/alerts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Assuming response.data.data is the alerts array
    return response.data.data;
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
