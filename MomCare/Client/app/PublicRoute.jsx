import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { decode as base64Decode } from "base-64";

// Manually decode the JWT payload
const decodeJWTManually = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }
  const payload = parts[1];
  // Decode the payload from base64 and parse it as JSON
  const decodedPayload = base64Decode(payload);
  return JSON.parse(decodedPayload);
};

// Helper to check token expiry
const isTokenValid = (token) => {
  try {
    const decoded = decodeJWTManually(token);
    // decoded.exp is in seconds, so multiply by 1000 for comparison with Date.now()
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const PublicRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notAuthenticated, setNotAuthenticated] = useState(true);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token && isTokenValid(token)) {
      // If token exists and is valid, redirect to dashboard
      router.replace("/pages/dashboard");
      setNotAuthenticated(false);
    } else {
      setNotAuthenticated(true);
    }
    setLoading(false);
  };

  // Re-check auth when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      checkAuth();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return notAuthenticated ? children : null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PublicRoute;
