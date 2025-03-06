import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";
import { Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const RiskAssessment = () => {
  // State for risk overview and recommendations
  const [riskScore, setRiskScore] = useState(65);
  const [recommendations, setRecommendations] = useState([
    "Keep up with your scheduled check-ups.",
    "Maintain a healthy lifestyle.",
    "Consult with your CHW if needed.",
  ]);
  // Modal and assessment state
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({});
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  // Sample static data for clinics
  const clinics = [
    { name: "City Health Clinic", distance: "2.5 km", travelTime: "10 mins" },
    { name: "Green Valley Medical Center", distance: "4 km", travelTime: "15 mins" },
  ];

  // Assessment questions remain unchanged
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
      question: "What is your current occupation?",
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

  // Prevent moving forward if current question is unanswered.
  const handleNextQuestion = () => {
    if (assessmentData[assessmentQuestions[currentStep].id] === undefined) {
      alert("Please answer the question before proceeding.");
      return;
    }
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSummaryVisible(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        alert("User details not found. Please log in again.");
        return;
      }
      const user = JSON.parse(userData);
      const modelInput = {
        Frequency_media_use: assessmentData["1"] ?? 0,
        Distance_to_health: assessmentData["2"] ?? 0,
        Frequency_of_using_internet: assessmentData["3"] ?? 0,
        marital_status: assessmentData["4"] ?? 0,
        Wealth_index: assessmentData["5"] ?? 0,
        Education_level: assessmentData["6"] ?? 0,
        CurrAgeGroup: assessmentData["7"] ?? 0,
        Place_of_Residence: assessmentData["9"] ?? 0,
        Antenatal_visits: 0,
        Postnatal_visits: 0,
      };

      const modelResponse = await axios.post(
        "http://192.168.0.106:6000/predict",
        modelInput,
        { timeout: 10000 }
      );
      const { predicted_risk, risk_value } = modelResponse.data;
      setRiskScore(risk_value);

      if (predicted_risk === "High") {
        setRecommendations([
          "Urgent medical review is recommended.",
          "Contact your CHW immediately.",
          "Schedule an immediate appointment.",
          "Monitor your symptoms closely.",
          "Visit your nearest health facility as soon as possible.",
          "Review your daily routine and reduce stress.",
          "Keep a record of any worsening symptoms.",
          "Maintain a balanced diet and stay hydrated.",
          "Ensure you get enough rest and avoid strenuous activities.",
          "Follow up with your CHW regularly for updates.",
        ]);
      } else {
        setRecommendations([
          "Keep up with your scheduled check-ups.",
          "Maintain a healthy lifestyle.",
          "Consult with your CHW if needed.",
        ]);
      }

      const predictionPayload = {
        motherId: user.motherId ?? user.id,
        predicted_risk,
      };

      await axios.post("http://192.168.0.106:5000/api/predictions", predictionPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAssessmentModalVisible(false);
      setIsSummaryVisible(false);
      setCurrentStep(0);
      setAssessmentData({});
    } catch (error) {
      console.error("Error submitting risk assessment:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Risk Assessment</Text>
      </View>

      {/* Assessment Trigger */}
      <TouchableOpacity
        style={styles.assessmentButton}
        onPress={() => setIsAssessmentModalVisible(true)}
      >
        <Ionicons name="clipboard-outline" size={20} color={COLORS.background} />
        <Text style={styles.assessmentButtonText}>Take Assessment</Text>
      </TouchableOpacity>

      {/* Redesigned Risk Overview Card */}
      <View style={styles.riskCard}>
        <View style={styles.riskCardContent}>
          <View style={styles.progressContainer}>
            <ProgressChart
              data={{ labels: [""], data: [riskScore / 100] }}
              width={80}
              height={80}
              strokeWidth={10}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: COLORS.secondary,
                backgroundGradientTo: COLORS.secondary,
                color: (opacity = 1) => `rgba(247,108,108, ${opacity})`,
                labelColor: () => COLORS.textPrimary,
              }}
              hideLegend={true}
            />
          </View>
          <View style={styles.riskDetails}>
            <Text style={styles.riskDetailLabel}>Risk Level</Text>
            <Text style={styles.riskDetailText}>
              {riskScore > 70 ? "High" : riskScore > 40 ? "Moderate" : "Low"}
            </Text>
            <Text style={styles.riskPercentage}>{riskScore.toFixed(1)}%</Text>
          </View>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.card}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardText}>{rec}</Text>
          </View>
        ))}
      </View>

      {/* Nearby Clinics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Clinics</Text>
        {clinics.map((clinic, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => {}}>
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <Text style={styles.clinicDetails}>
                {clinic.distance} away, {clinic.travelTime} by car
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Assessment Modal */}
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
                      assessmentData[assessmentQuestions[currentStep].id] === option.value &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => handleAnswer(assessmentQuestions[currentStep].id, option.value)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                  <Text style={styles.buttonText}>
                    {currentStep === assessmentQuestions.length - 1 ? "Finish" : "Next"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Review Answers</Text>
                {Object.entries(assessmentData).map(([key, value]) => (
                  <Text key={key} style={styles.modalText}>
                    {assessmentQuestions.find((q) => q.id === key)?.question}:{" "}
                    {assessmentQuestions
                      .find((q) => q.id === key)
                      ?.options.find((o) => o.value === value)?.label}
                  </Text>
                ))}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  assessmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius,
    marginBottom: 15,
  },
  assessmentButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  riskCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  riskCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {
    marginRight: 15,
  },
  riskDetails: {
    flex: 1,
  },
  riskDetailLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  riskDetailText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  riskPercentage: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  clinicDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  optionButton: {
    padding: 14,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    padding: 14,
    borderRadius: SIZES.borderRadius,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RiskAssessment;
