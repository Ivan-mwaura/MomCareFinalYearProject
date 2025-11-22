const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { protect } = require('../middlewares/authMiddleware'); // Optional: Protect this route

// POST /api/predictions: expects { motherId, riskLevel }
router.post('/', protect, predictionController.getRiskPrediction);

// GET /api/predictions/all: get all risk assessments
router.get('/all', protect, predictionController.getAllRiskAssessments);

module.exports = router;
