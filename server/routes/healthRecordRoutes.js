const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, healthRecordController.createHealthRecord);
router.get('/', protect, healthRecordController.getHealthRecords);
router.get('/:id', protect, healthRecordController.getHealthRecordById);
router.put('/:id', protect, healthRecordController.updateHealthRecord);

module.exports = router;
