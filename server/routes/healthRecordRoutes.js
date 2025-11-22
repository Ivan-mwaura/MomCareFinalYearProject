const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, healthRecordController.createHealthRecord);
router.get('/:id', protect, healthRecordController.getHealthRecordById);
router.get('/mother/:motherId', protect, healthRecordController.getHealthRecordsByMotherId);
router.put('/:id', protect, healthRecordController.updateHealthRecord);


module.exports = router;
