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
import { COLORS, SIZES } from "../styles/theme";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton"; // Adjust path as needed
import { BACKEND_URL } from "@env";

const AppointmentDetails = () => {
  const appointmentId = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Fetch appointment details from the backend
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/appointments/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Assume the appointment is returned in response.data.appointment
        setAppointment(response.data.appointment);
      } catch (error) {
        console.error("Error fetching appointment details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  // Function to reschedule the appointment
  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a valid date and time.");
      return;
    }

    // Format date and time (adjust as needed)
    const formattedDate = selectedDate.toLocaleDateString("en-US");
    const formattedTime = selectedTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `http://192.168.0.106:5000/api/appointments/${appointmentId}`,
        { date: formattedDate, time: formattedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update appointment state with new details
      setAppointment(response.data.appointment);
      alert("Appointment successfully rescheduled.");
    } catch (error) {
      console.error(
        "Error rescheduling appointment:",
        error.response?.data || error.message
      );
      alert("Failed to reschedule appointment. Please try again.");
    }
    setIsModalVisible(false);
  };

  // --- Custom Skeleton Loading Placeholder --- //
  if (loading || !appointment) {
    return (
      <ScrollView contentContainerStyle={styles.loadingContainer}>
        {/* Header Skeleton (for provider info) */}
        <CustomSkeleton style={styles.headerSkeleton} />
        <CustomSkeleton style={[styles.headerSkeleton, { width: "60%", marginTop: 8 }]} />

        {/* Detail rows skeleton */}
        <View style={styles.detailsSkeleton}>
          <CustomSkeleton style={styles.detailSkeleton} />
          <CustomSkeleton style={[styles.detailSkeleton, { width: "80%", marginTop: 6 }]} />
          <CustomSkeleton style={[styles.detailSkeleton, { width: "70%", marginTop: 6 }]} />
          <CustomSkeleton style={[styles.detailSkeleton, { width: "90%", marginTop: 6 }]} />
        </View>

        {/* Reschedule Button skeleton */}
        <CustomSkeleton style={styles.buttonSkeleton} />
      </ScrollView>
    );
  }
  // --- End Skeleton Loading Block --- //

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>
          👨‍⚕️ Attending Doctor: {appointment.provider}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Appointment Status:</Text>
          <Text
            style={[
              styles.status,
              appointment.status === "Confirmed"
                ? styles.statusConfirmed
                : appointment.status === "Pending"
                ? styles.statusPending
                : styles.statusCompleted,
            ]}
          >
            {appointment.status}
          </Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text style={styles.value}>{appointment.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>⏰ Time:</Text>
          <Text style={styles.value}>{appointment.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📍 Location:</Text>
          <Text style={styles.value}>{appointment.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📝 Description:</Text>
          <Text style={styles.value}>{appointment.description}</Text>
        </View>
      </View>

      {/* Reschedule Button */}
      {!appointment.rescheduled && (
        <TouchableOpacity
          style={styles.rescheduleButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Reschedule Appointment</Text>
        </TouchableOpacity>
      )}

      {appointment.rescheduled && (
        <Text style={styles.rescheduleNotice}>
          Appointment has already been rescheduled and cannot be changed again.
        </Text>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/pages/appointments")}
      >
        <Text style={styles.buttonText}>Back to Appointments</Text>
      </TouchableOpacity>

      {/* Reschedule Modal */}
      <Modal visible={isModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerButtonText}>Select Date</Text>
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
            <Text style={styles.selectedText}>
              Selected Date: {selectedDate.toLocaleDateString("en-US")}
            </Text>

            {/* Time Picker */}
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerButtonText}>Select Time</Text>
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
            <Text style={styles.selectedText}>
              Selected Time:{" "}
              {selectedTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleReschedule}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    overflow: "hidden",
  },
  statusConfirmed: {
    backgroundColor: "green",
  },
  statusPending: {
    backgroundColor: "orange",
  },
  statusCompleted: {
    backgroundColor: "#888",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginRight: 10,
    flex: 0.4,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.textSecondary,
    flex: 0.6,
  },
  rescheduleButton: {
    backgroundColor: "#6A5ACD",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  rescheduleNotice: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  pickerButton: {
    backgroundColor: COLORS.accent,
    padding: 10,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginBottom: 10,
  },
  pickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    flex: 0.45,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },

  // Skeleton Loading Styles
  loadingContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSkeleton: {
    width: "80%",
    height: 24,
    borderRadius: 4,
  },
  detailsSkeleton: {
    marginTop: 20,
    width: "100%",
  },
  detailSkeleton: {
    width: "90%",
    height: 18,
    borderRadius: 4,
    marginTop: 6,
  },
  buttonSkeleton: {
    width: "50%",
    height: 35,
    borderRadius: SIZES.borderRadius,
    marginTop: 20,
  },
});

export default AppointmentDetails;
