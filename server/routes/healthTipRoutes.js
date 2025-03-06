const express = require('express');
const router = express.Router();
const healthTipController = require('../controllers/healthTipController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, healthTipController.createHealthTip);
router.get('/', protect, healthTipController.getHealthTips);

module.exports = router;
