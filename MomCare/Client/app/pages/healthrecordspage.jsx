import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@env";

const HealthRecords = () => {
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("health");
  const [healthRecords, setHealthRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      
      if (!token || !userData) {
        throw new Error("Authentication required");
      }

      const user = JSON.parse(userData);
      const motherId = user.motherId || user.id;
      
      console.log('Fetching records with:', {
        motherId,
        token: token ? 'Token exists' : 'No token',
        backendUrl: BACKEND_URL
      });

      const healthEndpoint = `${BACKEND_URL}/api/healthrecords/mother/${motherId}`;
      const appointmentsEndpoint = `${BACKEND_URL}/api/appointmentRecords/mother/${motherId}`;

      console.log('Endpoints:', {
        health: healthEndpoint,
        appointments: appointmentsEndpoint
      });

      const [healthResponse, appointmentsResponse] = await Promise.all([
        axios.get(healthEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          // If it's a 404, return empty records array
          if (err.response?.status === 404) {
            return { data: { records: [] } };
          }
          throw err;
        }),
        axios.get(appointmentsEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          // If it's a 404, return empty records array
          if (err.response?.status === 404) {
            return { data: { records: [] } };
          }
          throw err;
        }),
      ]);

      console.log('Responses:', {
        health: healthResponse.data,
        appointments: appointmentsResponse.data
      });

      setHealthRecords(healthResponse.data.records || []);
      setAppointments(appointmentsResponse.data.records || []);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      // Only set error for non-404 responses
      if (err.response?.status !== 404) {
        setError(err.message === "Authentication required" 
          ? "Please log in to view your records" 
          : "Failed to load records. Please try again later.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const toggleRecord = (id) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderHealthConditions = (record) => {
    const conditions = [
      { name: 'Hypertension', value: record.hypertension },
      { name: 'Diabetes', value: record.diabetes },
      { name: 'Thyroid Disorders', value: record.thyroidDisorders },
      { name: 'Obesity', value: record.obesity },
      { name: 'HIV', value: record.hiv },
      { name: 'Syphilis', value: record.syphilis },
      { name: 'Malaria', value: record.malaria },
      { name: 'UTI', value: record.uti },
    ].filter(condition => condition.value);

    return conditions.map(condition => condition.name).join(', ') || 'None';
  };

  const renderHealthRecords = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRecords}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (healthRecords.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No health records available yet.</Text>
        </View>
      );
    }

    return healthRecords.map((record) => (
      <View key={record.id} style={styles.recordCard}>
        <TouchableOpacity style={styles.recordHeader} onPress={() => toggleRecord(record.id)}>
          <Ionicons name="document-text" size={20} color="#FF6B6B" />
          <Text style={styles.recordTitle}>Health Record - {formatDate(record.createdAt)}</Text>
          <Ionicons
            name={expandedRecord === record.id ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FF6B6B"
          />
        </TouchableOpacity>
        {expandedRecord === record.id && (
          <View style={styles.recordDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Medical Conditions</Text>
              <Text style={styles.detailText}>{renderHealthConditions(record)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mental Health</Text>
              <Text style={styles.detailText}>
                Depression: {record.depression || 'None'}{'\n'}
                Anxiety: {record.anxiety || 'None'}{'\n'}
                Stress Level: {record.stressLevel || 'Not specified'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pregnancy History</Text>
              <Text style={styles.detailText}>
                Pregnancies (Gravidity): {record.gravidity}{'\n'}
                Births (Parity): {record.parity}
              </Text>
            </View>
            {record.previousComplications && record.previousComplications.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Previous Complications</Text>
                <Text style={styles.detailText}>{record.previousComplications.join(', ')}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    ));
  };

  const renderAppointments = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRecords}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (appointments.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments scheduled yet.</Text>
        </View>
      );
    }

    return appointments.map((appointment) => (
      <View key={appointment.id} style={styles.recordCard}>
        <TouchableOpacity style={styles.recordHeader} onPress={() => toggleRecord(appointment.id)}>
          <Ionicons name="calendar" size={20} color="#FF6B6B" />
          <Text style={styles.recordTitle}>
            {appointment.appointmentDate} - {appointment.visitType}
          </Text>
          <Ionicons
            name={expandedRecord === appointment.id ? "chevron-up" : "chevron-down"}
            size={20}
            color="#FF6B6B"
          />
        </TouchableOpacity>
        {expandedRecord === appointment.id && (
          <View style={styles.recordDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vital Signs</Text>
              <Text style={styles.detailText}>
                Blood Pressure: {appointment.bloodPressure}{'\n'}
                Heart Rate: {appointment.heartRate} bpm{'\n'}
                Temperature: {appointment.temperature}°C{'\n'}
                Weight: {appointment.weight} kg
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pregnancy Metrics</Text>
              <Text style={styles.detailText}>
                Fundal Height: {appointment.fundalHeight} cm{'\n'}
                Fetal Heart Rate: {appointment.fetalHeartRate} bpm{'\n'}
                Gestational Age: {appointment.gestationalAge} weeks
              </Text>
            </View>
            {appointment.physicalFindings && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Physical Findings</Text>
                <Text style={styles.detailText}>{appointment.physicalFindings}</Text>
              </View>
            )}
            {appointment.symptoms && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Symptoms</Text>
                <Text style={styles.detailText}>{appointment.symptoms}</Text>
              </View>
            )}
            {appointment.prescribedMedications && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prescribed Medications</Text>
                <Text style={styles.detailText}>{appointment.prescribedMedications}</Text>
              </View>
            )}
            {appointment.careRecommendations && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Care Recommendations</Text>
                <Text style={styles.detailText}>{appointment.careRecommendations}</Text>
              </View>
            )}
            {appointment.nextAppointmentDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Next Appointment</Text>
                <Text style={styles.detailText}>{appointment.nextAppointmentDate}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    ));
  };

  const handleExport = () => {
    alert("Records exported, mama! Check your email or downloads.");
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="heart-pulse" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama's Health Story</Text>
        <Text style={styles.headerSubtitle}>Your wellness, at a glance</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "health" && styles.activeTab]}
          onPress={() => setActiveTab("health")}
        >
          <Text style={[styles.tabText, activeTab === "health" && styles.activeTabText]}>
            Health Records
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "appointments" && styles.activeTab]}
          onPress={() => setActiveTab("appointments")}
        >
          <Text style={[styles.tabText, activeTab === "appointments" && styles.activeTabText]}>
            Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.section}>
        {activeTab === "health" ? renderHealthRecords() : renderAppointments()}
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.exportGradient}>
          <Ionicons name="download" size={20} color="#FFF" style={styles.exportIcon} />
          <Text style={styles.exportText}>Save My Records</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    padding: 16,
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
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FF6B6B",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#FFF",
  },
  section: {
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#FF6B6B",
    marginBottom: 10,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
  recordCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF5F7",
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginHorizontal: 12,
  },
  recordDetails: {
    padding: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 8,
  },
  detailRow: {
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  exportButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  exportGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  exportIcon: {
    marginRight: 8,
  },
  exportText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default HealthRecords;