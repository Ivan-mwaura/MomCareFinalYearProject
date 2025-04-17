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
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSkeleton from "./customSkeleton"; // Adjust path as needed
import { BACKEND_URL } from "@env";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatNotificationMessage = (message) => {
  if (message.startsWith("Appointment Notification:")) {
    const trimmed = message.replace("Appointment Notification:", "").trim();
    const regex = /for\s+(.+)'s\s+"([^"]+)"\s+is scheduled on\s+(\S+)/i;
    const match = trimmed.match(regex);
    if (match && match.length >= 4) {
      const motherName = match[1].trim();
      const appointmentTitle = match[2].trim();
      let appointmentDate = match[3].trim();
      appointmentDate = appointmentDate.replace(/[.,;]$/, "");
      return `${capitalize(motherName)}, your "${appointmentTitle}" is set for ${appointmentDate}. Get ready, mama!`;
    }
  }
  return message;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotificationsData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      const [notifResponse, alertsResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BACKEND_URL}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("Notifications Response:", notifResponse.data);
      console.log("Alerts Response:", alertsResponse.data);

      // Handle notifications data - it's already an array
      const notifData = Array.isArray(notifResponse.data) ? notifResponse.data.map((notif) => ({
        id: notif.id,
        type: notif.type || "Notification",
        title: notif.title || "Notification",
        message: notif.message,
        time: notif.date || notif.createdAt,
      })) : [];

      console.log("Processed Notifications:", notifData);

      // Handle alerts data - it's nested under data property
      const alerts = Array.isArray(alertsResponse.data?.data) ? alertsResponse.data.data.map((alert) => ({
        id: `alert-${alert.id}`,
        type: "Alert",
        title: alert.type,
        message: alert.description,
        time: alert.date || alert.createdAt,
      })) : [];

      console.log("Processed Alerts:", alerts);

      const mergedData = [...notifData, ...alerts].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      console.log("Final Merged Data:", mergedData);
      
      setNotifications(mergedData);
    } catch (error) {
      console.error("Fetch error:", error);
      console.error("Error response:", error.response?.data);
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const getIconName = (type) => {
    switch (type) {
      case "Reminder": return "calendar";
      case "Alert": return "alert-circle";
      case "Health Tip": return "heart";
      default: return "notifications";
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notificationCard}>
      <View style={styles.iconWrapper}>
        <Ionicons name={getIconName(item.type)} size={24} color="#FF6B6B" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>
          {item.type === "Reminder" ? formatNotificationMessage(item.message) : item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.headerSkeletonWrapper}>
          <CustomSkeleton style={styles.headerSkeleton} />
        </LinearGradient>
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View style={styles.notificationSkeleton}>
              <CustomSkeleton style={styles.iconSkeleton} />
              <View style={styles.textSkeleton}>
                <CustomSkeleton style={styles.titleSkeleton} />
                <CustomSkeleton style={styles.messageSkeleton} />
                <CustomSkeleton style={styles.timeSkeleton} />
              </View>
            </View>
          )}
          contentContainerStyle={styles.skeletonList}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="bell" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama's Updates</Text>
        <Text style={styles.headerSubtitle}>Your notifications at a glance</Text>
      </LinearGradient>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No updates yet, mama! Check back soon.</Text>
        }
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
    marginBottom: 16,
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
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE4E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    padding: 20,
  },
  // Skeleton Styles
  headerSkeletonWrapper: {
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  headerSkeleton: {
    width: "50%",
    height: 28,
    borderRadius: 4,
  },
  skeletonList: {
    paddingHorizontal: 16,
  },
  notificationSkeleton: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
  },
  iconSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textSkeleton: {
    flex: 1,
    marginLeft: 12,
  },
  titleSkeleton: {
    width: "60%",
    height: 16,
    borderRadius: 4,
  },
  messageSkeleton: {
    width: "90%",
    height: 14,
    borderRadius: 4,
    marginTop: 6,
  },
  timeSkeleton: {
    width: "40%",
    height: 12,
    borderRadius: 4,
    marginTop: 6,
  },
});

export default Notifications;