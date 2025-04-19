import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosConfig';

// Async thunk to fetch appointments from the backend
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    const response = await axiosInstance.get('/appointments');
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
