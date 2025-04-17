const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware'); // if only admins can create/update doctors
const doctorController = require('../controllers/doctorController');

router.post('/', protect, authorize('admin'), doctorController.createDoctor);
router.get('/', protect, doctorController.getAllDoctors);
router.get('/:id', protect, doctorController.getDoctorById);
router.put('/:id', protect, authorize('admin'), doctorController.updateDoctor);
router.delete('/:id', protect, authorize('admin'), doctorController.deleteDoctor);

module.exports = router;
