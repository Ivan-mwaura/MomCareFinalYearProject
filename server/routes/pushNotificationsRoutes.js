const express = require('express');
const router = express.Router();
const { registerPushToken } = require('../controllers/pushNotificationsController');

router.post('/', registerPushToken);

module.exports = router;
