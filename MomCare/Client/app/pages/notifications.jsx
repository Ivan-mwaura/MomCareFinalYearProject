import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton"; // Adjust path as needed
import { BACKEND_URL } from "@env";

// Helper function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to reformat appointment notifications
const formatNotificationMessage = (message) => {
  if (message.startsWith("Appointment Notification:")) {
    const trimmed = message.replace("Appointment Notification:", "").trim();
    // Expected format: "An appointment for Cecilia Maingi's "1st ANC Visit – Booking Visit (Before 12 Weeks)" is scheduled on 2025-03-03. Please ensure all preparations are made."
    const regex = /for\s+(.+)'s\s+"([^"]+)"\s+is scheduled on\s+(\S+)/i;
    const match = trimmed.match(regex);
    if (match && match.length >= 4) {
      const motherName = match[1].trim();
      const appointmentTitle = match[2].trim();
      let appointmentDate = match[3].trim();
      appointmentDate = appointmentDate.replace(/[.,;]$/, "");
      return `Hi ${capitalize(motherName)}, your ${appointmentTitle} is scheduled for ${appointmentDate}. Please ensure you're prepared and feel free to contact your CHW if needed.`;
    }
  }
  return message;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const [notifResponse, alertsResponse] = await Promise.all([
        axios.get( `${BACKEND_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Map alerts to the same format as notifications
      const alerts = alertsResponse.data.data.map((alert) => ({
        id: alert.id,
        type: "Alert",
        title: "Alert",
        message: alert.description,
        time: alert.date, // Adjust formatting if needed
      }));

      // Assume notifications are already in the expected format
      const notifData = notifResponse.data.data;

      // Merge both arrays and sort newest first (by time)
      const mergedData = [...notifData, ...alerts];
      mergedData.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(mergedData);
    } catch (error) {
      console.error("Error fetching notifications and alerts:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await fetchNotificationsData();
      setLoading(false);
    };
    loadData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotificationsData();
    setRefreshing(false);
  }, []);

  // Map notification types to appropriate Ionicons
  const getIconName = (type) => {
    if (type === "Reminder") return "calendar-outline";
    if (type === "Alert") return "alert-circle-outline";
    if (type === "Health Tip") return "water-outline"; // Adjust if needed
    return "notifications-outline";
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notification}>
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName(item.type)} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>
          {item.type === "Reminder"
            ? formatNotificationMessage(item.message)
            : item.message}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  // If loading, display custom skeleton placeholders
  if (loading) {
    return (
      <View style={styles.container}>
        {/* Header Skeleton */}
        <CustomSkeleton style={styles.headerSkeleton} />
        <View style={{ height: 20 }} />
        {/* Skeleton for 3 notification cards */}
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7]}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationSkeleton}>
              <CustomSkeleton style={styles.iconSkeleton} />
              <View style={styles.textSkeletonContainer}>
                <CustomSkeleton style={styles.lineSkeleton} />
                <CustomSkeleton style={[styles.lineSkeleton, { width: "80%", marginTop: 6 }]} />
                <CustomSkeleton style={[styles.lineSkeleton, { width: "60%", marginTop: 6 }]} />
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: COLORS.accent,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 10,
  },
  // Skeleton Styles
  headerSkeleton: {
    width: "60%",
    height: 28,
    borderRadius: 4,
    alignSelf: "center",
  },
  notificationSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  iconSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textSkeletonContainer: {
    flex: 1,
    marginLeft: 15,
  },
  lineSkeleton: {
    width: "100%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
});

export default Notifications;
