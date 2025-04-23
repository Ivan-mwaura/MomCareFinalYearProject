const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.createDoctor = async (req, res) => {
  try {
    const { password, ...doctorData } = req.body;

    console.log(password)
    
    // Create Doctor record
    const doctor = await Doctor.create(doctorData);
    
    // Create User account for the doctor
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: doctor.email,
      password: hashedPassword,
      role: 'doctor',
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone
    });
    
    // Don't send passwords in response
    const { password: _, ...doctorWithoutPassword } = doctor.toJSON();
    const { password: __, ...userWithoutPassword } = user.toJSON();
    
    res.status(201).json({ 
      doctor: doctorWithoutPassword,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    let updateFields = { ...updateData };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    await Doctor.update(updateFields, { where: { id: req.params.id } });
    const updatedDoctor = await Doctor.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
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
