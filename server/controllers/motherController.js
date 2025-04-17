// server/controllers/motherController.js
const { Mother, CHW, User, RiskAssessment } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

exports.searchMothers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const mothers = await Mother.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ]
      },
      include: [{
        model: CHW,
        as: 'chw',
        attributes: ['firstName', 'lastName']
      }]
    });
    
    const formattedMothers = mothers.map((m) => {
      const mData = m.toJSON();
      mData.assignedCHW = mData.chw 
        ? `${mData.chw.firstName} ${mData.chw.lastName}` 
        : null;
      delete mData.chw;
      return mData;
    });
    
    res.json({ data: formattedMothers });
  } catch (error) {
    console.error("Error in searchMothers:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Register a new Mother (creates a record in both the mothers table and the users table)
exports.registerMother = async (req, res) => {
  try {
    // Expect req.body to include mother's details plus a password for the user account.
    const { password, ...motherData } = req.body;
  
    // Create Mother record
    const mother = await Mother.create(motherData);
  
    // Create User account for the mother
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: mother.email,
      password: hashedPassword,
      role: 'mother',
      motherId: mother.id,
      firstName: mother.firstName,
      lastName: mother.lastName,
      phone: mother.phone
    });
  
    res.status(201).json({ mother, user });
  } catch (error) {
    console.error("Error in registerMother:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all Mothers with their assigned CHW's name (via association)
exports.getMothers = async (req, res) => {
  try {
    const mothers = await Mother.findAll({
      include: [{
        model: CHW,
        as: 'chw',
        attributes: ['firstName', 'lastName']
      }]
    });

    // Format the output to display the CHW's full name
    const formattedMothers = mothers.map((m) => {
      const mData = m.toJSON();
      mData.assignedCHW = mData.chw 
        ? `${mData.chw.firstName} ${mData.chw.lastName}` 
        : null;
      delete mData.chw;
      return mData;
    });
    
    res.json({ data: formattedMothers });
  } catch (error) {
    console.error("Error in getMothers:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get a Mother by ID with assigned CHW's name
exports.getMotherById = async (req, res) => {
  try {
    const mother = await Mother.findByPk(req.params.id, {
      include: [{
        model: CHW,
        as: 'chw',
        attributes: ['firstName', 'lastName']
      }]
    });
  
    if (!mother) return res.status(404).json({ message: 'Mother not found' });
    
    const mData = mother.toJSON();
    mData.assignedCHW = mData.chw
      ? `${mData.chw.firstName} ${mData.chw.lastName}`
      : null;
    delete mData.chw;
  
    res.json({ mother: mData });
  } catch (error) {
    console.error("Error in getMotherById:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update a Mother's details and return updated CHW info if available
exports.updateMother = async (req, res) => {
  try {
    await Mother.update(req.body, { where: { id: req.params.id } });
    const updatedMother = await Mother.findByPk(req.params.id, {
      include: [{
        model: CHW,
        as: 'chw',
        attributes: ['firstName', 'lastName']
      }]
    });
  
    const mData = updatedMother.toJSON();
    mData.assignedCHW = mData.chw
      ? `${mData.chw.firstName} ${mData.chw.lastName}`
      : null;
    delete mData.chw;
  
    res.json({ mother: mData });
  } catch (error) {
    console.error("Error in updateMother:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a Mother
exports.deleteMother = async (req, res) => {
  try {
    await Mother.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Mother deleted successfully' });
  } catch (error) {
    console.error("Error in deleteMother:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Profile routes (for logged-in user)
exports.getProfile = async (req, res) => {
  try {
    // Assuming req.user.id is set by your auth middleware
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id);
    res.json({ user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const { User } = require('../models');
    await User.update({ firstName, lastName, email }, { where: { id: req.user.id } });
    const updatedUser = await User.findByPk(req.user.id);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateExpoPushToken = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const motherId = req.user.motherId;

    if (!motherId) {
      return res.status(400).json({ message: 'User is not associated with a mother account' });
    }

    await Mother.update(
      { expoPushToken },
      { where: { id: motherId } }
    );

    res.json({ message: 'Expo push token updated successfully' });
  } catch (error) {
    console.error('Error updating Expo push token:', error);
    res.status(500).json({ message: 'Error updating Expo push token', error: error.message });
  }
};

exports.verifyExpoToken = async (req, res) => {
  try {
    const motherId = req.user.motherId;

    if (!motherId) {
      return res.status(400).json({ message: 'User is not associated with a mother account' });
    }

    const mother = await Mother.findByPk(motherId);
    
    if (!mother) {
      return res.status(404).json({ message: 'Mother not found' });
    }

    res.json({ 
      hasToken: !!mother.expoPushToken,
      token: mother.expoPushToken,
      motherName: `${mother.firstName} ${mother.lastName}`
    });
  } catch (error) {
    console.error('Error verifying Expo token:', error);
    res.status(500).json({ message: 'Error verifying Expo token', error: error.message });
  }
};
