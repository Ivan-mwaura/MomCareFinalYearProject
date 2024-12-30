import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";

const Notifications = () => {
  const notifications = [
    {
      id: "1",
      type: "Reminder",
      title: "Upcoming Appointment",
      message: "You have an appointment with Dr. Jane Doe on Nov 18, 2024, at 10:30 AM.",
      icon: "calendar-outline",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "Alert",
      title: "Missed Appointment",
      message: "You missed your appointment with Nurse John Smith on Nov 10, 2024.",
      icon: "alert-circle-outline",
      time: "Yesterday",
    },
    {
      id: "3",
      type: "Health Tip",
      title: "Stay Hydrated",
      message: "Drink at least 8 glasses of water every day to stay healthy during pregnancy.",
      icon: "water-outline",
      time: "2 days ago",
    },
  ];

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.notification}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

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
});

export default Notifications;
