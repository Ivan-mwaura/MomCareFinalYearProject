import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk to fetch appointments from the backend
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    const token = Cookies.get("token");
    const response = await axios.get('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Assuming the API returns { data: [ ... ] }
    return response.data.data;
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default appointmentsSlice.reducer;
