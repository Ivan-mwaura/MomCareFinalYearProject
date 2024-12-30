import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SIZES } from "../styles/theme";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
    } else {
      Alert.alert("Success", "Password reset link sent!");
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address to receive a password reset link.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.accent,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default ForgotPassword;
