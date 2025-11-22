// server/controllers/alertController.js
const { Alert, User, Mother } = require('../models');
const { sendPushNotification } = require('../services/pushNotifications');

exports.createAlert = async (req, res) => {
  try {
    const {
      type,
      description,
      motherId,
      motherName,
      date,
      location,
      bloodType,
      allergies,
      status,
      emergencyContacts
    } = req.body;

    // Validate required fields
    if (!motherId || !type || !description || !motherName || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the alert record in the database
    const alert = await Alert.create({
      type,
      description,
      patientId: motherId,
      patientName: motherName,
      date,
      status: status || 'PENDING'
    });

    // Get the mother's details
    const mother = await Mother.findByPk(motherId);
    if (!mother) {
      return res.status(404).json({ message: "Mother not found" });
    }

    // Get the mother's user account for push notifications
    const user = await User.findByPk(mother.userId);
    if (user && user.pushToken) {
      const title = "Emergency Alert";
      const body = `Dear ${motherName}, an emergency alert has been triggered. Help is on the way.`;
      await sendPushNotification(user.pushToken, title, body, { alertId: alert.id });
    }

    res.status(201).json({ alert });
  } catch (error) {
    console.error("Error in createAlert:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ data: alerts });
  } catch (error) {
    console.error("Error in getAlerts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
