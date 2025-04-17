const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../services/analyticsService');
const { protect } = require('../middlewares/authMiddleware');

// Get dashboard analytics
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = await getDashboardAnalytics(
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router; 