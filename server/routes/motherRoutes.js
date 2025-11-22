const express = require('express');
const router = express.Router();
const motherController = require('../controllers/motherController');
const { protect } = require('../middlewares/authMiddleware');

// Search and list routes
router.get('/search', protect, motherController.searchMothers);
router.get('/', protect, motherController.getMothers);

// Expo push token routes
router.post('/update-expo-token', protect, motherController.updateExpoPushToken);
router.get('/verify-expo-token', protect, motherController.verifyExpoToken);

// Registration route
router.post('/register', protect, motherController.registerMother);

// ID-specific routes
router.get('/:id', protect, motherController.getMotherById);
router.put('/:id', protect, motherController.updateMother);
router.delete('/:id', protect, motherController.deleteMother);

module.exports = router;
