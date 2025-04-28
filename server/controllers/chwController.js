// server/controllers/chwController.js
const { CHW, User } = require('../models');
const bcrypt = require('bcryptjs');

exports.registerCHW = async (req, res) => {
  try {
    const { password, email, ...chwData } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required for CHW registration' });
    }

    // Check if email already exists in User table
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
    }

    // Check if email already exists in CHW table
    const existingCHW = await CHW.findOne({ where: { email } });
    if (existingCHW) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email address.' });
    }

    // Create CHW record
    const chw = await CHW.create({ ...chwData, email });

    // Create corresponding User record
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: chw.email,
      password: hashedPassword,
      role: 'chw',
      firstName: chw.firstName,
      lastName: chw.lastName,
      phone: chw.phone
    });

    res.status(201).json({ chw, user });
  } catch (error) {
    console.error("Error in registerCHW:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getCHWs = async (req, res) => {
  try {
    const chws = await CHW.findAll();
    res.json({ data: chws });
  } catch (error) {
    console.error("Error in getCHWs:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getCHWById = async (req, res) => {
  try {
    const chw = await CHW.findByPk(req.params.id);
    if (!chw) return res.status(404).json({ message: 'CHW not found' });
    res.json({ chw });
  } catch (error) {
    console.error("Error in getCHWById:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateCHW = async (req, res) => {
  try {
    await CHW.update(req.body, { where: { id: req.params.id } });
    const updatedCHW = await CHW.findByPk(req.params.id);
    res.json({ chw: updatedCHW });
  } catch (error) {
    console.error("Error in updateCHW:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteCHW = async (req, res) => {
  try {
    await CHW.destroy({ where: { id: req.params.id } });
    res.json({ message: 'CHW deleted successfully' });
  } catch (error) {
    console.error("Error in deleteCHW:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
