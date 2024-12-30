import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { BarChart, ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const RiskAssessment = () => {
  const [riskScore, setRiskScore] = useState(65); // Mock Risk Score
  const [contributingFactors, setContributingFactors] = useState([
    { name: "Wealth Index", value: "Middle", impact: "High" },
    { name: "Distance to Health Facility", value: "Big Problem", impact: "Medium" },
    { name: "Education Level", value: "Secondary", impact: "Low" },
  ]);
  const [recommendations, setRecommendations] = useState([
    "Schedule regular ANC visits.",
    "Discuss health concerns with your CHW.",
    "Attend community health education sessions.",
  ]);
  const [notifications, setNotifications] = useState([
    "Your upcoming appointment is on Nov 25, 2024, at 10:30 AM.",
    "Your risk score has improved compared to last month.",
    "Join a health education session at your nearest clinic.",
  ]);
  const [riskHistory, setRiskHistory] = useState([
    { month: "June", score: 70 },
    { month: "July", score: 65 },
    { month: "August", score: 60 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({});
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  const clinics = [
    { name: "City Health Clinic", distance: "2.5 km", travelTime: "10 mins" },
    { name: "Green Valley Medical Center", distance: "4 km", travelTime: "15 mins" },
  ];

  const handleSelectClinic = (clinic) => {
    setIsModalVisible(true);
  };

  const assessmentQuestions = [
    {
      id: "1",
      question: "How frequently do you watch TV?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Less than once a week", value: 1 },
        { label: "At least once a week", value: 2 },
      ],
    },
    {
      id: "2",
      question: "Is distance to the health facility a problem?",
      options: [
        { label: "Big Problem", value: 1 },
        { label: "Not a big problem", value: 2 },
      ],
    },
    {
      id: "3",
      question: "How frequently do you listen to the radio?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Less than once a week", value: 1 },
        { label: "At least once a week", value: 2 },
      ],
    },
    {
      id: "4",
      question: "What is your current marital status?",
      options: [
        { label: "Never in Union", value: 0 },
        { label: "Married", value: 1 },
        { label: "Living with Partner", value: 2 },
        { label: "Widowed", value: 3 },
        { label: "Divorced", value: 4 },
        { label: "Separated", value: 5 },
      ],
    },
    {
      id: "5",
      question: "What is your wealth index?",
      options: [
        { label: "Poorest", value: 1 },
        { label: "Poorer", value: 2 },
        { label: "Middle", value: 3 },
        { label: "Richer", value: 4 },
        { label: "Richest", value: 5 },
      ],
    },
    {
      id: "6",
      question: "What is your educational level?",
      options: [
        { label: "No education", value: 0 },
        { label: "Primary", value: 1 },
        { label: "Secondary", value: 2 },
        { label: "Higher", value: 3 },
      ],
    },
    {
      id: "7",
      question: "What is your age group?",
      options: [
        { label: "15-19", value: 1 },
        { label: "20-24", value: 2 },
        { label: "25-29", value: 3 },
        { label: "30-34", value: 4 },
        { label: "35-39", value: 5 },
        { label: "40-44", value: 6 },
        { label: "45-49", value: 7 },
      ],
    },
    {
      id: "8", 
      question: "What is yur current occupation?",

      options: [
        { label: "Unemployed", value: 0 },
        { label: "Employed", value: 1 },
        { label: "Self-employed", value: 2 },
        { label: "Student", value: 3 },
        { label: "Retired", value: 4 },
        { label: "Housewife", value: 5 },
      ],
    },

    {
      id: "9",
      question: "What is the Location of your residence?",
      options: [
        { label: "Urban", value: 0 },
        { label: "Rural", value: 1 },
      ],
    },
    
  ];

  const handleAnswer = (questionId, value) => {
    setAssessmentData((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSummaryVisible(true);
    }
  };

  const handleSubmit = () => {
    console.log("User Assessment Data:", assessmentData);
    setIsAssessmentModalVisible(false);
    setIsSummaryVisible(false);
    setCurrentStep(0);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Risk Assessment and Support</Text>
        <Text style={styles.headerSubtitle}>
          Understand and manage your clinical visit journey.
        </Text>
      </View>

      {/* Take Risk Assessment Button */}
      <TouchableOpacity
        style={styles.assessmentButton}
        onPress={() => setIsAssessmentModalVisible(true)}
      >
        <Ionicons name="clipboard-outline" size={20} color={COLORS.background} />
        <Text style={styles.assessmentButtonText}>Take Risk Assessment</Text>
      </TouchableOpacity>

      {/* Risk Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Risk Score</Text>
        <ProgressChart
          data={{
            labels: ["Risk"],
            data: [riskScore / 100],
          }}
          width={screenWidth - 30}
          height={200}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundGradientFrom: COLORS.background,
            backgroundGradientTo: COLORS.background,
            color: (opacity = 1) => `rgba(247, 108, 108, ${opacity})`,
            labelColor: () => COLORS.textPrimary,
          }}
          hideLegend={false}
        />
        <Text style={styles.riskText}>
          You are at a {riskScore > 70 ? "High" : riskScore > 40 ? "Moderate" : "Low"} Risk of
          Dropping Out
        </Text>
      </View>

      {/* Personalized Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalized Notifications</Text>
        {notifications.map((notification, index) => (
          <View key={index} style={styles.notificationCard}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        ))}
      </View>

      {/* Key Contributing Factors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Contributing Factors</Text>
        {contributingFactors.map((factor, index) => (
          <View key={index} style={styles.factorCard}>
            <Text style={styles.factorName}>{factor.name}</Text>
            <Text style={styles.factorValue}>Your Input: {factor.value}</Text>
            <Text style={styles.factorImpact}>Impact: {factor.impact}</Text>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendation}>
            <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.primary} /> {rec}
          </Text>
        ))}
      </View>

      {/* Nearby Clinics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Clinics</Text>
        {clinics.map((clinic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.clinicCard}
            onPress={() => handleSelectClinic(clinic.name)}
          >
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text style={styles.clinicDetails}>
              {clinic.distance} away, {clinic.travelTime} by car
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Risk Over Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Risk Over Time</Text>
        <BarChart
          data={{
            labels: riskHistory.map((entry) => entry.month),
            datasets: [{ data: riskHistory.map((entry) => entry.score) }],
          }}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundGradientFrom: COLORS.background,
            backgroundGradientTo: COLORS.background,
            color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
            labelColor: () => COLORS.textPrimary,
          }}
          showValuesOnTopOfBars
        />
      </View>

      {/* Risk Assessment Modal */}
      <Modal visible={isAssessmentModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!isSummaryVisible ? (
              <>
                <Text style={styles.modalTitle}>
                  {assessmentQuestions[currentStep].question}
                </Text>
                {assessmentQuestions[currentStep].options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      assessmentData[assessmentQuestions[currentStep].id] ===
                        option.value && styles.optionButtonSelected,
                    ]}
                    onPress={() =>
                      handleAnswer(assessmentQuestions[currentStep].id, option.value)
                    }
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.buttonText}>
                    {currentStep === assessmentQuestions.length - 1
                      ? "Finish"
                      : "Next"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Summary</Text>
                {Object.entries(assessmentData).map(([key, value]) => (
                  <Text key={key} style={styles.modalText}>
                    {assessmentQuestions.find((q) => q.id === key)?.question}:{" "}
                    {assessmentQuestions
                      .find((q) => q.id === key)
                      ?.options.find((o) => o.value === value)?.label}
                  </Text>
                ))}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsAssessmentModalVisible(false);
                setCurrentStep(0);
                setAssessmentData({});
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
    fontStyle: "italic",
  },
  assessmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    marginBottom: 20,
  },
  assessmentButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: SIZES.borderRadius,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textPrimary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  riskText: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  factorCard: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    marginBottom: 10,
  },
  factorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  factorValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  factorImpact: {
    fontSize: 14,
    color: COLORS.accent,
    marginTop: 5,
  },
  recommendation: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  clinicCard: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    marginBottom: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  clinicDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
});

export default RiskAssessment;
