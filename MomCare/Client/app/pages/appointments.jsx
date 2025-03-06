import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../styles/theme";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/appointmentsSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton"; // <-- Adjust path as needed
import { BACKEND_URL } from "@env";

const Appointments = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch appointments from the backend
  const fetchAppointmentsData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BACKEND_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data.data); // Assuming response.data.data is an array
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointmentsData();
  }, [fetchAppointmentsData]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointmentsData();
  }, [fetchAppointmentsData]);

  // Separate upcoming and past appointments
  const upcomingAppointments = appointments.filter((item) => item.status !== "Completed");
  const pastAppointments = appointments.filter((item) => item.status === "Completed");

  // Get next appointment by sorting upcoming appointments by date ascending
  const nextAppointment = [...upcomingAppointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  const handleAppointmentDetails = (id) => {
    dispatch(setSelectedAppointment(id));
    router.push("/pages/appointmentdetails");
  };

  // Renders each appointment item in the FlatList
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
          <Text style={styles.provider}>👨‍⚕️ {item.provider}</Text>
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

  // *** SKELETON LOADING BLOCK *** //
  if (loading) {
    return (
      <ScrollView
        style={styles.skeletonScroll}
        contentContainerStyle={styles.skeletonContainer}
      >
        {/* Title placeholder */}
        <View style={styles.skeletonRow}>
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%' }]} />
        </View>

        {/* Next Appointment heading */}
        <View style={[styles.skeletonRow, { marginTop: 20 }]}>
          <CustomSkeleton style={[styles.lineSkeleton, { width: '60%' }]} />
        </View>

        {/* Next appointment card */}
        <View style={styles.cardSkeleton}>
          <CustomSkeleton style={[styles.lineSkeleton, { width: '50%' }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%', marginTop: 8 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '60%', marginTop: 8 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '50%', marginTop: 8 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%', marginTop: 8 }]} />
        </View>

        {/* Toggle buttons */}
        <View style={[styles.skeletonRow, { marginTop: 30, justifyContent: 'space-between' }]}>
          <CustomSkeleton style={styles.toggleSkeletonBtn} />
          <CustomSkeleton style={styles.toggleSkeletonBtn} />
        </View>

        {/* 2 skeleton cards for upcoming/past appointments */}
        <View style={styles.cardSkeleton}>
          <CustomSkeleton style={[styles.lineSkeleton, { width: '50%' }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%', marginTop: 8 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '60%', marginTop: 8 }]} />
        </View>
        <View style={styles.cardSkeleton}>
          <CustomSkeleton style={[styles.lineSkeleton, { width: '50%' }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%', marginTop: 8 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '60%', marginTop: 8 }]} />
        </View>
      </ScrollView>
    );
  }
  // *** END SKELETON LOADING BLOCK *** //

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>

      {/* Next Appointment Section */}
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
              <Text style={styles.provider}>👨‍⚕️ {nextAppointment.provider}</Text>
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

      {/* Appointments List */}
      <FlatList
        data={selectedSection === "upcoming" ? upcomingAppointments : pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Normal container
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
  list: {
    paddingBottom: 20,
  },

  // Skeleton styles
  skeletonScroll: {
    backgroundColor: COLORS.background,
  },
  skeletonContainer: {
    padding: 20,
  },
  skeletonRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cardSkeleton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  lineSkeleton: {
    backgroundColor: '#e0e0e0',
    height: 18,
    borderRadius: 4,
  },
  toggleSkeletonBtn: {
    width: '45%',
    height: 35,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
});

export default Appointments;
