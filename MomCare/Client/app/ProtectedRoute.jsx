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
  // Decode the payload from base64
  const decodedPayload = base64Decode(payload);
  return JSON.parse(decodedPayload);
};

// Helper to check token expiry
const isTokenValid = (token) => {
  try {
    const decoded = decodeJWTManually(token);
    //console.log("Token decoded:", decoded);
    // decoded.exp is in seconds, so multiply by 1000
    const isValid = decoded.exp * 1000 > Date.now();
    //console.log("Token is valid:", isValid);
    return isValid;
  } catch (error) {
    //console.error("Error decoding token:", error);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    //console.log("Token from AsyncStorage:", token);
    if (!token || !isTokenValid(token)) {
      //console.log("Token is invalid or not found, redirecting to login");
      router.replace("/auth/login");
      setAuthenticated(false);
    } else {
      //console.log("Token is valid, setting authenticated to true");
      setAuthenticated(true);
    }
    setLoading(false);
  };

  // Re-check auth on screen focus
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

  return authenticated ? children : null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProtectedRoute;
