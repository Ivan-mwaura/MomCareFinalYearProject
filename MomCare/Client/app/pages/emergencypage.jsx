import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Platform,
  Vibration,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from 'expo-location';
import { BACKEND_URL } from "@env";

const EmergencyAssistance = () => {
  // State management
  const [selectedGuidance, setSelectedGuidance] = useState(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [sosTimer, setSOSTimer] = useState(3);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [emergencyContacts, setEmergencyContacts] = useState({
    "Ambulance": "911",
    "Maternity Ward": "+254792837465",
    "Poison Control": "+254728837965",
    "Family Doctor": "+254791737405",
  });

  // First aid guidance with comprehensive information
  const firstAidGuidance = {
    "Bleeding During Pregnancy": {
      urgency: "HIGH",
      steps: [
        "Lie down on your left side to improve blood flow",
        "Place feet elevated slightly above heart level",
        "Call emergency services immediately",
        "Note the amount and color of bleeding",
        "Do not insert anything into the vagina",
        "Save any tissue passed for medical examination",
      ],
      warning: "Any vaginal bleeding during pregnancy requires immediate medical attention",
    },
    "Labor Signs": {
      urgency: "MEDIUM",
      steps: [
        "Time contractions from start to start",
        "Note frequency and duration of contractions",
        "Watch for water breaking",
        "Stay calm and breathe slowly",
        "Contact your healthcare provider",
        "Prepare hospital bag if not ready",
      ],
      warning: "If contractions are less than 5 minutes apart or water breaks, go to hospital",
    },
    "Severe Headache/Vision Changes": {
      urgency: "HIGH",
      steps: [
        "Sit in a quiet, dark room",
        "Take your blood pressure if possible",
        "Note any other symptoms",
        "Contact your healthcare provider immediately",
        "Do not delay seeking help",
      ],
      warning: "Could be signs of preeclampsia - a serious pregnancy complication",
    },
    "Choking (Baby)": {
      urgency: "HIGH",
      steps: [
        "Support baby face-down on your forearm, head lower than chest",
        "Give 5 gentle but firm back blows between shoulder blades",
        "Turn baby face-up and give 5 chest thrusts",
        "Repeat until object is expelled",
        "Call emergency if blockage persists",
      ],
      warning: "If baby becomes unconscious, start infant CPR immediately",
    },
    "Fever in Newborn": {
      urgency: "MEDIUM",
      steps: [
        "Take temperature rectally (most accurate)",
        "Note: normal temp is 97.9°F-100.4°F",
        "Keep baby hydrated with breast milk/formula",
        "Dress in light clothing",
        "Apply lukewarm sponge bath (never cold)",
        "Monitor breathing and activity level",
      ],
      warning: "Seek immediate medical care if fever >100.4°F or baby <3 months old",
    },
  };

  // Initialize location services and load contacts
  useEffect(() => {
    requestLocationPermission();
    loadEmergencyContacts();
  }, []);

  // Load emergency contacts from storage
  const loadEmergencyContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('emergencyContacts');
      if (contacts) {
        setEmergencyContacts(JSON.parse(contacts));
      }
    } catch (error) {
      console.error('Error loading emergency contacts:', error);
    }
  };

  // Request location permissions
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setLocationError('Error getting location');
      console.error(error);
    }
  };

  // Start SOS countdown with animation
  const startSOSCountdown = () => {
    setIsSOSActive(true);
    Vibration.vibrate(500);
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    const countdown = setInterval(() => {
      setSOSTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSOS();
          return 3;
        }
        Vibration.vibrate(200);
        return prev - 1;
      });
    }, 1000);
  };

  // Cancel SOS
  const cancelSOS = () => {
    setIsSOSActive(false);
    setSOSTimer(3);
    Vibration.cancel();
    pulseAnim.setValue(1);
  };

  // Handle SOS activation
  const handleSOS = async () => {
    try {
      setIsSendingSOS(true);
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("User not found");
      
      const user = JSON.parse(userData);
      const motherId = user.motherId || user.id;
      const motherName = `${user.firstName} ${user.lastName}`;

      // Get current location
      let currentLocation = location;
      if (!currentLocation) {
        try {
          currentLocation = await Location.getCurrentPositionAsync({});
        } catch (error) {
          console.error("Error getting location:", error);
          currentLocation = null;
        }
      }

      // Create alert payload
      const alertPayload = {
        type: "Emergency",
        description: "SOS Alert, Immediate Assistance Required",
        motherId,
        motherName,
        date: new Date().toISOString().split('T')[0], // Format as DATEONLY
        status: "URGENT"
      };

      // Send alert to backend
      const alertResponse = await axios.post(`${BACKEND_URL}/api/alerts`, alertPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!alertResponse.data.alert) {
        throw new Error("Failed to create alert");
      }

      // Get CHW details and send notification
      try {
        const motherResponse = await axios.get(`${BACKEND_URL}/api/mothers/${motherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chwId = motherResponse.data.mother?.chwId;
        if (chwId) {
          // Create notification for CHW
          const notificationPayload = {
            title: "EMERGENCY SOS",
            message: `Emergency alert from mother ${motherName}. Immediate assistance required.`,
            type: "EMERGENCY",
            motherId,
            chwId,
            alertId: alertResponse.data.alert.id,
            location: currentLocation ? {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            } : null,
          };

          // Send notification to CHW
          await axios.post(`${BACKEND_URL}/api/notifications/chw`, notificationPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Send SMS to CHW
          const chwResponse = await axios.get(`${BACKEND_URL}/api/chw/${chwId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (chwResponse.data.chw?.phoneNumber) {
            // Send SMS to CHW's phone number
            await axios.post(`${BACKEND_URL}/api/sms/send`, {
              to: chwResponse.data.chw.phoneNumber,
              message: `EMERGENCY: ${motherName} needs immediate assistance. Location: ${currentLocation ? `${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}` : 'Unknown'}`,
            }, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        }
      } catch (error) {
        //console.error("Error notifying CHW:", error);
        // Continue even if CHW notification fails
        //Alert.alert("Your chw has been notified.", [{ text: "OK" }]);
      }

      // Show success message
      Alert.alert(
        "Emergency Alert Sent",
        "Help is on the way. Stay calm and wait for assistance.",
        [{ text: "OK", onPress: () => setIsSOSActive(false) }]
      );
    } catch (error) {
      console.error("Error sending SOS:", error);
      Alert.alert(
        "Error",
        "Failed to send emergency alert. Please try again or call emergency services directly.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSendingSOS(false);
      setIsSOSActive(false);
      setSOSTimer(3);
      Vibration.cancel();
      pulseAnim.setValue(1);
    }
  };

  // Handle emergency calls
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() =>
      Alert.alert("Call Failed", "Please try again or dial manually.")
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#FFF5F7", "#FFE4E6"]}
        style={styles.headerCard}
      >
        <Ionicons name="heart" size={40} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Emergency Assistance</Text>
        <Text style={styles.headerSubtitle}>
          Quick access to help when you need it most
        </Text>
      </LinearGradient>

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        {isSOSActive ? (
          <TouchableOpacity
            style={styles.sosButtonActive}
            onPress={cancelSOS}
          >
            <Animated.View
              style={[
                styles.sosGradient,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["#FF0000", "#FF4444"]}
                style={styles.sosGradient}
              >
                {isSendingSOS ? (
                  <ActivityIndicator color="#FFF" size="large" />
                ) : (
                  <>
                    <Ionicons name="alert-circle" size={40} color="#FFF" />
                    <Text style={styles.sosTextActive}>
                      Hold {sosTimer}s to Cancel
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.sosButton}
            onPress={startSOSCountdown}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF8787"]}
              style={styles.sosGradient}
            >
              <Ionicons name="alert-circle" size={40} color="#FFF" />
              <Text style={styles.sosText}>Hold for Emergency SOS</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {locationError && (
          <Text style={styles.locationError}>
            Location services disabled. SOS will send without location.
          </Text>
        )}
      </View>

      {/* Quick Contacts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        <View style={styles.contactsGrid}>
          {Object.entries(emergencyContacts).map(([name, phone], index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={() => handleCall(phone)}
            >
              <LinearGradient
                colors={["#FFF5F7", "#FFE4E6"]}
                style={styles.contactGradient}
              >
                <Ionicons name="call" size={24} color="#FF6B6B" />
                <Text style={styles.contactName}>{name}</Text>
                <Text style={styles.contactPhone}>{phone}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* First Aid Guidance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency First Aid</Text>
        {Object.entries(firstAidGuidance).map(([name, guide], index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.guideCard,
              guide.urgency === "HIGH" && styles.highUrgency
            ]}
            onPress={() => setSelectedGuidance(name)}
          >
            <View style={styles.guideHeader}>
              <Ionicons 
                name={guide.urgency === "HIGH" ? "warning" : "information-circle"} 
                size={24} 
                color={guide.urgency === "HIGH" ? "#FF4444" : "#FF6B6B"} 
              />
              <Text style={[
                styles.guideText,
                guide.urgency === "HIGH" && styles.highUrgencyText
              ]}>
                {name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Guidance Modal */}
      <Modal
        transparent
        visible={!!selectedGuidance}
        animationType="slide"
        onRequestClose={() => setSelectedGuidance(null)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FFF5F7", "#FFE4E6"]}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedGuidance}</Text>
              {selectedGuidance && (
                <View style={[
                  styles.urgencyBadge,
                  firstAidGuidance[selectedGuidance].urgency === "HIGH" && styles.highUrgencyBadge
                ]}>
                  <Text style={styles.urgencyText}>
                    {firstAidGuidance[selectedGuidance].urgency} URGENCY
                  </Text>
                </View>
              )}
            </View>
            
            <ScrollView style={styles.modalScroll}>
              {selectedGuidance && (
                <>
                  {firstAidGuidance[selectedGuidance].steps.map((step, idx) => (
                    <View key={idx} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                  <View style={styles.warningBox}>
                    <Ionicons name="warning" size={24} color="#FF4444" />
                    <Text style={styles.warningText}>
                      {firstAidGuidance[selectedGuidance].warning}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedGuidance(null)}
            >
              <Text style={styles.closeButtonText}>I Understand</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerCard: {
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6B6B",
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  sosContainer: {
    padding: 16,
    alignItems: "center",
  },
  sosButton: {
    width: "100%",
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonActive: {
    width: "100%",
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  sosGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 8,
  },
  sosTextActive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 8,
  },
  locationError: {
    color: "#FF4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 16,
  },
  contactsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  contactCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  contactGradient: {
    padding: 16,
    alignItems: "center",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 8,
    textAlign: "center",
  },
  contactPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  guideCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  guideText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3748",
  },
  highUrgency: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  highUrgencyText: {
    color: "#FF4444",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  urgencyBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  highUrgencyBadge: {
    backgroundColor: "#FFE4E4",
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A5568",
  },
  modalScroll: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 24,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE4E4",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#FF6B6B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmergencyAssistance;