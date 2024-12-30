import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";

const EmergencyAssistance = () => {
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  const [isLocationShared, setIsLocationShared] = useState(false);

  const firstAidGuidance = {
    Choking: "1. Stand behind the person and wrap your arms around their waist.\n2. Make a fist and place it just above their navel.\n3. Grasp your fist with your other hand and thrust inward and upward.\n4. Repeat until the object is expelled or the person becomes unresponsive.\n5. If unresponsive, begin CPR and call emergency services.",
    "High Fever": "1. Check the temperature using a thermometer.\n2. Offer plenty of fluids to prevent dehydration.\n3. Use a damp cloth to cool the person's forehead and body.\n4. Administer fever-reducing medication if prescribed.\n5. Monitor for additional symptoms and seek medical attention if fever persists for over 24 hours.",
  };

  const emergencyContacts = {
    Ambulance: "+123456789",
    "Nearest Hospital": "+987654321",
    "Fire Department": "+112233445",
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert("Error", "Failed to initiate call. Please try again.")
    );
  };

  const handleSOS = () => {
    if (!isLocationShared) {
      Alert.alert(
        "Location Required",
        "Please share your live location before sending an SOS alert."
      );
      return;
    }

    Alert.alert(
      "SOS Triggered",
      "An SOS alert has been sent to the nearest emergency services and your CHW.",
      [{ text: "OK" }]
    );
  };

  const toggleLocationSharing = () => {
    setIsLocationShared((prev) => !prev);
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

      {/* Share Live Location */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isLocationShared ? "Location Shared" : "Share Live Location"}
        </Text>
        <Switch
          value={isLocationShared}
          onValueChange={toggleLocationSharing}
          trackColor={{ false: COLORS.secondary, true: COLORS.primary }}
          thumbColor={isLocationShared ? COLORS.background : COLORS.secondary}
        />
        {isLocationShared && (
          <Ionicons name="location-outline" size={24} color={COLORS.primary} />
        )}
      </View>

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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchText: {
    fontSize: 16,
    color: COLORS.textPrimary,
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
