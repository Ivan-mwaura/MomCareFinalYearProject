import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BACKEND_URL } from '@env';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  const router = useRouter();

  const weeklyDevelopment = {
    week: 24,
    size: 'about the size of a cantaloupe',
    highlights: [
      "Lungs are blooming with air sacs.",
      "Skin is softening up nicely.",
      "Ears are catching your lullabies.",
    ],
  };

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const userRes = await axios.get(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      const appRes = await axios.get(`${BACKEND_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedAppointments = appRes.data.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2);
      setAppointments(sortedAppointments);

      setHealthTips([
        {
          id: 1,
          category: 'Nutrition',
          text: 'Add leafy greens for iron',
          date: '2 days ago',
          image: 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        },
        {
          id: 2,
          category: 'Relax',
          text: 'Prenatal yoga eases stress',
          date: '4 days ago',
          image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
        },
      ]);
    } catch (error) {
      console.error('Dashboard fetch error:', error.message);
      if (error.message === 'No token found' || error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <LinearGradient colors={['#FFF5F7', '#F8F9FA']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Preparing your mama space...</Text>
      </LinearGradient>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />}
    >
      {/* Header */}
      <LinearGradient colors={['#FFF5F7', '#FFE4E6']} style={styles.header}>
        <Animated.View
          style={{
            opacity: animationValue,
            transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }}
        >
          <Text style={styles.headerTitle}>Welcome, {user ? user.firstName : 'Mama'}! 🌷</Text>
          <Text style={styles.headerSubtitle}>A peek at your blossoming journey</Text>
        </Animated.View>
      </LinearGradient>

      {/* Baby Growth Card */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] },
        ]}
      >
        <LinearGradient colors={['#FF6B6B', '#FF8787']} style={styles.gradientCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="flower" size={28} color="#FFF" />
            <Text style={styles.cardTitle}>Baby’s Bloom</Text>
          </View>
          <Text style={styles.babyWeek}>Week {weeklyDevelopment.week}</Text>
          <Text style={styles.babySize}>Your little one is {weeklyDevelopment.size}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        style={[
          styles.section,
          { transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] },
        ]}
      >
        <Text style={styles.sectionTitle}>Quick Mama Moves</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar" size={24} color="#FF6B6B" />
            <Text style={styles.actionText}>Book Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble" size={24} color="#FF6B6B" />
            <Text style={styles.actionText}>Chat CHW</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
            <Text style={styles.actionText}>Track Health</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Upcoming Appointments */}
      <Animated.View
        style={[
          styles.section,
          { transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] },
        ]}
      >
        <Text style={styles.sectionTitle}>Next Check-Ins</Text>
        {appointments.length === 0 ? (
          <Text style={styles.emptyText}>No visits scheduled yet!</Text>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <Ionicons name="calendar" size={20} color="#FF6B6B" style={styles.cardIcon} />
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{appointment.type}</Text>
                <Text style={styles.cardSubtext}>{appointment.date} • {appointment.time}</Text>
              </View>
            </View>
          ))
        )}
      </Animated.View>

      {/* Weekly Highlights */}
      <Animated.View
        style={[
          styles.section,
          { transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [70, 0] }) }] },
        ]}
      >
        <Text style={styles.sectionTitle}>This Week’s Magic</Text>
        <View style={styles.card}>
          {weeklyDevelopment.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightRow}>
              <Ionicons name="sparkles" size={18} color="#FF6B6B" />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Health Tips */}
      <Animated.View
        style={[
          styles.section,
          { transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }] },
        ]}
      >
        <Text style={styles.sectionTitle}>Mama Wisdom</Text>
        {healthTips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <Image source={{ uri: tip.image }} style={styles.tipImage} />
            <View style={styles.tipContent}>
              <Text style={styles.tipCategory}>{tip.category}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
              <Text style={styles.tipDate}>{tip.date}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Refresh Button */}
      <Animated.View
        style={{
          transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [90, 0] }) }],
        }}
      >
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <LinearGradient colors={['#FF6B6B', '#FF8787']} style={styles.refreshGradient}>
            <Ionicons name="refresh" size={20} color="#FFF" style={styles.refreshIcon} />
            <Text style={styles.refreshText}>Refresh Journey</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  babyWeek: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '500',
  },
  babySize: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 6,
    opacity: 0.9,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 6,
    fontWeight: '500',
  },
  cardIcon: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  tipImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    textTransform: 'uppercase',
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    marginVertical: 4,
  },
  tipDate: {
    fontSize: 12,
    color: '#999',
  },
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  refreshGradient: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    marginRight: 8,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default Dashboard;