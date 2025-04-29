const { Mother } = require('../models');
const PasswordReset = require('../models/PasswordReset');
const { sendPasswordResetEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find mother by email
    const mother = await Mother.findOne({ where: { email } });
    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    // Generate reset code
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    // Save reset code
    await PasswordReset.create({
      userId: mother.id,
      resetCode,
      expiresAt
    });

    // Send email with reset code
    await sendPasswordResetEmail(email, resetCode);

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email"
    });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message
    });
  }
};

// Verify reset code
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    // Find mother by email
    const mother = await Mother.findOne({ where: { email } });
    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    // Find valid reset code
    const reset = await PasswordReset.findOne({
      where: {
        userId: mother.id,
        resetCode,
        used: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!reset) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset code verified successfully"
    });
  } catch (error) {
    console.error("Error in verifyResetCode:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify reset code",
      error: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Find mother by email
    const mother = await Mother.findOne({ where: { email } });
    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address"
      });
    }

    // Find valid reset code
    const reset = await PasswordReset.findOne({
      where: {
        userId: mother.id,
        resetCode,
        used: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!reset) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await mother.update({ password: hashedPassword });

    // Mark reset code as used
    await reset.update({ used: true });

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message
    });
  }
}; 