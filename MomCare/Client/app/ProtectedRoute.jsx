import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import jwtDecode from "jwt-decode";

// Helper to check token expiry
const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    // decoded.exp is in seconds, so multiply by 1000
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token || !isTokenValid(token)) {
      router.replace("/auth/login");
      setAuthenticated(false);
    } else {
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
