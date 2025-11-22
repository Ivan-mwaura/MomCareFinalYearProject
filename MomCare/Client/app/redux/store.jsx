import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./appointmentsSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
  },
});

export default store;
