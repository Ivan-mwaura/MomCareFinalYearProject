const express = require('express');
const router = express.Router();
const { updatePregnancyWeeksAndScheduleAppointments } = require('../Jobs/UpdatePregnancyWeeks');

// Route to manually trigger the pregnancy weeks update job
router.post('/appointment-and-records-update', async (req, res) => {
  try {
    const result = await updatePregnancyWeeksAndScheduleAppointments();
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 