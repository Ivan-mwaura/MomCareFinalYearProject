// server/controllers/patientController.js
const NewMotherModel = require('../../Models/NewMothersRegistration');

// Controller to create a new patient
const createPatient = async (req, res) => {
  try {

    
    const body = req.body;


    const NewMother = await NewMotherModel.create(body);

    res.status(201).json({message: "New Mom registered successfully", NewMother });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all registered Mothers

const getAllMothers = async (req, res) => {
  try {
    const mothers = await NewMotherModel.findAll();  

    return res.status(200).json({ success: true, data: mothers }); // Added success flag for consistency
  } catch (error) {
    console.error("Error fetching mothers:", error); // Logging for debugging

    return res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { 
  createPatient,
  getAllMothers

 };



