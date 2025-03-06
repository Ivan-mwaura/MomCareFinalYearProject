import React, { useEffect, useRef } from "react";
import { ExpoRoot } from "expo-router";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./notifications"; // Ensure this path is correct

export default function App() {
  const ctx = require.context("./app"); // Loads all routes from the `app/` directory
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications and get the token
    registerForPushNotificationsAsync().then((token) => {
      console.log("Push token:", token);
      // Optionally send the token to your backend here
    });

    // Listener: when a notification is received while the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Received:", notification);
      }
    );

    // Listener: when the user taps on a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification Response:", response);
        // Here you can navigate to a specific screen based on the notification
      }
    );

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <>
      <ExpoRoot context={ctx} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}
