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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES } from "../styles/theme";
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

  // Local state fields for profile details
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
    };
  
    checkToken();
  }, []); 

  // Fetch profile data from the backend when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {


        //console.log("Token:", token);

        //console.log("backend url", BACKEND_URL);
        const response = await axios.get(
          `${BACKEND_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const user = response.data.user;
        setProfile(user);
        setName(`${user.firstName} ${user.lastName}`);
        setContact(user.phone);
        setEmail(user.email);
        setLocation(user.location);
        setEmergencyContact(user.emergencyContact || "");
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update local fields on change
  const handleProfileUpdate = (key, value) => {
    if (key === "name") setName(value);
    if (key === "contact") setContact(value);
    if (key === "email") setEmail(value);
    if (key === "location") setLocation(value);
    if (key === "emergencyContact") setEmergencyContact(value);
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Optionally, clear AsyncStorage and redirect to login here.

    // For now, just clear AsyncStorage
    AsyncStorage.removeItem("token");

    // Redirect to login
    router.push("/auth/login");
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // Save the updated profile to the backend
  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // Assume name is "FirstName LastName"
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
        "http://192.168.0.106:5000/api/users/profile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile");
    }
  };

  // Show skeleton loader while loading data
  if (loading || !profile) {
    return (
      <ScrollView contentContainerStyle={styles.loadingContainer}>
        <CustomSkeleton style={styles.headerSkeleton} />
        <CustomSkeleton style={[styles.lineSkeleton, { width: "80%", marginTop: 10 }]} />
        <CustomSkeleton style={[styles.lineSkeleton, { width: "60%", marginTop: 10 }]} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* My Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Profile</Text>
        <View style={styles.profileCard}>
          <Ionicons
            name="person-circle-outline"
            size={80}
            color={COLORS.primary}
            style={styles.profileIcon}
          />
          <View style={styles.profileDetails}>
            <View style={styles.editHeader}>
              <Text style={styles.label}>Profile Details</Text>
              <TouchableOpacity
                onPress={isEditing ? handleSaveProfile : toggleEditMode}
                style={styles.editButton}
              >
                <Ionicons
                  name={isEditing ? "checkmark-outline" : "pencil-outline"}
                  size={20}
                  color={COLORS.background}
                />
                <Text style={styles.editButtonText}>
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={(value) => handleProfileUpdate("name", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Contact</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={contact}
              onChangeText={(value) => handleProfileUpdate("contact", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={(value) => handleProfileUpdate("email", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={location}
              onChangeText={(value) => handleProfileUpdate("location", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={emergencyContact}
              onChangeText={(value) => handleProfileUpdate("emergencyContact", value)}
              editable={isEditing}
            />
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsOption}>
          <Text style={styles.settingsLabel}>Notifications</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
            thumbColor={notificationEnabled ? COLORS.background : COLORS.secondary}
          />
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.settingsLabel}>Privacy Settings</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() =>
              setPrivacySettings(privacySettings === "Public" ? "Private" : "Public")
            }
          >
            <Text style={styles.dropdownText}>{privacySettings}</Text>
            <Ionicons name="chevron-down-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.settingsLabel}>Language</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setLanguage(language === "English" ? "Swahili" : "English")}
          >
            <Text style={styles.dropdownText}>{language}</Text>
            <Ionicons name="chevron-down-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.background} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  loadingContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSkeleton: {
    width: "60%",
    height: 28,
    borderRadius: 4,
  },
  lineSkeleton: {
    width: "80%",
    height: 20,
    borderRadius: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  profileCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  profileIcon: {
    marginBottom: 15,
  },
  profileDetails: {
    width: "100%",
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    color: COLORS.background,
    fontSize: 14,
    marginLeft: 5,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.borderRadius,
    padding: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  inputDisabled: {
    backgroundColor: COLORS.secondaryLight,
    color: COLORS.textSecondary,
  },
  settingsOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    marginBottom: 15,
  },
  settingsLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    marginTop: 20,
  },
  logoutText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default PersonalizationAndAccount;
