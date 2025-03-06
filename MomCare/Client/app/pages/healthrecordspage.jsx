import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";

const HealthRecords = () => {
  const [expandedLabResult, setExpandedLabResult] = useState(null);
  const [viewConsultation, setViewConsultation] = useState(false);
  const [viewMedications, setViewMedications] = useState(false);

  const visitSummaries = [
    {
      date: "Nov 1, 2024",
      summary: "Routine check-up. No complications detected.",
    },
    {
      date: "Oct 5, 2024",
      summary: "Follow-up for mild anemia. Iron supplements prescribed.",
    },
    {
      date: "Sep 10, 2024",
      summary: "Prenatal ultrasound. Baby is healthy and developing well.",
    },
  ];

  const labResults = [
    {
      id: 1,
      date: "Nov 15, 2024",
      test: "Complete Blood Count",
      details: "WBC: 8,000/mm³ (Range: 4,500-11,000/mm³)\nHemoglobin: 13.5 g/dL (Range: 12-16 g/dL)\nPlatelets: 250,000/mm³ (Range: 150,000-450,000/mm³)",
      consultation: "Patient shows mild anemia. Iron supplements recommended.",
      medications: ["Iron tablets - 200 mg once daily for 3 months"],
    },
    {
      id: 2,
      date: "Oct 10, 2024",
      test: "Urine Analysis",
      details: "No abnormalities detected.",
      consultation: "Routine check-up. No follow-up required.",
      medications: [],
    },
    {
      id: 3,
      date: "Sep 20, 2024",
      test: "Liver Function Test",
      details: "ALT: 25 U/L (Normal Range: 7-56 U/L)\nAST: 20 U/L (Normal Range: 10-40 U/L)",
      consultation: "Liver function is normal. No action required.",
      medications: [],
    },
  ];

  const toggleLabResult = (id) => {
    setExpandedLabResult(expandedLabResult === id ? null : id);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Health Records</Text>

      {/* Visit Summaries */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Visit Summaries</Text>
        {visitSummaries.map((item, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.text}>{item.summary}</Text>
          </View>
        ))}
      </View>

      {/* Lab Results */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Lab Results</Text>
        {labResults.map((item) => (
          <View key={item.id} style={styles.resultItem}>
            <TouchableOpacity
              style={styles.resultHeader}
              onPress={() => toggleLabResult(item.id)}
            >
              <Ionicons
                name="flask-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.resultText}>
                {item.date} - {item.test}
              </Text>
              <Ionicons
                name={
                  expandedLabResult === item.id
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            {expandedLabResult === item.id && (
              <View style={styles.resultDetails}>
                <Text style={styles.text}>{item.details}</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setViewConsultation(!viewConsultation)}
                  >
                    <Text style={styles.buttonText}>Consultation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => setViewMedications(!viewMedications)}
                  >
                    <Text style={styles.buttonText}>Medications</Text>
                  </TouchableOpacity>
                </View>
                {viewConsultation && (
                  <Text style={styles.text}>{item.consultation}</Text>
                )}
                {viewMedications && item.medications.length > 0 && (
                  <View>
                    {item.medications.map((medication, idx) => (
                      <Text key={idx} style={styles.text}>
                        {medication}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Export Records */}
      <TouchableOpacity style={styles.exportButton}>
        <Ionicons name="download-outline" size={20} color={COLORS.background} />
        <Text style={styles.buttonText}>Export Records</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  summaryItem: {
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginVertical: 5,
  },
  resultItem: {
    marginBottom: 15,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  resultDetails: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  buttonGroup: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-around",
  },
  smallButton: {
    padding: 5,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    marginTop: 20,
  },
});

export default HealthRecords;
