const AppointmentRecord = require('../models/AppointmentRecord');
const Mother = require('../models/Mother'); // Assuming you have a Mother model

// Create an Appointment Record
exports.createAppointmentRecord = async (req, res) => {
  try {
    const { motherId, ...appointmentData } = req.body; // Extract all fields

    // Fetch CHW linked to the mother
    const mother = await Mother.findByPk(motherId);
    if (!mother) {
      return res.status(404).json({ message: "Mother not found" });
    }

    const chwId = mother.chwId; // Fetch from mother table

    // ✅ Pass all fields dynamically
    const record = await AppointmentRecord.create({
      motherId,
      chwId, // Auto-fetch CHW ID
      ...appointmentData // Include all remaining fields
    });

    res.status(201).json({ record });
  } catch (error) {
    console.error("Error creating appointment record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get Appointment Records by motherId
exports.getAppointmentRecordsByMotherId = async (req, res) => {
  try {
    const records = await AppointmentRecord.findAll({ where: { motherId: req.params.motherId } });
    if (!records.length) return res.status(404).json({ message: "No appointment records found for this mother" });

    res.json({ records });
  } catch (error) {
    console.error("Error fetching appointment records:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Get a Single Appointment Record by ID
exports.getAppointmentRecordById = async (req, res) => {
  try {
    const record = await AppointmentRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Appointment record not found" });

    res.json({ record });
  } catch (error) {
    console.error("Error fetching appointment record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Update Appointment Record by ID
exports.updateAppointmentRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await AppointmentRecord.update(req.body, { where: { id } });

    if (!updated[0]) return res.status(404).json({ message: "No appointment record found with this ID" });

    const updatedRecord = await AppointmentRecord.findByPk(id);
    res.json({ record: updatedRecord });
  } catch (error) {
    console.error("Error updating appointment record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ Delete Appointment Record by ID
exports.deleteAppointmentRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AppointmentRecord.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "No appointment record found with this ID" });

    res.json({ message: "Appointment record deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
