import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAppointment: null,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
  },
});

export const { setSelectedAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
