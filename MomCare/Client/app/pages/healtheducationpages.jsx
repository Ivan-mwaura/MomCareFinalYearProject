import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../styles/theme";

const HealthEducationPages = () => {
  const [activeSection, setActiveSection] = useState("Health Tips");
  const [activeCategory, setActiveCategory] = useState("Nutrition");
  const [expandedItem, setExpandedItem] = useState(null);

  const healthCategories = ["Nutrition", "Exercise", "Mental Health", "Childcare", "Pregnancy Tips"];
  const faqCategories = ["Pregnancy", "Delivery", "Postnatal Care"];

  const healthTips = {
    Nutrition: [
      { id: 1, title: "Balanced Diet", details: "Consume a variety of foods, including fruits, vegetables, lean proteins, and whole grains. Avoid processed foods and excess sugars." },
      { id: 2, title: "Iron-Rich Foods", details: "Include foods like spinach, lentils, and lean meats to prevent anemia during pregnancy." },
      { id: 3, title: "Stay Hydrated", details: "Drink at least 8-10 glasses of water daily to stay hydrated and support your body's needs." },
      { id: 4, title: "Limit Caffeine", details: "Avoid high-caffeine drinks as they may affect your baby's development. Opt for herbal teas." },
      { id: 5, title: "Calcium-Rich Foods", details: "Consume dairy products, fortified soy milk, or leafy greens to strengthen your bones and your baby's." },
    ],
    Exercise: [
      { id: 6, title: "Prenatal Yoga", details: "Yoga improves flexibility, reduces stress, and helps prepare your body for labor." },
      { id: 7, title: "Walking", details: "Daily walks boost circulation, prevent swelling, and keep you active." },
      { id: 8, title: "Pelvic Floor Exercises", details: "Strengthen pelvic muscles with Kegel exercises to prepare for delivery." },
      { id: 9, title: "Stretching", details: "Gentle stretches reduce back pain and improve posture during pregnancy." },
    ],
    "Mental Health": [
      { id: 10, title: "Seek Support", details: "Share your feelings with family, friends, or a counselor to manage stress." },
      { id: 11, title: "Practice Mindfulness", details: "Meditate or engage in deep breathing exercises to reduce anxiety." },
      { id: 12, title: "Adequate Sleep", details: "Ensure you get at least 7-8 hours of sleep each night for overall well-being." },
      { id: 13, title: "Limit Screen Time", details: "Avoid excessive use of devices, especially before bed, to enhance mental clarity." },
    ],
    Childcare: [
      { id: 14, title: "Vaccination Schedule", details: "Follow the recommended vaccination schedule to protect your child from diseases." },
      { id: 15, title: "Sterilize Bottles", details: "Always sterilize feeding bottles and utensils to maintain hygiene." },
      { id: 16, title: "Safe Sleeping Practices", details: "Ensure your baby sleeps on their back to reduce the risk of SIDS (Sudden Infant Death Syndrome)." },
      { id: 17, title: "Breastfeeding Techniques", details: "Learn proper latching techniques to ensure effective feeding and reduce discomfort." },
    ],
    "Pregnancy Tips": [
      { id: 18, title: "Regular Check-Ups", details: "Attend prenatal visits to monitor your baby's growth and development." },
      { id: 19, title: "Avoid Alcohol and Smoking", details: "These can harm your baby's health and lead to complications." },
      { id: 20, title: "Comfortable Clothing", details: "Wear loose, breathable clothing to stay comfortable during pregnancy." },
      { id: 21, title: "Side Sleeping", details: "Sleep on your left side to improve blood flow to the baby and avoid pressure on your organs." },
    ],
  };

  const faq = {
    Pregnancy: [
      { id: 22, question: "What foods should I avoid?", answer: "Avoid raw fish, undercooked meat, high-mercury fish, and unpasteurized dairy products." },
      { id: 23, question: "When should I call my doctor?", answer: "Contact your doctor if you experience severe cramping, bleeding, or reduced baby movements." },
      { id: 24, question: "How can I manage morning sickness?", answer: "Eat small meals frequently, avoid strong odors, and sip ginger tea to ease nausea." },
    ],
    Delivery: [
      { id: 25, question: "What are the signs of labor?", answer: "Signs include regular contractions, water breaking, and lower back pain." },
      { id: 26, question: "How do I prepare for delivery?", answer: "Pack a hospital bag, attend childbirth classes, and have a birth plan ready." },
      { id: 27, question: "When should I go to the hospital?", answer: "Head to the hospital when contractions are 5 minutes apart or your water breaks." },
    ],
    "Postnatal Care": [
      { id: 28, question: "How can I recover after delivery?", answer: "Rest, eat nutritious meals, and stay hydrated to aid recovery." },
      { id: 29, question: "What are signs of postpartum depression?", answer: "Persistent sadness, lack of energy, and difficulty bonding with your baby may indicate depression. Seek help if needed." },
      { id: 30, question: "How do I care for the baby’s umbilical cord?", answer: "Keep it clean and dry; let it fall off naturally without pulling it." },
    ],
  };

  const categories = activeSection === "Health Tips" ? healthCategories : faqCategories;
  const data =
    activeSection === "Health Tips" ? healthTips[activeCategory] : faq[activeCategory];

  const renderItem = (item, isFAQ) => (
    <TouchableOpacity
      key={item.id}
      style={styles.expandableItem}
      onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
    >
      <View style={styles.expandableHeader}>
        <Text style={styles.expandableTitle}>
          {isFAQ ? item.question : item.title}
        </Text>
        <Ionicons
          name={expandedItem === item.id ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color={COLORS.primary}
        />
      </View>
      {expandedItem === item.id && (
        <Text style={styles.expandableContent}>
          {isFAQ ? item.answer : item.details}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Toggle Section */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeSection === "Health Tips" && styles.activeToggleButton,
          ]}
          onPress={() => {
            setActiveSection("Health Tips");
            setActiveCategory("Nutrition");
          }}
        >
          <Text
            style={[
              styles.toggleText,
              activeSection === "Health Tips" && styles.activeToggleText,
            ]}
          >
            Health Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeSection === "FAQs" && styles.activeToggleButton,
          ]}
          onPress={() => {
            setActiveSection("FAQs");
            setActiveCategory("Pregnancy");
          }}
        >
          <Text
            style={[
              styles.toggleText,
              activeSection === "FAQs" && styles.activeToggleText,
            ]}
          >
            FAQs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.section}>
        {data.map((item) => renderItem(item, activeSection === "FAQs"))}
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: SIZES.borderRadius,
    marginHorizontal: 5,
    backgroundColor: COLORS.secondary,
  },
  activeToggleButton: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  activeToggleText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.borderRadius,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  activeCategoryText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  expandableItem: {
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  expandableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandableTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  expandableContent: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HealthEducationPages;
