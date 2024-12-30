import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { COLORS, SIZES } from "../styles/theme";

const Dashboard = () => {
  const [mood, setMood] = useState("");
  const [symptom, setSymptom] = useState("");
  const [stressTip, setStressTip] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const appointments = [
    { id: "1", date: "Nov 18, 2024", time: "10:30 AM", title: "Ultrasound Scan" },
    { id: "2", date: "Nov 25, 2024", time: "2:00 PM", title: "Regular Check-Up" },
  ];

  const tips = [
    {
      id: "1",
      text: "Drink plenty of water to stay hydrated.",
      image: require("../../assets/tip1.jpg"),
      category: "Hydration",
      date: "12.05.2021",
    },
    {
      id: "2",
      text: "Include iron-rich foods in your diet.",
      image: require("../../assets/tip2.jpg"),
      category: "Nutrition",
      date: "14.05.2021",
    },
    {
      id: "3",
      text: "Get at least 8 hours of sleep every night.",
      image: require("../../assets/tip4.jpg"),
      category: "Lifestyle",
      date: "16.05.2021",
    },
  ];

  const stressTips = [
    "Take a deep breath and count to 10 slowly.",
    "Engage in light yoga or stretching exercises.",
    "Listen to calming music for 10 minutes.",
  ];

  const weeklyDevelopment = {
    week: 24,
    size: "Baby is the size of a cantaloupe",
    highlights: [
      "Baby's lungs are forming air sacs.",
      "Skin is becoming less translucent.",
      "Hearing ability is improving daily.",
    ],
  };

  const handleAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const renderSection = ({ item }) => {
    if (item.type === "welcome") {
      return (
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, Ivy Mitchelle</Text>
          <Text style={styles.subtitle}>Here’s an overview of your journey:</Text>
        </View>
      );
    }

    if (item.type === "tracker") {
      return (
        <View style={styles.tracker}>
          <Text style={styles.trackerTitle}>Pregnancy Stage Tracker</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "60%" }]} />
          </View>
          <Text style={styles.trackerText}>2nd Trimester (24 Weeks)</Text>
        </View>
      );
    }

    if (item.type === "appointments") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {item.data.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <Text style={styles.appointmentTitle}>{appointment.title}</Text>
              <Text style={styles.appointmentDetails}>
                {appointment.date} at {appointment.time}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    if (item.type === "weeklyDevelopment") {
      handleAnimation();
      return (
        <Animated.View
          style={[
            styles.section,
            {
              opacity: animationValue,
              transform: [
                {
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Weekly Development Updates</Text>
          <Text style={styles.text}>{weeklyDevelopment.size}</Text>
          {weeklyDevelopment.highlights.map((highlight, index) => (
            <Text key={index} style={styles.bulletText}>
              - {highlight}
            </Text>
          ))}
        </Animated.View>
      );
    }

    if (item.type === "symptomChecker") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptom Checker</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a symptom (e.g., nausea)"
            value={symptom}
            onChangeText={(text) => setSymptom(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => alert(`Consult a doctor if ${symptom} persists.`)}
          >
            <Text style={styles.buttonText}>Check Symptom</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (item.type === "moodTracker") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Tracker</Text>
          <TextInput
            style={styles.input}
            placeholder="How are you feeling today?"
            value={mood}
            onChangeText={(text) => setMood(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setStressTip(stressTips[Math.floor(Math.random() * stressTips.length)])}
          >
            <Text style={styles.buttonText}>Track Mood</Text>
          </TouchableOpacity>
          {stressTip && <Text style={styles.text}>Suggestion: {stressTip}</Text>}
        </View>
      );
    }

    if (item.type === "meditation") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meditation and Relaxation</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Start Meditation</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Relaxation Exercises</Text>
                <Text style={styles.modalText}>
                  1. Sit in a comfortable position and close your eyes.
                </Text>
                <Text style={styles.modalText}>
                  2. Take a deep breath in for 4 seconds, hold for 4 seconds, and exhale slowly.
                </Text>
                <Text style={styles.modalText}>
                  3. Repeat this process for 5 minutes.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    }

    if (item.type === "tips") {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          {item.data.map((tip) => (
            <View key={tip.id} style={styles.tipContainer}>
              <Image source={tip.image} style={styles.tipImage} />
              <View style={styles.tipContent}>
                <Text style={styles.tipCategory}>{tip.category}</Text>
                <Text style={styles.tipTitle}>{tip.text}</Text>
                <Text style={styles.tipDate}>{tip.date}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  const data = [
    { type: "welcome" },
    { type: "tracker" },
    { type: "appointments", data: appointments },
    { type: "weeklyDevelopment" },
    { type: "symptomChecker" },
    { type: "moodTracker" },
    { type: "meditation" },
    { type: "tips", data: tips },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      renderItem={renderSection}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  tracker: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    marginBottom: 20,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  trackerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  appointmentDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  tipContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 10,
  },
  tipImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius,
    marginRight: 10,
  },
  tipContent: {
    flex: 1,
    justifyContent: "center",
  },
  tipCategory: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tipTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  tipDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 5,
  },
  bulletText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginVertical: 5,
  },
});

export default Dashboard;
