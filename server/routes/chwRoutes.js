const express = require('express');
const router = express.Router();
const chwController = require('../controllers/chwController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', protect, authorize('admin'), chwController.registerCHW);
router.get('/', protect, chwController.getCHWs);
router.get('/:id', protect, chwController.getCHWById);
router.put('/:id', protect, chwController.updateCHW);
router.delete('/:id', protect, authorize('admin'), chwController.deleteCHW);

module.exports = router;
