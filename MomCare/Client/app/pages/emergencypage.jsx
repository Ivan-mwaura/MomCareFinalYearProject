import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, SIZES } from "../styles/theme";
import { BACKEND_URL } from "@env";

const EmergencyAssistance = () => {
  const [selectedGuidance, setSelectedGuidance] = useState(null);

  // Static first aid guidance
  const firstAidGuidance = {
    Choking:
      "1. Stand behind the person and wrap your arms around their waist.\n2. Make a fist and place it just above their navel.\n3. Grasp your fist with your other hand and thrust inward and upward until the object is expelled.\n4. If the person becomes unresponsive, begin CPR and call emergency services immediately.",
    "High Fever":
      "1. Check the temperature using a thermometer.\n2. Encourage the person to drink plenty of fluids.\n3. Use a cool compress on the forehead.\n4. If the fever persists, seek immediate medical attention.",
  };

  // Emergency contacts (static)
  const emergencyContacts = {
    Ambulance: "+123456789",
    "Nearest Hospital": "+987654321",
    "Fire Department": "+112233445",
  };

  // When SOS is pressed, use user data from AsyncStorage to build and send the alert
  const handleSOS = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert("Error", "User details not found. Please log in again.");
        return;
      }
      const user = JSON.parse(userData);
      // Use the user's id (or motherId if available) as the patientId and combine firstName and lastName
      const patientId = user.motherId ? user.motherId : user.id;
      const patientName = `${user.firstName} ${user.lastName}`;
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      const payload = {
        type: "High-Risk Pregnancy",
        description: "Immediate attention required",
        patientId,
        patientName,
        date: currentDate,
      };

      await axios.post(`${BACKEND_URL}/alerts`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert(
        "SOS Alert Sent",
        "Dear " + patientName + ", your emergency alert has been sent. Please await assistance."
      );
    } catch (error) {
      console.error("Error sending SOS alert:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to send SOS alert. Please try again.");
    }
  };

  // Function to handle calling an emergency contact
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert("Error", "Failed to initiate call. Please try again.")
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title Section */}
      <Text style={styles.title}>Emergency Assistance</Text>
      <Text style={styles.subtitle}>
        Quick access to emergency healthcare services.
      </Text>

      {/* SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Ionicons name="alert-circle-outline" size={24} color={COLORS.background} />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {Object.keys(emergencyContacts).map((key, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactButton}
            onPress={() => handleCall(emergencyContacts[key])}
          >
            <Ionicons name="call-outline" size={20} color={COLORS.background} />
            <Text style={styles.contactText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* First Aid Guidance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>First Aid Guidance</Text>
        {Object.keys(firstAidGuidance).map((key, index) => (
          <TouchableOpacity
            key={index}
            style={styles.guidanceButton}
            onPress={() => setSelectedGuidance(key)}
          >
            <Ionicons name="medkit-outline" size={20} color={COLORS.primary} />
            <Text style={styles.guidanceText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Guidance Details */}
      <Modal
        transparent={true}
        visible={!!selectedGuidance}
        animationType="slide"
        onRequestClose={() => setSelectedGuidance(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedGuidance}</Text>
            <Text style={styles.modalText}>
              {firstAidGuidance[selectedGuidance]}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedGuidance(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sosText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    color: COLORS.background,
    fontSize: 16,
    marginLeft: 10,
  },
  guidanceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  guidanceText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: COLORS.background,
    fontSize: 16,
  },
});

export default EmergencyAssistance;
