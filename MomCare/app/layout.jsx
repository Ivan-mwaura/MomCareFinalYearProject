import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "./styles/theme"; // Assuming you have a global theme file


export default function Layout() {
  return (


      <SafeAreaView style={styles.safeArea}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, // Use your app's global background color
  },
});
