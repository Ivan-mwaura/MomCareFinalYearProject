const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, notificationController.createNotification);
router.get('/', protect, notificationController.getNotifications);

module.exports = router;
