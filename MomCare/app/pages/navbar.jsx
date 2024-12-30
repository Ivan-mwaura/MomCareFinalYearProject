import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHeight] = useState(new Animated.Value(0));
  const router = useRouter();
  const unreadCount = 3;

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 290;
    setMenuVisible((prev) => !prev);
    Animated.timing(menuHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const navigateTo = (path) => {
    setMenuVisible(false);
    Animated.timing(menuHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      router.push(path);
    });
  };



  return (
    <View style={styles.navbarContainer}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/mom-care-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>MomCare</Text>
      </View>
      
            {/* SOS Emergency Button */}


      {/* Notification Bell */}
      <TouchableOpacity
        onPress={() => router.push("/pages/notifications")}
        style={styles.notificationContainer}
      >
        <Ionicons
          name="notifications-outline"
          size={28}
          color={COLORS.textPrimary}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => router.push("/pages/emergencypage")}
      >
        <Text style={styles.sosIcon}>🚨</Text>
      </TouchableOpacity>

      {/* Hamburger Icon */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburger}>
        <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
      </TouchableOpacity>

      {/* Collapsible Menu */}
      <Animated.View style={[styles.menu, { height: menuHeight }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/dashboard")}
        >
          <Ionicons name="home-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.menuText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/appointments")}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.menuText}>Appointments</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/riskassessment")}
        >

          <Ionicons
            name="pulse-outline"
            size={20}
            color={COLORS.textPrimary}
          />

          <Text style={styles.menuText}>Risk assessment</Text>  
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/healthrecordspage")}
        >
        <Ionicons
        name="flask-outline"
        size={20}
        color={COLORS.textPrimary}
        />
        <Text
          style={styles.menuText}
        >
            My Health records
        </Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/supportandfeedback")}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.menuText}>Support and feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/healtheducationpages")}
        >
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.menuText}>Health tips & Faq's</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pages/personalizationandaccount")}
        >
          <Ionicons
            name="person-circle-outline"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    position: "relative",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.background,
  },

  sosButton: {
    position: 'absolute',
    left: 230, 
    top: 10,
  },

  notificationContainer: {
    position: "absolute",
    right: 60,
    top: 12,
  },
  sosIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  hamburger: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  menu: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    overflow: "hidden",
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

export default Navbar;
