// useFirebasePushNotifications.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

export default function useFirebasePushNotifications() {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    async function register() {
      console.log("[FCM Hook] Requesting notification permission...");
      const authStatus = await messaging().requestPermission();
      console.log("[FCM Hook] Permission status:", authStatus);

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert('Permission not granted', 'Cannot get push token for notifications!');
        console.log("[FCM Hook] Notification permission was not granted.");
        return;
      }

      try {
        console.log("[FCM Hook] Retrieving FCM token...");
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log("[FCM Hook] FCM Token:", token);

        // Store the token in AsyncStorage
        await AsyncStorage.setItem('fcmToken', token);

        // Send the token to your backend server
        const userToken = await AsyncStorage.getItem('token');
        if (userToken) {
          try {
            await fetch(`${BACKEND_URL}/api/users/update-fcm-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
              },
              body: JSON.stringify({ fcmToken: token }),
            });
            console.log("[FCM Hook] FCM token sent to backend successfully");
          } catch (error) {
            console.error("[FCM Hook] Error sending FCM token to backend:", error);
          }
        }
      } catch (error) {
        Alert.alert('Error', `${error}`);
        console.error("[FCM Hook] Error during token registration:", error);
      }
    }

    register();

    // Listen for token refresh events
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      setFcmToken(token);
      console.log("[FCM Hook] Refreshed FCM Token:", token);
      AsyncStorage.setItem('fcmToken', token);
    });

    // Handle incoming notifications when app is in foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log("[FCM Hook] Received foreground notification:", remoteMessage);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [{ text: 'OK' }]
      );
    });

    // Handle notification press when app is in background/quit
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("[FCM Hook] Notification opened from background state:", remoteMessage);
      // You can navigate to a specific screen based on the notification data
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log("[FCM Hook] App opened from notification:", remoteMessage);
          // You can navigate to a specific screen based on the notification data
        }
      });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
    };
  }, []);

  return fcmToken;
}
