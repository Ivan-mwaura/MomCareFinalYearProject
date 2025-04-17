// src/api/pushNotifications.js
import axios from 'axios'
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your actual backend URL, or use an environment variable
const BACKEND_URL =  BACKEND_URL || 'https://your-backend-url.com';
const motherId = AsyncStorage.getItem("user").motherId;

console.log("Mother ID: ", motherId);

export async function sendPushTokenToServer(token) {
  try {
    await axios.post(`${BACKEND_URL}/api/registerPushToken`, { token , motherId});
  } catch (error) {
    console.error("Error sending push token:", error.message);
  }
}
