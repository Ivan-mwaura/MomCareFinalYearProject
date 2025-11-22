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
import { LinearGradient } from "expo-linear-gradient";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHeight] = useState(new Animated.Value(0));
  const router = useRouter();
  const unreadCount = 3;

  const toggleMenu = () => {
    const toValue = menuVisible ? 0 : 360; // Adjusted height for new menu items
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
    }).start(() => router.push(path));
  };

  return (
    <View style={styles.navbarContainer}>
      {/* Header Gradient */}
      <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.headerGradient}>
        {/* Logo and Title */}
        <TouchableOpacity style={styles.logoContainer} onPress={() => navigateTo("/pages/dashboard")}>
          <Image
            source={require("../../assets/mom-care-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>MamaCare</Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/pages/notifications")}
        >
          <Ionicons name="notifications" size={24} color="#FFF" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* SOS Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/pages/emergencypage")}
        >
          <Ionicons name="alert-circle" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Hamburger Icon */}
        <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
          <Ionicons
            name={menuVisible ? "close" : "menu"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Collapsible Menu */}
      <Animated.View style={[styles.menu, { height: menuHeight }]}>
        <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.menuGradient}>
          <MenuItem
            icon="home"
            text="Home Sweet Home"
            path="/pages/dashboard"
            onPress={navigateTo}
          />
          <MenuItem
            icon="calendar"
            text="Mama's Dates"
            path="/pages/appointments"
            onPress={navigateTo}
          />
          <MenuItem
            icon="pulse"
            text="Wellness Check"
            path="/pages/riskassessment"
            onPress={navigateTo}
          />
          <MenuItem
            icon="flask"
            text="Health Story"
            path="/pages/healthrecordspage"
            onPress={navigateTo}
          />
          <MenuItem
            icon="chatbubble"
            text="Support Circle"
            path="/pages/supportandfeedback"
            onPress={navigateTo}
          />
          <MenuItem
            icon="book"
            text="Mama's Wisdom"
            path="/pages/healtheducationpages"
            onPress={navigateTo}
          />
          <MenuItem
            icon="person"
            text="My Space"
            path="/pages/personalizationandaccount"
            onPress={navigateTo}
          />
          <MenuItem
            icon="notifications"
            text="Test Notifications"
            path="/pages/testNotifications"
            onPress={navigateTo}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const MenuItem = ({ icon, text, path, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={() => onPress(path)}>
    <Ionicons name={icon} size={20} color="#FF6B6B" />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  navbarContainer: {
    position: "relative",
    zIndex: 10,
  },
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FFF",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  badgeText: {
    color: "#FF6B6B",
    fontSize: 10,
    fontWeight: "600",
  },
  menu: {
    overflow: "hidden",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 5,
  },
  menuGradient: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
});

export default Navbar;