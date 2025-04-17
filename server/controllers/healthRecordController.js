const HealthRecord = require('../models/HealthRecord');

// Create Health Record
exports.createHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json({ record });
  } catch (error) {
    console.error("Error creating health record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Health Record by ID
exports.getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Health record not found" });
    res.json({ record });
  } catch (error) {
    console.error("Error fetching health record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get Health Records by Mother ID
exports.getHealthRecordsByMotherId = async (req, res) => {
  try {
    const records = await HealthRecord.findAll({ where: { motherId: req.params.motherId } });
    if (!records.length) return res.status(404).json({ message: "No health records found for this mother" });
    res.json({ records });
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update Health Record by ID
exports.updateHealthRecord = async (req, res) => {
  try {
    await HealthRecord.update(req.body, { where: { id: req.params.id } });
    const updatedRecord = await HealthRecord.findByPk(req.params.id);
    res.json({ record: updatedRecord });
  } catch (error) {
    console.error("Error updating health record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
