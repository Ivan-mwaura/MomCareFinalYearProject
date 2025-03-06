const express = require('express');
const router = express.Router();
const motherController = require('../controllers/motherController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', protect, motherController.registerMother);
router.get('/', protect, motherController.getMothers);
router.get('/:id', protect, motherController.getMotherById);
router.put('/:id', protect, motherController.updateMother);
router.delete('/:id', protect, motherController.deleteMother);

module.exports = router;
