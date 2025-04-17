import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Index = () => {
  const router = useRouter();

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/mom-care-logo.png")}
        style={styles.logo}
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Mama’s Haven</Text>
      <Text style={styles.subtitle}>
        A warm embrace for every step of your journey.
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => router.push("/auth/signup")}
      >
        <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
          <Ionicons name="heart" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Join the Circle</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.secondaryText}>
          Already with us? <Text style={styles.secondaryHighlight}>Come In</Text>
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
  logo: {
    width: 140,
    height: 140,
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 56,
    lineHeight: 26,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryText: {
    fontSize: 16,
    color: "#777",
  },
  secondaryHighlight: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default Index;