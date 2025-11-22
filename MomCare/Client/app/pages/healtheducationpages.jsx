import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const HealthEducationPages = () => {
  const [activeSection, setActiveSection] = useState("Health Tips");
  const [activeCategory, setActiveCategory] = useState("Nutrition");
  const [expandedItem, setExpandedItem] = useState(null);

  const healthCategories = ["Nutrition", "Exercise", "Mental Health", "Childcare", "Pregnancy Tips"];
  const faqCategories = ["Pregnancy", "Delivery", "Postnatal Care"];

  const healthTips = {
    Nutrition: [
      { id: 1, title: "Balanced Bites", details: "Fill your plate with colorful fruits, veggies, lean proteins, and whole grains, mama. Skip the processed stuff!" },
      { id: 2, title: "Iron Boosters", details: "Spinach, lentils, and lean meats keep anemia away as you grow your little one." },
      { id: 3, title: "Water Love", details: "Sip 8-10 glasses daily to keep you and baby glowing and flowing." },
    ],
    Exercise: [
      { id: 6, title: "Mama Yoga", details: "Stretch and breathe with prenatal yoga to ease into labor with calm and strength." },
      { id: 7, title: "Gentle Walks", details: "A daily stroll keeps swelling down and spirits up—perfect for you and baby." },
    ],
    "Mental Health": [
      { id: 10, title: "Heart Talks", details: "Chat with loved ones or a counselor to lighten your load, mama." },
      { id: 11, title: "Mindful Moments", details: "Breathe deep or meditate to melt away worries." },
    ],
    Childcare: [
      { id: 14, title: "Vaccine Hugs", details: "Stick to the schedule to shield your little one from harm." },
      { id: 15, title: "Clean & Cozy", details: "Sterilize bottles to keep feeds safe and sweet." },
    ],
    "Pregnancy Tips": [
      { id: 18, title: "Check-In Love", details: "Regular visits keep tabs on your baby’s blossoming growth." },
      { id: 19, title: "Pure Bliss", details: "Skip alcohol and smoking to keep your baby’s world safe and sound." },
    ],
  };

  const faq = {
    Pregnancy: [
      { id: 22, question: "What’s off the menu?", answer: "Steer clear of raw fish, undercooked meats, and unpasteurized dairy, mama." },
      { id: 23, question: "When to call for help?", answer: "Reach out if you feel sharp cramps, see bleeding, or notice less baby wiggle." },
    ],
    Delivery: [
      { id: 25, question: "How do I know it’s time?", answer: "Regular contractions, water breaking, or back pain mean it’s go-time!" },
      { id: 26, question: "Ready for the big day?", answer: "Pack your bag, join a class, and dream up your birth plan." },
    ],
    "Postnatal Care": [
      { id: 28, question: "Healing after baby?", answer: "Rest up, eat well, and sip water to bounce back beautifully." },
      { id: 29, question: "Feeling blue?", answer: "If sadness lingers or bonding’s tough, talk to someone you trust." },
    ],
  };

  const categories = activeSection === "Health Tips" ? healthCategories : faqCategories;
  const data = activeSection === "Health Tips" ? healthTips[activeCategory] : faq[activeCategory];

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Ionicons name="book" size={32} color="#FF6B6B" />
        <Text style={styles.headerTitle}>Mama’s Wisdom</Text>
        <Text style={styles.headerSubtitle}>Grow with love and knowledge</Text>
      </LinearGradient>

      {/* Section Toggle */}
      <View style={styles.toggleContainer}>
        {["Health Tips", "FAQs"].map((section) => (
          <TouchableOpacity
            key={section}
            style={styles.toggleButton}
            onPress={() => {
              setActiveSection(section);
              setActiveCategory(section === "Health Tips" ? "Nutrition" : "Pregnancy");
              setExpandedItem(null);
            }}
          >
            <LinearGradient
              colors={activeSection === section ? ["#FF6B6B", "#FF8787"] : ["#F0F0F0", "#F8F9FA"]}
              style={styles.toggleGradient}
            >
              <Text style={[styles.toggleText, activeSection === section && styles.activeToggleText]}>
                {section}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => {
              setActiveCategory(category);
              setExpandedItem(null);
            }}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText,
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.contentSection}>
        {data.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <TouchableOpacity style={styles.itemHeader} onPress={() => toggleItem(item.id)}>
              <Text style={styles.itemTitle}>
                {activeSection === "FAQs" ? item.question : item.title}
              </Text>
              <Ionicons
                name={expandedItem === item.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#FF6B6B"
              />
            </TouchableOpacity>
            {expandedItem === item.id && (
              <Text style={styles.itemDetails}>
                {activeSection === "FAQs" ? item.answer : item.details}
              </Text>
            )}
          </View>
        ))}
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  toggleGradient: {
    padding: 12,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "600",
  },
  activeToggleText: {
    color: "#FFF",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    elevation: 2,
  },
  activeCategoryButton: {
    backgroundColor: "#FF6B6B",
  },
  categoryText: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#FFF",
  },
  contentSection: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF5F7",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 12,
  },
  itemDetails: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    padding: 16,
    paddingTop: 8,
  },
});

export default HealthEducationPages;