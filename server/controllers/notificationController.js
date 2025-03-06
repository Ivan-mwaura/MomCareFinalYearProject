// server/controllers/notificationController.js
const { Notification } = require('../models');

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ notification });
  } catch (error) {
    console.error("Error in createNotification:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json({ data: notifications });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
