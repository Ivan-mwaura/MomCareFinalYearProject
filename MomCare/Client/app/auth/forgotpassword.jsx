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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email, mama!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/password-reset/request`, {
        email,
      });

      if (response.data.success) {
        Alert.alert(
          "Success",
          "A reset code has been sent to your email. Please check your inbox.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/resetpassword"),
            },
          ]
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.container}>
      {/* Header */}
      <Ionicons name="key" size={48} color="#FF6B6B" style={styles.headerIcon} />
      <Text style={styles.title}>Mama's Key</Text>
      <Text style={styles.subtitle}>
        Let's get you back in with a reset code.
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

      {/* Reset Button */}
      <TouchableOpacity 
        style={[styles.resetButton, loading && styles.disabledButton]} 
        onPress={handleReset}
        disabled={loading}
      >
        <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Send Reset Code</Text>
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

export default ForgotPassword;