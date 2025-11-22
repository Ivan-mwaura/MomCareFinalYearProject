// controllers/notificationsController.js
const { PushToken } = require('../models');

exports.registerPushToken = async (req, res) => {
  const { token, motherId } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }
  try {
    const [pushToken, created] = await PushToken.findOrCreate({
      where: { token },
      defaults: { token, motherId },
    });
    res.status(200).json({ message: 'Push token registered successfully.' });
  } catch (error) {
    console.error("Error saving push token:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
