import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/appointmentsSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton";
import { BACKEND_URL } from "@env";

const Appointments = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointmentsData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("User not found");
      
      const user = JSON.parse(userData);
      const motherId = user.motherId || user.id;
      //console.log(motherId);

      const response = await axios.get(`${BACKEND_URL}/api/appointments/mother/${motherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data.data);
    } catch (error) {
      console.log("Error fetching appointments:", error); 
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  //console.log(appointments);
  

  useEffect(() => {
    fetchAppointmentsData();
  }, [fetchAppointmentsData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointmentsData();
  }, [fetchAppointmentsData]);

  const upcomingAppointments = appointments.filter((item) => item.status !== "Completed");
  const pastAppointments = appointments.filter((item) => item.status === "Completed");
  const nextAppointment = [...upcomingAppointments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )[0];

  const handleAppointmentDetails = (id) => {
    dispatch(setSelectedAppointment(id));
    router.push("/pages/appointmentdetails");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.status === "Confirmed" && styles.cardConfirmed,
        item.status === "Pending" && styles.cardPending,
        item.status === "Completed" && styles.cardCompleted,
      ]}
      onPress={() => handleAppointmentDetails(item.id)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.provider}>{item.provider}</Text>
        <Text style={styles.cardStatus}>{item.status}</Text>
        <View style={styles.detailRow}>
          <Ionicons name="document-text" size={16} color="#FF6B6B" />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#FF6B6B" />
          <Text style={styles.detailText}>{item.date} • {item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#FF6B6B" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#FFF5F7", "#F8F9FA"]} style={styles.skeletonContainer}>
        <CustomSkeleton style={styles.skeletonTitle} />
        <CustomSkeleton style={styles.skeletonCard} />
        <View style={styles.skeletonToggle}>
          <CustomSkeleton style={styles.skeletonToggleBtn} />
          <CustomSkeleton style={styles.skeletonToggleBtn} />
        </View>
        <CustomSkeleton style={styles.skeletonCard} />
        <CustomSkeleton style={styles.skeletonCard} />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="calendar" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama's Dates</Text>
        <Text style={styles.headerSubtitle}>Your care, planned with love</Text>
      </LinearGradient>

      {/* Next Appointment */}
      {nextAppointment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Up</Text>
          <TouchableOpacity
            style={[
              styles.card,
              styles.cardHighlighted,
              nextAppointment.status === "Confirmed" && styles.cardConfirmed,
              nextAppointment.status === "Pending" && styles.cardPending,
            ]}
            onPress={() => handleAppointmentDetails(nextAppointment.id)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.provider}>{nextAppointment.provider}</Text>
              <Text style={styles.cardStatus}>{nextAppointment.status}</Text>
              <View style={styles.detailRow}>
                <Ionicons name="document-text" size={16} color="#FF6B6B" />
                <Text style={styles.detailText}>{nextAppointment.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={16} color="#FF6B6B" />
                <Text style={styles.detailText}>{nextAppointment.date} • {nextAppointment.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={16} color="#FF6B6B" />
                <Text style={styles.detailText}>{nextAppointment.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle Section */}
      <View style={styles.toggleContainer}>
        {["upcoming", "past"].map((section) => (
          <TouchableOpacity
            key={section}
            style={styles.toggleButton}
            onPress={() => setSelectedSection(section)}
          >
            <LinearGradient
              colors={selectedSection === section ? ["#FF6B6B", "#FF8787"] : ["#F0F0F0", "#F8F9FA"]}
              style={styles.toggleGradient}
            >
              <Text style={[styles.toggleText, selectedSection === section && styles.activeToggleText]}>
                {section === "upcoming" ? "More Ahead" : "Looking Back"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointments List */}
      <FlatList
        data={selectedSection === "upcoming" ? upcomingAppointments : pastAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No appointments here yet, mama!</Text>}
      />
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  cardConfirmed: {
    backgroundColor: "#F0FFF0",
  },
  cardPending: {
    backgroundColor: "#FFF5E6",
  },
  cardCompleted: {
    backgroundColor: "#F5F5F5",
  },
  cardContent: {
    flexDirection: "column",
  },
  provider: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    textTransform: "uppercase",
    alignSelf: "flex-end",
    position: "absolute",
    top: 0,
    right: 0,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  toggleGradient: {
    padding: 12,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    color: "#777",
    fontWeight: "600",
  },
  activeToggleText: {
    color: "#FFF",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  skeletonContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  skeletonTitle: {
    width: "40%",
    height: 28,
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonCard: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
  },
  skeletonToggleBtn: {
    width: "45%",
    height: 40,
    borderRadius: 12,
  },
});

export default Appointments;