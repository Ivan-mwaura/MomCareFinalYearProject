import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton";
import { useRouter } from "expo-router";
import { BACKEND_URL } from "@env";

const PersonalizationAndAccount = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [privacySettings, setPrivacySettings] = useState("Public");
  const [language, setLanguage] = useState("English");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      fetchProfile(token);
    };
    checkToken();
  }, [router]);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.user;
      setProfile(user);
      setName(`${user.firstName} ${user.lastName}`);
      setContact(user.phone);
      setEmail(user.email);
      setLocation(user.location || "Not set");
      setEmergencyContact(user.emergencyContact || "Not set");
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (key, value) => {
    switch (key) {
      case "name": setName(value); break;
      case "contact": setContact(value); break;
      case "email": setEmail(value); break;
      case "location": setLocation(value); break;
      case "emergencyContact": setEmergencyContact(value); break;
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const [firstName, ...lastNameArr] = name.split(" ");
      const lastName = lastNameArr.join(" ") || "";
      const updatedData = {
        firstName,
        lastName,
        email,
        phone: contact,
        location,
        emergencyContact,
      };
      const response = await axios.put(
        `${BACKEND_URL}/api/users/profile`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.user);
      setIsEditing(false);
      alert("Profile updated, mama!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Oops! Something went wrong. Try again.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (loading || !profile) {
    return (
      <LinearGradient colors={["#FFF5F7", "#F8F9FA"]} style={styles.loadingContainer}>
        <CustomSkeleton style={styles.headerSkeleton} />
        <CustomSkeleton style={styles.fieldSkeleton} />
        <CustomSkeleton style={styles.fieldSkeleton} />
        <CustomSkeleton style={styles.fieldSkeleton} />
      </LinearGradient>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="person" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama’s Space</Text>
        <Text style={styles.headerSubtitle}>Make it yours</Text>
      </LinearGradient>

      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Details</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          >
            <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.editGradient}>
              <Ionicons
                name={isEditing ? "checkmark" : "pencil"}
                size={18}
                color="#FFF"
                style={styles.editIcon}
              />
              <Text style={styles.editText}>{isEditing ? "Save" : "Edit"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.profileCard}>
          <ProfileField label="Name" value={name} onChange={handleProfileUpdate} keyName="name" editable={isEditing} />
          <ProfileField label="Phone" value={contact} onChange={handleProfileUpdate} keyName="contact" editable={isEditing} />
          <ProfileField label="Email" value={email} onChange={handleProfileUpdate} keyName="email" editable={isEditing} />
          <ProfileField label="Location" value={location} onChange={handleProfileUpdate} keyName="location" editable={isEditing} />
          <ProfileField label="Emergency Contact" value={emergencyContact} onChange={handleProfileUpdate} keyName="emergencyContact" editable={isEditing} />
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingOption
            label="Notifications"
            value={notificationEnabled}
            onChange={setNotificationEnabled}
            type="switch"
          />
          <SettingOption
            label="Privacy"
            value={privacySettings}
            onPress={() => setPrivacySettings(privacySettings === "Public" ? "Private" : "Public")}
            type="dropdown"
          />
          <SettingOption
            label="Language"
            value={language}
            onPress={() => setLanguage(language === "English" ? "Swahili" : "English")}
            type="dropdown"
          />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.logoutGradient}>
            <Ionicons name="log-out" size={20} color="#FFF" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileField = ({ label, value, onChange, keyName, editable }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
      value={value}
      onChangeText={(text) => onChange(keyName, text)}
      editable={editable}
      placeholder={`Enter ${label.toLowerCase()}`}
      placeholderTextColor="#999"
    />
  </View>
);

const SettingOption = ({ label, value, onChange, onPress, type }) => (
  <View style={styles.settingOption}>
    <Text style={styles.settingLabel}>{label}</Text>
    {type === "switch" ? (
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#DDD", true: "#FF6B6B" }}
        thumbColor={value ? "#FFF" : "#F0F0F0"}
      />
    ) : (
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={styles.dropdownText}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color="#FF6B6B" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSkeleton: {
    width: "50%",
    height: 28,
    borderRadius: 8,
    marginBottom: 20,
  },
  fieldSkeleton: {
    width: "80%",
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6B6B",
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  editButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  editGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editIcon: {
    marginRight: 6,
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  fieldInputDisabled: {
    backgroundColor: "#F8F9FA",
    color: "#777",
  },
  settingsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#FF6B6B",
    marginRight: 8,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default PersonalizationAndAccount;