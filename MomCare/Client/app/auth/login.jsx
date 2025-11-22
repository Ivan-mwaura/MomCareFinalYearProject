import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Notifications from 'expo-notifications';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: "Please fill in both fields, mama.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Get and send Expo push token after successful login
      const expoPushToken = await AsyncStorage.getItem('expoPushToken');
      if (expoPushToken) {
        try {
          await axios.post(
            `${BACKEND_URL}/api/mothers/update-expo-token`,
            { expoPushToken },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } catch (error) {
          console.error('Error sending Expo token to backend:', error);
        }
      }

      Toast.show({
        type: "success",
        text1: "Welcome Back!",
        text2: "You're in, mama!",
      });
      router.push("/pages/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      Toast.show({
        type: "error",
        text1: "Oh No!",
        text2: error.response?.data?.message || "Something went wrong, sweetie.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Logo */}
          <Image
            source={require("../../assets/mom-care-logo.png")}
            style={styles.logo}
          />

          {/* Welcome Text */}
          <Text style={styles.title}>Hello, Mama!</Text>
          <Text style={styles.subtitle}>
            Step back into your caring space with love.
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
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push("/auth/forgotpassword")}
            style={styles.forgotLink}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Come In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => router.push("/auth/signup")}
            style={styles.signUpLink}
          >
            <Text style={styles.signUpText}>
              New here? <Text style={styles.signUpHighlight}>Join the Mama Circle</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Toast />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
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
    marginBottom: 16,
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
  forgotLink: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  linkText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  buttonGradient: {
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  signUpLink: {
    marginTop: 8,
  },
  signUpText: {
    fontSize: 14,
    color: "#777",
  },
  signUpHighlight: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default Login;