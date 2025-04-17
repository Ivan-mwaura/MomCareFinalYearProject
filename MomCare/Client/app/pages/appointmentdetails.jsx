import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton";
import { BACKEND_URL } from "@env";

const AppointmentDetails = () => {
  const appointmentId = useSelector((state) => state.appointments.selectedAppointment);
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(response.data.appointment);
      } catch (error) {
        console.error("Error fetching appointment details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please pick a date and time, mama!");
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString("en-US");
    const formattedTime = selectedTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("User not found");
      
      const user = JSON.parse(userData);
      const motherId = user.motherId || user.id;

      const response = await axios.put(
        `${BACKEND_URL}/api/appointments/${appointmentId}`,
        { 
          date: formattedDate, 
          time: formattedTime,
          motherId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointment(response.data.appointment);
      alert("New date set, mama! You're all good.");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error rescheduling appointment:", error.message);
      alert("Oops! Couldn't reschedule. Try again, sweetie.");
    }
  };

  if (loading || !appointment) {
    return (
      <LinearGradient colors={["#FFF5F7", "#F8F9FA"]} style={styles.skeletonContainer}>
        <CustomSkeleton style={styles.skeletonHeader} />
        <CustomSkeleton style={styles.skeletonCard} />
        <CustomSkeleton style={styles.skeletonButton} />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
          <Ionicons name="calendar" size={32} color="#FF6B6B" />
          <Text style={styles.headerTitle}>Mama's Date</Text>
          <Text style={styles.headerSubtitle}>Details just for you</Text>
        </LinearGradient>

        {/* Appointment Card */}
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.providerSection}>
              <Ionicons name="medical" size={24} color="#FF6B6B" />
              <Text style={styles.provider}>{appointment.provider}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              appointment.status === "Confirmed" && styles.statusConfirmed,
              appointment.status === "Pending" && styles.statusPending,
              appointment.status === "Completed" && styles.statusCompleted,
            ]}>
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>

          {/* Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Type</Text>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={18} color="#FF6B6B" />
              <Text style={styles.detailText}>{appointment.type}</Text>
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={18} color="#FF6B6B" />
              <Text style={styles.detailText}>{appointment.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={18} color="#FF6B6B" />
              <Text style={styles.detailText}>{appointment.time}</Text>
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={18} color="#FF6B6B" />
              <Text style={styles.detailText}>{appointment.location}</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            {appointment.description.split(';').map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.detailText}>{detail.trim()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {!appointment.rescheduled && (
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsModalVisible(true)}>
            <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
              <Ionicons name="refresh" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Pick a New Time</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {appointment.rescheduled && (
          <Text style={styles.noticeText}>This date's set, mama—no more changes here!</Text>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/pages/appointments")}>
          <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
            <Ionicons name="arrow-back" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Back to Dates</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Reschedule Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set a New Time</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerText}>
                Date: {selectedDate.toLocaleDateString("en-US")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerText}>
                Time: {selectedTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowTimePicker(false);
                  if (time) setSelectedTime(time);
                }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleReschedule}>
                <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.modalButtonGradient}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  provider: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  statusConfirmed: {
    backgroundColor: '#C6F6D5',
  },
  statusPending: {
    backgroundColor: '#FEEBC8',
  },
  statusCompleted: {
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 12,
    marginTop: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#4A5568',
    flex: 1,
    lineHeight: 22,
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  noticeText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerButton: {
    backgroundColor: "#FFF5F7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 0.48,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalButtonGradient: {
    padding: 12,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  skeletonContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  skeletonHeader: {
    width: "60%",
    height: 28,
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonCard: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  skeletonButton: {
    width: "50%",
    height: 40,
    borderRadius: 12,
  },
});

export default AppointmentDetails;