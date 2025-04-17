const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Regular notification routes
router.post('/', protect, notificationController.createNotification);
router.get('/', protect, notificationController.getNotifications);
router.post('/test', protect, notificationController.sendTestNotification);

// CHW notification routes
router.post('/chw', protect, notificationController.createCHWNotification);
router.get('/chw/:chwId', protect, notificationController.getCHWNotifications);
router.patch('/:notificationId/status', protect, notificationController.updateNotificationStatus);

module.exports = router;
