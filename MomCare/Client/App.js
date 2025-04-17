// App.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ExpoRoot } from "expo-router";
import Toast from "react-native-toast-message";
import useExpoPushNotifications from "./useExpoPushNotifications";

export default function App() {
  // Call the hook so that registration occurs at app launch
  const { expoPushToken } = useExpoPushNotifications();

  const ctx = require.context("./app");

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Expo Push Token:</Text>
        <Text style={styles.token}>{expoPushToken || "Loading token..."}</Text>
      </View>
      <ExpoRoot context={ctx} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    zIndex: 1000,
  },
  title: {
    color: '#fff',
    fontSize: 12,
  },
  token: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
