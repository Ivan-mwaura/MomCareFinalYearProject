// server/controllers/alertController.js
const { Alert, User } = require('../models');
const { sendPushNotification } = require('../services/pushNotifications');

exports.createAlert = async (req, res) => {
  try {
    // Create the alert record in the database
    const alert = await Alert.create(req.body);

    // Retrieve the user's push token (assuming it's stored in the User model)
    // Adjust the query if you store the token in a different table or field.
    const user = await User.findByPk(req.body.motherId);
    if (user && user.pushToken) {
      // Customize the notification content if needed
      const title = "Emergency Alert";
      const body = `Dear ${user.firstName}, an emergency alert has been triggered. Please await assistance.`;
      // Send push notification using Expo's push service
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
    const alerts = await Alert.findAll();
    res.json({ data: alerts });
  } catch (error) {
    console.error("Error in getAlerts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
