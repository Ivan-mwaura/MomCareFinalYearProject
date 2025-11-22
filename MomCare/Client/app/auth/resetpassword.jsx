import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { BACKEND_URL } from "@env";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email || !resetCode || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long!");
      return;
    }

    try {
      setLoading(true);
      // Verify reset code
      const verifyResponse = await axios.post(`${BACKEND_URL}/api/password-reset/verify`, {
        email,
        resetCode,
      });

      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || "Invalid reset code.");
      }

      // Reset password
      const resetResponse = await axios.post(`${BACKEND_URL}/api/password-reset/reset`, {
        email,
        resetCode,
        newPassword,
      });

      if (resetResponse.data.success) {
        Alert.alert(
          "Success",
          "Password reset successfully! Please log in with your new password.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/login"),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.container}>
      {/* Header */}
      <Ionicons name="lock-closed" size={48} color="#FF6B6B" style={styles.headerIcon} />
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>
        Enter the reset code and your new password.
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      {/* Reset Code Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="code" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Reset Code"
          placeholderTextColor="#999"
          value={resetCode}
          onChangeText={setResetCode}
          autoCapitalize="characters"
          editable={!loading}
        />
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#FF6B6B" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.resetButton, loading && styles.disabledButton]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Reset Password</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Back to Login Link */}
      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>
          Back to <Text style={styles.loginHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 12,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  resetButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  loginLink: {
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: "#777",
  },
  loginHighlight: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default ResetPassword;