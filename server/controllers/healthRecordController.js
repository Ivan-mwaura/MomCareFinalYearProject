const HealthRecord = require('../models/HealthRecord');
const { Op } = require('sequelize');

// Create Health Record
exports.createHealthRecord = async (req, res) => {
  try {
    const {
      motherId,
      hypertension,
      diabetes,
      thyroidDisorders,
      obesity,
      hiv,
      syphilis,
      malaria,
      uti,
      depression,
      anxiety,
      stressLevel,
      previousComplications,
      parity,
      gravidity
    } = req.body;

    // Validate required fields
    const errors = {};

    // Validate motherId
    if (!motherId) {
      errors.motherId = 'Mother ID is required';
    }

    // Validate mental health scores if provided
    if (depression !== undefined && depression !== '') {
      const depressionScore = parseInt(depression);
      if (isNaN(depressionScore) || depressionScore < 0 || depressionScore > 27) {
        errors.depression = 'Depression score must be between 0 and 27';
      }
    }

    if (anxiety !== undefined && anxiety !== '') {
      const anxietyScore = parseInt(anxiety);
      if (isNaN(anxietyScore) || anxietyScore < 0 || anxietyScore > 21) {
        errors.anxiety = 'Anxiety score must be between 0 and 21';
      }
    }

    if (stressLevel !== undefined && stressLevel !== '') {
      const stressScore = parseInt(stressLevel);
      if (isNaN(stressScore) || stressScore < 1 || stressScore > 10) {
        errors.stressLevel = 'Stress level must be between 1 and 10';
      }
    }

    // Validate obstetric history if provided
    if (parity !== undefined && parity !== '') {
      const parityNum = parseInt(parity);
      if (isNaN(parityNum) || parityNum < 0) {
        errors.parity = 'Parity must be a non-negative number';
      }
    }

    if (gravidity !== undefined && gravidity !== '') {
      const gravidityNum = parseInt(gravidity);
      if (isNaN(gravidityNum) || gravidityNum < 0) {
        errors.gravidity = 'Gravidity must be a non-negative number';
      }
    }

    // Validate previous complications if provided
    if (previousComplications && !Array.isArray(previousComplications)) {
      errors.previousComplications = 'Previous complications must be an array';
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed'
      });
    }

    // Create the health record
    const record = await HealthRecord.create({
      motherId,
      hypertension: hypertension || false,
      diabetes: diabetes || false,
      thyroidDisorders: thyroidDisorders || false,
      obesity: obesity || false,
      hiv: hiv || false,
      syphilis: syphilis || false,
      malaria: malaria || false,
      uti: uti || false,
      depression: depression || null,
      anxiety: anxiety || null,
      stressLevel: stressLevel || null,
      previousComplications: previousComplications || [],
      parity: parity || null,
      gravidity: gravidity || null
    });

    res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      record
    });
  } catch (error) {
    console.error("Error creating health record:", error);

    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = {};
      error.errors.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      return res.status(400).json({
        success: false,
        errors: validationErrors,
        message: 'Validation failed'
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A health record already exists for this mother',
        error: error.message
      });
    }

    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid mother ID provided',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
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

    //console.log(req.body);
    await HealthRecord.update(req.body, { where: { id: req.params.id } });
    
    const updatedRecord = await HealthRecord.findByPk(req.params.id);
    res.json({ record: updatedRecord });
  } catch (error) {
    console.error("Error updating health record:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
