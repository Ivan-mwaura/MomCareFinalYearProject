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
import { COLORS, SIZES } from "../styles/theme";

const SupportAndFeedback = () => {
  const assignedCHW = {
    id: "1",
    name: "Dr. Jane Doe",
    contact: "+1234567890",
    email: "jane.doe@healthcare.com",
    profilePicture: require("../../assets/profile.jpg"),
    description:
      "Your dedicated Community Health Worker (CHW) is here to assist with any health-related queries or concerns.",
  };

  const otherCHWs = [
    {
      id: "2",
      name: "Nurse John Smith",
      contact: "+1234567891",
      email: "john.smith@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description:
        "Specializes in antenatal / postnatal care for mothers",
    },
    {
      id: "3",
      name: "Dr. Emily Brown",
      contact: "+1234567892",
      email: "emily.brown@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description:
        "Available for consultations related to maternal health.",
    },
    {
      id: "4",
      name: "Nurse Lisa Ray",
      contact: "+1234567893",
      email: "lisa.ray@healthcare.com",
      profilePicture: require("../../assets/profile.jpg"),
      description: "Expert in postpartum recovery and lactation support.",
    },
  ];

  const [selectedCHW, setSelectedCHW] = useState(assignedCHW);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCall = () => {
    Linking.openURL(`tel:${selectedCHW.contact}`);
  };

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted");
  };



  const renderCHWCard = ({ item }) => (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={() => setSelectedCHW(item)}
    >
      <Image source={item.profilePicture} style={styles.profilePicture} />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Assigned CHW Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Assigned CHW</Text>
        <View style={styles.profileCard}>
          <Image source={selectedCHW.profilePicture} style={styles.profilePicture} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{selectedCHW.name}</Text>
            <Text style={styles.email}>{selectedCHW.email}</Text>
            <Text style={styles.description}>{selectedCHW.description}</Text>
          </View>
        </View>

        {/* Chat and Call Options */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => console.log("Chat initiated")}>
            <Ionicons name="chatbubbles-outline" size={24} color={COLORS.background} />
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call-outline" size={24} color={COLORS.background} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Other CHWs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Want to Contact Another CHW?</Text>
        <View style={styles.horizontalControls}>
          {/* Previous Button */}
         
          {/* FlatList with Cards */}
          <FlatList
            ref={flatListRef}
            data={otherCHWs}
            keyExtractor={(item) => item.id}
            renderItem={renderCHWCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            onScrollToIndexFailed={() => {}}
          />

        </View>
      </View>

      {/* Feedback Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provide Feedback</Text>
        <Text style={styles.feedbackLabel}>
          Share your thoughts about the app or your healthcare experience:
        </Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Write your feedback here..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
        />
        <TouchableOpacity style={styles.feedbackButton} onPress={handleFeedbackSubmit}>
          <Text style={styles.feedbackButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 17,
    fontStyle: "italic",
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  profileCard: {
    width: SIZES.width * 0.85, // Responsive card width
    marginHorizontal: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalList: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
  },
  horizontalControls: {
    flexDirection: "row",
    alignItems: "flex-start", // Align buttons to the top
    justifyContent: "space-between",
    width: "99%",
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    marginHorizontal: 5,
  },
  actionText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  feedbackLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlignVertical: "top",
    marginBottom: 15,
    height: 120,
  },
  feedbackButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: 15,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SupportAndFeedback;
