const { User } = require('../models');

exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  await User.update({ firstName, lastName, email }, { where: { id: req.user.id } });
  const updatedUser = await User.findByPk(req.user.id);
  res.json({ user: updatedUser });
};

exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user.id; // Assuming you have user info in req.user from auth middleware

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fcmToken = fcmToken;
    await user.save();

    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Error updating FCM token:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateExpoPushToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const userId = req.user.id;

    await User.update(
      { expoPushToken },
      { where: { id: userId } }
    );

    res.json({ message: 'Expo push token updated successfully' });
  } catch (error) {
    console.error('Error updating Expo push token:', error);
    res.status(500).json({ message: 'Error updating Expo push token', error: error.message });
  }
};
