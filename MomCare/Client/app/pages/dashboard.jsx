import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Modal,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import CustomSkeleton from './customSkeleton'; // Adjust the path as needed
import { COLORS, SIZES } from '../styles/theme';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Add more icons as needed
import { BACKEND_URL } from '@env';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient backgrounds

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const [mood, setMood] = useState('');
  const [symptom, setSymptom] = useState('');
  const [stressTip, setStressTip] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
    };
    checkToken();
  }, []);

  const weeklyDevelopment = {
    week: 24,
    size: 'Baby is the size of a cantaloupe',
    highlights: [
      "Baby's lungs are forming air sacs.",
      'Skin is becoming less translucent.',
      'Hearing ability is improving daily.',
    ],
  };

  const stressTips = [
    'Take a deep breath and count to 10 slowly.',
    'Engage in light yoga or stretching exercises.',
    'Listen to calming music for 10 minutes.',
  ];

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const userRes = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      const appRes = await axios.get(`${BACKEND_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort appointments by date and take the first 2
      const sortedAppointments = appRes.data.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2);
      setAppointments(sortedAppointments);

      const tipsRes = await axios.get(`${BACKEND_URL}/api/healthtips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHealthTips(tipsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const sectionsData = [
    { type: 'welcome' },
    { type: 'tracker' },
    { type: 'appointments' },
    { type: 'weeklyDevelopment' },
    { type: 'symptomChecker' },
    { type: 'moodTracker' },
    { type: 'meditation' },
    { type: 'tips' },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'welcome':
        return (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome, {user ? `${user.firstName} ${user.lastName}` : 'User'} 👋
            </Text>
            <Text style={styles.subtitle}>Here’s an overview of your journey:</Text>
          </View>
        );

      case 'tracker':
        return (
          <LinearGradient
            colors={['#FF9A9E', '#FAD0C4']}
            style={styles.trackerCard}
          >
            <Text style={styles.trackerTitle}>Pregnancy Stage Tracker</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.trackerText}>2nd Trimester (24 Weeks)</Text>
          </LinearGradient>
        );

      case 'appointments':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {appointments.length === 0 ? (
              <Text style={styles.text}>No appointments scheduled.</Text>
            ) : (
              appointments.map((appointment) => (
                <TouchableOpacity
                  key={appointment.id}
                  style={styles.appointmentCard}
                >
                  <Ionicons name="calendar" size={24} color={COLORS.primary} />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentTitle}>{appointment.type}</Text>
                    <Text style={styles.appointmentTime}>
                      {appointment.date} at {appointment.time}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        );

      case 'weeklyDevelopment':
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
              <View key={index} style={styles.bulletPoint}>
                <Ionicons name="ellipse" size={8} color={COLORS.primary} />
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
          </Animated.View>
        );

      case 'symptomChecker':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptom Checker</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a symptom (e.g., nausea)"
              value={symptom}
              onChangeText={setSymptom}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => alert(`Consult a doctor if ${symptom} persists.`)}
            >
              <Text style={styles.buttonText}>Check Symptom</Text>
            </TouchableOpacity>
          </View>
        );

      case 'moodTracker':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mood Tracker</Text>
            <TextInput
              style={styles.input}
              placeholder="How are you feeling today?"
              value={mood}
              onChangeText={setMood}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setStressTip(stressTips[Math.floor(Math.random() * stressTips.length)])
              }
            >
              <Text style={styles.buttonText}>Track Mood</Text>
            </TouchableOpacity>
            {stressTip && <Text style={styles.text}>Suggestion: {stressTip}</Text>}
          </View>
        );

      case 'meditation':
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
                    1. Sit comfortably and close your eyes.
                  </Text>
                  <Text style={styles.modalText}>
                    2. Breathe in for 4 seconds, hold for 4 seconds, then exhale slowly.
                  </Text>
                  <Text style={styles.modalText}>3. Repeat for 5 minutes.</Text>
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

      case 'tips':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Tips</Text>
            {healthTips.length === 0 ? (
              <Text style={styles.text}>No health tips available.</Text>
            ) : (
              healthTips.map((tip) => (
                <TouchableOpacity key={tip.id} style={styles.tipCard}>
                  <Image source={{ uri: tip.image }} style={styles.tipImage} />
                  <View style={styles.tipContent}>
                    <Text style={styles.tipCategory}>{tip.category}</Text>
                    <Text style={styles.tipTitle}>{tip.text}</Text>
                    <Text style={styles.tipDate}>{tip.date}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ScrollView style={styles.loadingScroll}>
        <View style={styles.loadingContainer}>
          {/* Skeleton Loading Placeholders */}
          <CustomSkeleton style={[styles.lineSkeleton, { width: '70%' }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '50%', marginTop: 6 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '60%', marginTop: 30 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '90%', height: 10, marginTop: 10 }]} />
          <CustomSkeleton style={[styles.lineSkeleton, { width: '40%', marginTop: 8 }]} />
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={sectionsData}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      renderItem={renderSection}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  trackerCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  trackerText: {
    fontSize: 14,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentDetails: {
    marginLeft: 10,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  appointmentTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 5,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  tipContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipCategory: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tipTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
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
});

export default Dashboard;