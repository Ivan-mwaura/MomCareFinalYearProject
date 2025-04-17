const express = require('express');
const router = express.Router();
const appointmentRecordController = require('../controllers/appointmentRecordController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, appointmentRecordController.createAppointmentRecord);
router.get('/mother/:motherId',  protect, appointmentRecordController.getAppointmentRecordsByMotherId);
router.put('/:id',  protect, appointmentRecordController.updateAppointmentRecordById);
router.delete('/:id',  protect, appointmentRecordController.deleteAppointmentRecordById);

module.exports = router;
