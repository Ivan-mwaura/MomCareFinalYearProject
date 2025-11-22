const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Password reset routes
router.post('/request', passwordResetController.requestPasswordReset);
router.post('/verify', passwordResetController.verifyResetCode);
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;