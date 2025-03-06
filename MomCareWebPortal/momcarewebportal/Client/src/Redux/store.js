// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import motherReducer from './getAllMothersSlice';  // Import the updated motherSlice
import chwReducer from './getAllChwsSlice';  // Import the updated chwSlice
import alertReducer from './getAllAlertsSlice';  // Import the updated alertSlice
import notificationReducer from './getAllNotificationsSlice';  // Import the updated notificationSlice
import appointmentReducer from './getAllAppointmentsSlice';  // Import the updated appointmentSlice

const store = configureStore({
  reducer: {
    mothers: motherReducer,  // Using mothers reducer
    chws: chwReducer,
    alerts: alertReducer,
    notifications: notificationReducer,
    appointments: appointmentReducer,  // Using appointments reducer
  },
});

export default store;
