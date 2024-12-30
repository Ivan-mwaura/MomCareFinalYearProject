import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../app/styles/theme";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/mom-care-logo.png")}
        style={styles.logo}
      />

      {/* Title and Subtitle */}
      <Text style={styles.title}>Welcome to MomCare</Text>
      <Text style={styles.subtitle}>
        Supporting mothers every step of the way with care and confidence.
      </Text>

      {/* Primary Button */}
      <TouchableOpacity
        style={styles.buttonPrimaryWrapper}
        onPress={() => router.push("/auth/signup")}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          style={styles.buttonPrimary}
        >
          <Text style={styles.buttonPrimaryText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secondary Button */}
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonSecondaryText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.padding,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonPrimaryWrapper: {
    width: "80%",
    borderRadius: SIZES.borderRadius,
    overflow: "hidden", // Ensures gradient stays within button bounds
    marginBottom: 15,
  },
  buttonPrimary: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  buttonPrimaryText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonSecondary: {
    borderColor: COLORS.accent,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: SIZES.borderRadius,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: COLORS.accent,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default Index;
