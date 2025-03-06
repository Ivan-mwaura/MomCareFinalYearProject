const ChwModel = require('../../Models/NewChwRegistration');
const { BadRequestError } = require('../../errors');

const RegisterChw = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      county,
      constituency,
      ward,
      healthFocusArea,
      rolesAndResponsibilities,
      status,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      languagesSpoken,  // Ensure this is captured from the request body
    } = req.body;

    // Validate that languagesSpoken is an array and has values
    if (!languagesSpoken || languagesSpoken.length === 0) {
      return next(new BadRequestError('Languages spoken must be provided.'));
    }

    // Check if email already exists
    const existingChw = await ChwModel.findOne({ where: { email } });
    if (existingChw) {
      return next(new BadRequestError('Email already exists. Please choose a different email.'));
    }

    const newChw = await ChwModel.create({
      firstName,
      lastName,
      phone,
      email,
      county,
      constituency,
      ward,
      healthFocusArea,
      rolesAndResponsibilities,
      status,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      languagesSpoken,  // Include it in the new CHW registration
    });

    res.status(201).json({
      message: 'CHW registered successfully',
      newChw
    });
  } catch (error) {
    console.error(error);
    next(error);  // Pass the error to the next middleware
  }
};

//get all chws

const getAllChws = async (req, res, next) => {
    try {
        const allChws = await ChwModel.findAll();
        res.status(200).json({ success: true, data: allChws });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
    

module.exports = {
  RegisterChw,
    getAllChws,
};
