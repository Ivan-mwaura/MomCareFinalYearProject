const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/update-fcm-token', protect, userController.updateFcmToken);
router.post('/update-expo-token', protect, userController.updateExpoPushToken);

module.exports = router;
