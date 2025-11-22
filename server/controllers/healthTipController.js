// server/controllers/healthTipController.js
const { HealthTip } = require('../models');

exports.createHealthTip = async (req, res) => {
  try {
    const tip = await HealthTip.create(req.body);
    res.status(201).json({ tip });
  } catch (error) {
    console.error("Error in createHealthTip:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getHealthTips = async (req, res) => {
  try {
    const tips = await HealthTip.findAll();
    res.json({ data: tips });
  } catch (error) {
    console.error("Error in getHealthTips:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
