// server/controllers/notificationController.js
const { Notification, Mother, Alert, CHW } = require('../models');
const axios = require('axios');
const { sendSMS } = require('../services/smsService');

exports.createNotification = async (req, res) => {
  try {
    const { 
      title,
      message, 
      type,
      status,
      date,
      location,
      alertId,
      chwId,
      motherId 
    } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      status,
      date,
      location,
      alertId,
      chwId,
      motherId
    });

    // Get mother's Expo push token
    const mother = await Mother.findByPk(motherId);
    if (mother && mother.expoPushToken) {
      try {
        await axios.post('https://exp.host/--/api/v2/push/send', {
          to: mother.expoPushToken,
          title: title || 'New Notification',
          body: message,
          data: {
            notificationId: notification.id,
            type,
            status,
            date,
            location
          }
        });
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

exports.createCHWNotification = async (req, res) => {
  try {
    const { title, message, type, motherId, chwId, alertId, location } = req.body;

    // Create notification in database
    const notification = await Notification.create({
      title,
      message,
      type,
      motherId,
      chwId,
      alertId,
      location: location ? JSON.stringify(location) : null,
      status: 'UNREAD',
      date: new Date(),
    });

    // Get CHW's details
    const chw = await CHW.findByPk(chwId);
    if (!chw) {
      throw new Error('CHW not found');
    }

    // Get mother's details
    const mother = await Mother.findByPk(motherId);
    if (!mother) {
      throw new Error('Mother not found');
    }

    // Send push notification to CHW if they have an Expo token
    if (chw.expoPushToken) {
      try {
        const pushMessage = {
          to: chw.expoPushToken,
          sound: 'default',
          title: title,
          body: message,
          priority: 'high',
          data: {
            type: type,
            notificationId: notification.id,
            alertId: alertId,
            location: location,
            motherId: motherId,
            motherName: `${mother.firstName} ${mother.lastName}`,
          },
        };

        await axios.post('https://exp.host/--/api/v2/push/send', pushMessage);
        console.log('CHW push notification sent successfully');
      } catch (error) {
        console.error('Error sending CHW push notification:', error);
      }
    }

    // Send SMS to CHW if it's an emergency
    if (type === 'EMERGENCY' && chw.phone) {
      try {
        const locationText = location 
          ? `Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
          : 'Location not available';

        const smsMessage = `EMERGENCY: ${message} ${locationText}`;
        await sendSMS(chw.phone, smsMessage);
        console.log('Emergency SMS sent to CHW');
      } catch (error) {
        console.error('Error sending SMS to CHW:', error);
      }
    }

    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error in createCHWNotification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        { model: Mother, as: 'mother', attributes: ['id', 'firstName', 'lastName'] },
        { model: Alert, as: 'alert', attributes: ['id', 'type', 'status'] },
        { model: CHW, as: 'chw', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Error getting notifications', error: error.message });
  }
};

exports.getCHWNotifications = async (req, res) => {
  try {
    const { chwId } = req.params;
    const notifications = await Notification.findAll({
      where: { chwId },
      include: [
        {
          model: Mother,
          attributes: ['firstName', 'lastName', 'phone'],
        },
        {
          model: Alert,
          attributes: ['id', 'type', 'description', 'status'],
        },
      ],
      order: [['date', 'DESC']],
    });
    res.json({ data: notifications });
  } catch (error) {
    console.error("Error in getCHWNotifications:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.status = status;
    await notification.save();

    res.json({ notification });
  } catch (error) {
    console.error("Error in updateNotificationStatus:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.sendTestNotification = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    if (!expoPushToken) {
      return res.status(400).json({ message: 'Expo push token is required' });
    }

    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoPushToken,
      title: 'Test Notification',
      body: 'This is a test notification from MomCare',
      data: { test: true }
    });

    res.json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: 'Error sending test notification', error: error.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { 
      title,
      message, 
      type,
      status,
      location,
      motherId,
      chwId
    } = req.body;

    // Create alert in database
    const alert = await Alert.create({
      title,
      message,
      type,
      status: status || 'PENDING',
      location,
      motherId,
      chwId
    });

    // Get CHW's Expo push token
    const chw = await CHW.findByPk(chwId);
    if (chw && chw.expoPushToken) {
      try {
        await axios.post('https://exp.host/--/api/v2/push/send', {
          to: chw.expoPushToken,
          title: title || 'New Alert',
          body: message,
          priority: 'high',
          data: {
            alertId: alert.id,
            type,
            status: alert.status,
            location,
            motherId
          }
        });
      } catch (error) {
        console.error('Error sending push alert:', error);
      }
    }

    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      include: [
        { model: Mother, attributes: ['id', 'name'] },
        { model: CHW, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ message: 'Error getting alerts', error: error.message });
  }
};

exports.updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    const alert = await Alert.findByPk(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.status = status;
    await alert.save();

    res.json(alert);
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status', error: error.message });
  }
};

exports.sendTestAlert = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    if (!expoPushToken) {
      return res.status(400).json({ message: 'Expo push token is required' });
    }

    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoPushToken,
      title: 'Test Alert',
      body: 'This is a test alert from MomCare',
      priority: 'high',
      data: { test: true }
    });

    res.json({ message: 'Test alert sent successfully' });
  } catch (error) {
    console.error('Error sending test alert:', error);
    res.status(500).json({ message: 'Error sending test alert', error: error.message });
  }
};
