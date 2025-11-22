import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import useExpoPushNotifications from '../../useExpoPushNotifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';
import { LinearGradient } from 'expo-linear-gradient';

const TestNotifications = () => {
  const { expoPushToken, notification } = useExpoPushNotifications();
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const verifyToken = async () => {
    try {
      setVerifying(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(
        `${BACKEND_URL}/api/mothers/verify-expo-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTokenInfo(response.data);
      Alert.alert('Token Status', 
        `Token Status: ${response.data.hasToken ? 'Registered' : 'Not Registered'}\n` +
        `Mother: ${response.data.motherName}`
      );
    } catch (error) {
      console.error('Error verifying token:', error);
      Alert.alert('Error', 'Failed to verify token');
    } finally {
      setVerifying(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/notifications/test`,
        { expoPushToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#FFF5F7", "#FFE4E6"]} style={styles.header}>
        <Text style={styles.title}>Push Notification Test</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Expo Push Token:</Text>
          <Text style={styles.token}>{expoPushToken || 'No token available'}</Text>
        </View>

        {tokenInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Token Status:</Text>
            <Text style={styles.status}>
              {tokenInfo.hasToken ? 'Registered' : 'Not Registered'}
            </Text>
            <Text style={styles.motherName}>
              Mother: {tokenInfo.motherName}
            </Text>
          </View>
        )}

        {notification && (
          <View style={styles.notificationContainer}>
            <Text style={styles.label}>Last Notification:</Text>
            <Text style={styles.notificationText}>
              {notification.request.content.body}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={verifying ? 'Verifying...' : 'Verify Token'}
            onPress={verifyToken}
            disabled={verifying}
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button
            title={loading ? 'Sending...' : 'Send Test Notification'}
            onPress={sendTestNotification}
            disabled={loading || !expoPushToken}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  token: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  status: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
  },
  motherName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  notificationContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSpacer: {
    height: 10,
  },
});

export default TestNotifications; 