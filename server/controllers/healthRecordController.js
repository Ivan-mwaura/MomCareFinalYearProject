// server/controllers/healthRecordController.js
const { HealthRecord } = require('../models');

exports.createHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json({ record });
  } catch (error) {
    console.error("Error in createHealthRecord:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.findAll();
    res.json({ data: records });
  } catch (error) {
    console.error("Error in getHealthRecords:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ record });
  } catch (error) {
    console.error("Error in getHealthRecordById:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateHealthRecord = async (req, res) => {
  try {
    await HealthRecord.update(req.body, { where: { id: req.params.id } });
    const updatedRecord = await HealthRecord.findByPk(req.params.id);
    res.json({ record: updatedRecord });
  } catch (error) {
    console.error("Error in updateHealthRecord:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
