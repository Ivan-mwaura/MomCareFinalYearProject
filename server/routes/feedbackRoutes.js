const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, feedbackController.submitFeedback);
router.get('/', protect, feedbackController.getFeedback);

module.exports = router;
