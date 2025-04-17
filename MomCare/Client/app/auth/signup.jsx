import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields, mama!");
    } else if (password !== confirmPassword) {
      alert("Passwords don’t match, sweetie!");
    } else {
      alert("Welcome to the circle, mama!");
      router.push("/auth/login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Header */}
          <Ionicons name="heart" size={48} color="#FF6B6B" style={styles.headerIcon} />
          <Text style={styles.title}>Join Mama’s Circle</Text>
          <Text style={styles.subtitle}>
            Start your journey with love and care.
          </Text>

          {/* Input Fields */}
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
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Step In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already with us? <Text style={styles.loginHighlight}>Come Back</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  signupButton: {
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

export default Signup;