import React, { useState } from "react";
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
import { COLORS, SIZES } from "../styles/theme";

const PersonalizationAndAccount = () => {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    contact: "+1234567890",
    email: "jane.doe@gmail.com",
    location: "Nairobi, Kenya",
    emergencyContact: "+9876543210",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [privacySettings, setPrivacySettings] = useState("Public");
  const [language, setLanguage] = useState("English");

  const handleProfileUpdate = (key, value) => {
    setProfile((prevProfile) => ({ ...prevProfile, [key]: value }));
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

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
              <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
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
              value={profile.name}
              onChangeText={(value) => handleProfileUpdate("name", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Contact</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.contact}
              onChangeText={(value) => handleProfileUpdate("contact", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.email}
              onChangeText={(value) => handleProfileUpdate("email", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.location}
              onChangeText={(value) => handleProfileUpdate("location", value)}
              editable={isEditing}
            />
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.emergencyContact}
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
            onValueChange={(value) => setNotificationEnabled(value)}
            trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
            thumbColor={notificationEnabled ? COLORS.background : COLORS.secondary}
          />
        </View>
        <View style={styles.settingsOption}>
          <Text style={styles.settingsLabel}>Privacy Settings</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() =>
              setPrivacySettings(
                privacySettings === "Public" ? "Private" : "Public"
              )
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
            onPress={() =>
              setLanguage(language === "English" ? "Swahili" : "English")
            }
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
    borderColor: COLORS.secondary
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
