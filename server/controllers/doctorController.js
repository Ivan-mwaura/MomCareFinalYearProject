const Doctor = require('../models/Doctor');

exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ doctor });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    await Doctor.update(req.body, { where: { id: req.params.id } });
    const updatedDoctor = await Doctor.findByPk(req.params.id);
    res.json({ doctor: updatedDoctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.destroy({ where: { id: req.params.id } });
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
