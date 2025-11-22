import React from "react";
import { Stack } from "expo-router";
import PublicRoute from "../PublicRoute";

const AuthLayout = () => {
  return (
    <PublicRoute>
      <Stack
                screenOptions={{
                  // Disables animations entirely
                  animation: "none",
                }}
      >
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{ headerShown: false }}
        />
      </Stack>
    </PublicRoute>
  );
};

export default AuthLayout;
