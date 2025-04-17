import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SupportAndFeedback = () => {
  const assignedCHW = {
    id: "1",
    name: "Dr. Jane Doe",
    contact: "+1234567890",
    email: "jane.doe@healthcare.com",
    profilePicture: require("../../assets/profile.jpg"),
    description: "Your caring guide for all things mama and baby.",
  };

  const otherCHWs = [
    {
      id: "2",
      name: "Nurse John Smith",
      contact: "+1234567891",
      email: "john.smith@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description: "Here for your prenatal and postnatal journey.",
    },
    {
      id: "3",
      name: "Dr. Emily Brown",
      contact: "+1234567892",
      email: "emily.brown@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description: "Ready to support your maternal wellness.",
    },
    {
      id: "4",
      name: "Nurse Lisa Ray",
      contact: "+1234567893",
      email: "lisa.ray@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description: "Your postpartum and breastfeeding buddy.",
    },
  ];

  const [selectedCHW, setSelectedCHW] = useState(assignedCHW);
  const flatListRef = useRef(null);

  const handleCall = () => {
    Linking.openURL(`tel:${selectedCHW.contact}`).catch(() =>
      alert("Oops! Couldn’t make the call. Try again, mama.")
    );
  };

  const handleFeedbackSubmit = () => {
    alert("Thank you, mama! Your feedback means the world to us.");
  };

  const renderCHWCard = ({ item }) => (
    <TouchableOpacity style={styles.chwCard} onPress={() => setSelectedCHW(item)}>
      <Image source={item.profilePicture} style={styles.chwImage} />
      <Text style={styles.chwName}>{item.name}</Text>
      <Text style={styles.chwDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="heart" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama’s Support Hub</Text>
        <Text style={styles.headerSubtitle}>We’re here for you every step</Text>
      </LinearGradient>

      {/* Assigned CHW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Personal CHW</Text>
        <View style={styles.assignedCard}>
          <Image source={selectedCHW.profilePicture} style={styles.assignedImage} />
          <View style={styles.assignedInfo}>
            <Text style={styles.assignedName}>{selectedCHW.name}</Text>
            <Text style={styles.assignedDescription}>{selectedCHW.description}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Chat initiated")}>
                <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.actionGradient}>
                  <Ionicons name="chatbubbles" size={20} color="#FFF" />
                  <Text style={styles.actionText}>Chat</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.actionGradient}>
                  <Ionicons name="call" size={20} color="#FFF" />
                  <Text style={styles.actionText}>Call</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Other CHWs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Caring Helpers</Text>
        <FlatList
          ref={flatListRef}
          data={otherCHWs}
          keyExtractor={(item) => item.id}
          renderItem={renderCHWCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chwList}
        />
      </View>

      {/* Feedback */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tell Us, Mama</Text>
        <Text style={styles.feedbackPrompt}>How can we make your journey even better?</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Share your thoughts here..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
          <LinearGradient colors={["#FF6B6B", "#FF8787"]} style={styles.submitGradient}>
            <Text style={styles.submitText}>Send Love</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 12,
  },
  assignedCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  assignedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  assignedInfo: {
    flex: 1,
  },
  assignedName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  assignedDescription: {
    fontSize: 14,
    color: "#777",
    marginVertical: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
  chwList: {
    paddingVertical: 8,
  },
  chwCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 200,
    alignItems: "center",
    elevation: 2,
  },
  chwImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  chwName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  chwDescription: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },
  feedbackPrompt: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
    height: 120,
    elevation: 2,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  submitGradient: {
    padding: 14,
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default SupportAndFeedback;