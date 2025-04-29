const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, appointmentController.createAppointment);
router.get('/', protect, appointmentController.getAppointments);
router.get('/mother/:motherId', protect, appointmentController.getAppointmentsByMotherId);
router.get('/:id', protect, appointmentController.getAppointmentById);
router.put('/:id', protect, appointmentController.updateAppointment);
router.delete('/:id', protect, appointmentController.deleteAppointment);
router.put('/:appointmentId/status', protect, appointmentController.updateAppointmentStatus);

module.exports = router;
