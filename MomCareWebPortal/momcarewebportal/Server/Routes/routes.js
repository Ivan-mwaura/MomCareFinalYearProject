const express = require('express');
const router = express.Router();


const { 
    createPatient,
    getAllMothers,
    
 } = require('../Controllers/PatientManagement/NewMothersRegistration');
 const {
    RegisterChw,
    getAllChws,
 } = require('../Controllers/Chwmanagement/ChwManagement');

//Post Routes

router.post('/new-mothers-registration', createPatient);
router.post('/register-chw', RegisterChw);
//


//Get routes
router.get('/getAllMothers', getAllMothers);
router.get('/getAllChws', getAllChws);



module.exports = router;