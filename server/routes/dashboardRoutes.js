const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../services/dashboardService');
//nst auth = require('../middleware/auth');

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    const dashboardData = await getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router; 