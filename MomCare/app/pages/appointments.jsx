import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../styles/theme";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/appointmentsSlice";

const Appointments = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const appointments = [
    { id: "1", provider: "Dr. Jane Doe", type: "Ultrasound Scan", date: "Nov 18, 2024", time: "10:30 AM", location: "City Hospital", status: "Confirmed" },
    { id: "2", provider: "Nurse John Smith", type: "Prenatal Checkup", date: "Nov 25, 2024", time: "2:00 PM", location: "Community Clinic", status: "Pending" },
    { id: "3", provider: "Dr. Emily Brown", type: "Postnatal Visit", date: "Nov 10, 2024", time: "1:00 PM", location: "Health Center", status: "Completed" },
    { id: "4", provider: "Dr. Sam Wilson", type: "Routine Checkup", date: "Oct 28, 2024", time: "11:30 AM", location: "City Hospital", status: "Completed" },
    { id: "5", provider: "Nurse Lisa Ray", type: "Vaccination", date: "Nov 27, 2024", time: "3:00 PM", location: "Community Clinic", status: "Pending" },
    { id: "6", provider: "Dr. Mike Johnson", type: "Blood Test", date: "Nov 30, 2024", time: "9:00 AM", location: "City Hospital", status: "Confirmed" },
    { id: "7", provider: "Nurse Alex Grey", type: "Lab Results", date: "Oct 15, 2024", time: "4:00 PM", location: "Clinic Downtown", status: "Completed" },
    { id: "8", provider: "Dr. Clara White", type: "Glucose Screening", date: "Nov 29, 2024", time: "2:30 PM", location: "Community Health Center", status: "Pending" },
  ];

  const upcomingAppointments = appointments.filter((item) => item.status !== "Completed");
  const pastAppointments = appointments.filter((item) => item.status === "Completed");

  const nextAppointment = [...upcomingAppointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  const [selectedSection, setSelectedSection] = useState("upcoming");

  const handleAppointmentDetails = (id) => {
    dispatch(setSelectedAppointment(id));
    router.push("/pages/appointmentdetails");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.status === "Confirmed"
          ? styles.cardConfirmed
          : item.status === "Pending"
          ? styles.cardPending
          : styles.cardCompleted,
      ]}
      onPress={() => handleAppointmentDetails(item.id)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.provider}>{item.provider}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Confirmed"
                ? styles.statusConfirmed
                : item.status === "Pending"
                ? styles.statusPending
                : styles.statusCompleted,
            ]}
          >
            {item.status}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📋 Type:</Text>
          <Text style={styles.value}>{item.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>⏰ Time:</Text>
          <Text style={styles.value}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>📍 Location:</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>

      {/* Next Appointment */}
      {nextAppointment && (
        <View style={styles.nextAppointment}>
          <Text style={styles.sectionHeader}>Your Next Appointment</Text>
          <TouchableOpacity
            style={[
              styles.card,
              styles.cardHighlighted,
              nextAppointment.status === "Confirmed"
                ? styles.cardConfirmed
                : nextAppointment.status === "Pending"
                ? styles.cardPending
                : styles.cardCompleted,
            ]}
            onPress={() => handleAppointmentDetails(nextAppointment.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.provider}>👨‍⚕️ Doctor: {nextAppointment.provider}</Text>
              <Text
                style={[
                  styles.status,
                  nextAppointment.status === "Confirmed"
                    ? styles.statusConfirmed
                    : nextAppointment.status === "Pending"
                    ? styles.statusPending
                    : styles.statusCompleted,
                ]}
              >
                {nextAppointment.status}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>📋 Type:</Text>
              <Text style={styles.value}>{nextAppointment.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>📅 Date:</Text>
              <Text style={styles.value}>{nextAppointment.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>⏰ Time:</Text>
              <Text style={styles.value}>{nextAppointment.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>📍 Location:</Text>
              <Text style={styles.value}>{nextAppointment.location}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle Section */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setSelectedSection("upcoming")}
          style={[
            styles.toggleButton,
            selectedSection === "upcoming" && styles.toggleButtonActive,
          ]}
        >
          <Text style={styles.toggleButtonText}>See More Upcoming Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedSection("past")}
          style={[
            styles.toggleButton,
            selectedSection === "past" && styles.toggleButtonActive,
          ]}
        >
          <Text style={styles.toggleButtonText}>View Past Appointments</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={selectedSection === "upcoming" ? upcomingAppointments : pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  nextAppointment: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "italic",
    color: COLORS.primary,
    marginBottom: 15,
    paddingBottom: 5,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardConfirmed: {
    borderLeftWidth: 5,
    borderLeftColor: "green",
  },
  cardPending: {
    borderLeftWidth: 5,
    borderLeftColor: "orange",
  },
  cardCompleted: {
    borderLeftWidth: 5,
    borderLeftColor: "#888",
  },
  cardContent: {
    flexDirection: "column",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  provider: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.textSecondary,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusConfirmed: {
    color: "green",
  },
  statusPending: {
    color: "orange",
  },
  statusCompleted: {
    color: "#888",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    flex: 0.45,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "bold",
  },
});

export default Appointments;