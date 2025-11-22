import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ML_URL, BACKEND_URL } from "@env";

const screenWidth = Dimensions.get("window").width;

const RiskAssessment = () => {
  const [riskScore, setRiskScore] = useState(null);
  const [recommendations, setRecommendations] = useState([
    "Keep up with your check-ups, mama!",
    "Nourish yourself with love and care.",
    "Reach out to your CHW anytime.",
  ]);
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({});
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const assessmentQuestions = [
    { id: "1", question: "How often do you enjoy TV time?", options: ["Not at all", "Rarely", "Weekly"] },
    { id: "2", question: "Is getting to the clinic tough?", options: ["Yes, very", "Not really"] },
    { id: "3", question: "Do you tune into the radio?", options: ["Never", "Sometimes", "Often"] },
    { id: "4", question: "What's your relationship status?", options: ["Single", "Married", "Partnered", "Widowed", "Divorced", "Separated"] },
    { id: "5", question: "How's your financial comfort?", options: ["Struggling", "Okay", "Stable", "Well-off", "Thriving"] },
    { id: "6", question: "What's your education level?", options: ["None", "Primary", "Secondary", "Higher"] },
    { id: "7", question: "How young at heart are you?", options: ["15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49"] },
    { id: "8", question: "What keeps you busy?", options: ["Unemployed", "Employed", "Self-employed", "Student", "Retired", "Home Mama"] },
    { id: "9", question: "Where do you call home?", options: ["City", "Countryside"] },
  ];

  console.log(ML_URL);
  console.log(BACKEND_URL);

  const handleAnswer = (questionId, value) => {
    setAssessmentData((prev) => ({ ...prev, [questionId]: value }));
  };

  const typeText = (text, callback) => {
    setIsTyping(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30);
  };

  useEffect(() => {
    if (isAssessmentModalVisible && !isSummaryVisible) {
      setDisplayedText("");
      typeText(assessmentQuestions[currentStep].question);
    }
  }, [currentStep, isAssessmentModalVisible, isSummaryVisible]);

  const handleNextQuestion = () => {
    if (assessmentData[assessmentQuestions[currentStep].id] === undefined) {
      alert("Please choose an answer, mama!");
      return;
    }
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSummaryVisible(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("User not found");

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

      let modelResponse;
      try {
        modelResponse = await axios.post(`${ML_URL}/predict`, modelInput, { timeout: 10000 });
      } catch (err) {
        setLoading(false);
        console.error("Model error:", err.message);
        alert("Sorry, we couldn't reach the risk model. Please check your connection and try again.");
        return;
      }

      const { predicted_risk, risk_value } = modelResponse.data;
      console.log(modelResponse.data);
      const riskLevel = risk_value >= 5 ? "High" : "Low";
      const newRecommendations = getRecommendations(riskLevel, risk_value);

      setRiskScore(risk_value);
      setRecommendations(newRecommendations);

      const predictionPayload = { motherId: user.motherId ?? user.id, predicted_risk };

      try {
        await axios.post(`${BACKEND_URL}/api/predictions`, predictionPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Backend error:", err.message);
        if (err.response && err.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          // Optionally, redirect to login screen here
        } else {
          alert("Risk prediction was calculated, but saving to your profile failed. Please try again later.");
        }
      }

      setIsAssessmentModalVisible(false);
      setIsSummaryVisible(false);
      setCurrentStep(0);
      setAssessmentData({});
    } catch (error) {
      alert("Oops! Something went wrong. Try again, mama.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = (riskLevel, riskValue) => {
    const baseRecommendations = {
      High: [
        "Schedule an immediate consultation with your healthcare provider",
        "Increase frequency of prenatal check-ups",
        "Consider additional monitoring and support services",
        "Review and adjust your daily routine for better health",
        "Connect with a specialist for personalized care"
      ],
      Moderate: [
        "Maintain regular check-ups with your healthcare provider",
        "Focus on balanced nutrition and adequate rest",
        "Stay active with moderate exercise",
        "Monitor your health indicators regularly",
        "Keep your healthcare provider informed of any changes"
      ],
      Low: [
        "Continue with your current healthy lifestyle",
        "Maintain regular prenatal visits",
        "Stay informed about pregnancy health",
        "Practice stress management techniques",
        "Keep up with your exercise routine"
      ]
    };

    // Add personalized recommendations based on risk value
    const personalizedRecs = [];
    if (riskValue > 8) {
      personalizedRecs.push("Consider additional specialist consultations");
    }
    if (riskValue > 5) {
      personalizedRecs.push("Implement more frequent health monitoring");
    }
    if (riskValue < 5) {
      personalizedRecs.push("Continue your excellent health practices");
    }

    return [...baseRecommendations[riskLevel], ...personalizedRecs];
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="shield-checkmark" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama's Safety Check</Text>
        <Text style={styles.headerSubtitle}>Keeping you and baby well</Text>
      </LinearGradient>

      {/* Risk Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Wellness Score</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={{ marginTop: 12, color: '#FF6B6B', fontWeight: '600' }}>Assessing your risk...</Text>
          </View>
        ) : (riskScore !== null && riskScore !== undefined) ? (
          <Animatable.View
            animation="fadeIn"
            duration={800}
            style={styles.riskCard}
          >
            <ProgressChart
              data={{ data: [riskScore / 100] }}
              width={100}
              height={100}
              strokeWidth={12}
              radius={40}
              chartConfig={{
                backgroundGradientFrom: "#FFF",
                backgroundGradientTo: "#FFF",
                color: () => "#FF6B6B",
              }}
              hideLegend={true}
            />
            <View style={styles.riskInfo}>
              <Text style={styles.riskLabel}>Risk Level</Text>
              <Text style={styles.riskLevel}>
                { riskScore > 5 ? "High" : "Low"}
              </Text>
              {/*<Text style={styles.riskScore}>{riskScore}%</Text>*/}
            </View>
          </Animatable.View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="alert-circle" size={48} color="#FF6B6B" style={{ marginBottom: 10 }} />
            <Text style={styles.placeholderText}>
              You haven't taken a risk assessment yet. Tap below to get started and see your wellness score!
            </Text>
          </View>
        )}
      </View>

      {/* Take Assessment Button */}
      <TouchableOpacity
        style={styles.assessmentButton}
        onPress={() => setIsAssessmentModalVisible(true)}
      >
        <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.buttonGradient}>
          <Ionicons name="heart" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Check My Wellness</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mama's Next Steps</Text>
        {recommendations.map((rec, index) => (
          <Animatable.View
            key={index}
            animation="slideInLeft"
            delay={index * 200}
            style={styles.recCard}
          >
            <Ionicons name="flower" size={20} color="#FF6B6B" />
            <Text style={styles.recText}>{rec}</Text>
          </Animatable.View>
        ))}
      </View>

      {/* Assessment Modal */}
      <Modal visible={isAssessmentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.modalContent}>
            {!isSummaryVisible ? (
              <>
                <Animatable.View
                  animation="fadeIn"
                  duration={500}
                  style={styles.questionContainer}
                >
                  <Text style={styles.modalTitle}>{displayedText}</Text>
                  {isTyping && <Text style={styles.typingIndicator}>|</Text>}
                </Animatable.View>
                <ScrollView style={styles.optionsContainer}>
                  {assessmentQuestions[currentStep].options.map((option, idx) => (
                    <Animatable.View
                      key={idx}
                      animation="fadeInUp"
                      delay={idx * 100}
                      duration={400}
                    >
                      <TouchableOpacity
                        style={[
                          styles.optionButton,
                          assessmentData[assessmentQuestions[currentStep].id] === idx &&
                            styles.optionSelected,
                        ]}
                        onPress={() => handleAnswer(assessmentQuestions[currentStep].id, idx)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                  <Text style={styles.nextButtonText}>
                    {currentStep === assessmentQuestions.length - 1 ? "Review" : "Next"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Your Answers, Mama</Text>
                <ScrollView style={styles.summaryContainer}>
                  {Object.entries(assessmentData).map(([key, value], index) => (
                    <Animatable.View
                      key={key}
                      animation="slideInLeft"
                      delay={index * 200}
                    >
                      <Text style={styles.summaryText}>
                        {assessmentQuestions.find((q) => q.id === key)?.question}:{" "}
                        {assessmentQuestions.find((q) => q.id === key)?.options[value]}
                      </Text>
                    </Animatable.View>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsAssessmentModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 12,
  },
  riskCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    alignItems: "center",
  },
  riskInfo: {
    flex: 1,
    marginLeft: 16,
  },
  riskLabel: {
    fontSize: 14,
    color: "#999",
  },
  riskLevel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
    marginTop: 4,
  },
  riskScore: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  assessmentButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonGradient: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  recCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  recText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 10,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 16,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionButton: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  optionSelected: {
    backgroundColor: "#FF6B6B",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  optionSelectedText: {
    color: "#FFF",
  },
  nextButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  summaryContainer: {
    maxHeight: 300,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  cancelButton: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  typingIndicator: {
    fontSize: 24,
    color: '#FF6B6B',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default RiskAssessment;