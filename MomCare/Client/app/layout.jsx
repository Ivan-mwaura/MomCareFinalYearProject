import React from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { COLORS } from "./styles/theme";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthLayout from "./auth/_layout"; // adjust path if necessary
import PagesLayout from "./pages/_layout"; // adjust path if necessary

export default function Layout() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <Stack
          screenOptions={{
            // Disables animations entirely
            animation: "none",
          }}
        >
          {/* Authentication screens (login, signup, forgot password) */}
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
            getComponent={() => (
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            )}
          />
          {/* Main app screens */}
          <Stack.Screen
            name="(pages)"
            options={{ headerShown: false }}
            getComponent={() => (
              <ProtectedRoute>
                <PagesLayout />
              </ProtectedRoute>
            )}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
