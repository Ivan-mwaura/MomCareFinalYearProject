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
    const { email, password, nationalId, ...otherData } = req.body;

    // Check for existing mother with same email or national ID
    const existingMother = await Mother.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { nationalId: nationalId }
        ]
      }
    });

    if (existingMother) {
      if (existingMother.email === email) {
        return res.status(409).json({ 
          error: 'Email already registered',
          field: 'email'
        });
      }
      if (existingMother.nationalId === nationalId) {
        return res.status(409).json({ 
          error: 'National ID already registered',
          field: 'nationalId'  
        });
      }
    }

    // Check if user exists with same email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered as a user',
        field: 'email'
      });
    }

    // Create mother record
    const mother = await Mother.create({
      email,
      nationalId,
      ...otherData
    });

    // Create user account
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      role: 'mother',
      motherId: mother.id,
      firstName: mother.firstName,
      lastName: mother.lastName,
      phone: mother.phone
    });

    res.status(201).json({
      message: 'Mother registered successfully',
      mother: {
        id: mother.id,
        email: mother.email,
        firstName: mother.firstName,
        lastName: mother.lastName
      }
    });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors[0].message,
        field: error.errors[0].path
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      const message = field === 'email' ? 
        'Email already registered' : 
        field === 'nationalId' ? 
          'National ID already registered' : 
          'Duplicate value not allowed';
      
      return res.status(409).json({
        error: message,
        field: field
      });
    }
    console.error('Error registering mother:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Mothers with their assigned CHW's name (via association)
exports.getMothers = async (req, res) => {
  try {
    console.log('Fetching mothers with risk assessments...');
    
    // First, let's check if we can get risk assessments directly
    const riskAssessments = await RiskAssessment.findAll({
      limit: 5
    });
    console.log('Risk Assessments:', JSON.stringify(riskAssessments, null, 2));

    const mothers = await Mother.findAll({
      include: [
        {
          model: CHW,
          as: 'chw',
          attributes: ['firstName', 'lastName']
        },
        {
          model: RiskAssessment,
          as: 'riskAssessmentsRecords',
          attributes: ['riskLevel', 'createdAt'],
          separate: true,
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      ]
    });

    //console.log('Raw mothers data:', JSON.stringify(mothers, null, 2));

    // Format the output to display the CHW's full name and include risk level
    const formattedMothers = mothers.map((m) => {
      const mData = m.toJSON();
      mData.assignedCHW = mData.chw 
        ? `${mData.chw.firstName} ${mData.chw.lastName}` 
        : null;
      // Add risk level from the latest risk assessment
      mData.riskLevel = mData.riskAssessmentsRecords && mData.riskAssessmentsRecords.length > 0
        ? mData.riskAssessmentsRecords[0].riskLevel
        : null;
      // Clean up the response by removing nested objects
      delete mData.chw;
      delete mData.riskAssessmentsRecords;
      return mData;
    });
    
    console.log('Formatted mothers data:', JSON.stringify(formattedMothers, null, 2));
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
