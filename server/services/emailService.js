const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'evanjustin31@gmail.com',
    pass: 'tvhw frrn nuwd gtsi'
  }
});

const sendAppointmentEmail = async (motherEmail, appointmentDetails) => {
  try {
    const mailOptions = {
      from: 'evanjustin31@gmail.com',
      to: motherEmail,
      subject: 'Appointment Scheduled - MomCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Appointment Scheduled</h2>
          <p>Dear Mother,</p>
          <p>We are pleased to inform you that an appointment has been scheduled for you with the following details:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Location:</strong> ${appointmentDetails.location}</p>
            <p><strong>Provider:</strong> ${appointmentDetails.provider}</p>
            <p><strong>Type:</strong> ${appointmentDetails.type}</p>
          </div>

          <p>Please make sure to arrive 15 minutes before your scheduled time.</p>
          <p>If you need to reschedule or cancel this appointment, please contact us at least 24 hours in advance.</p>
          
          <p>Best regards,<br>MomCare Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const mailOptions = {
      from: 'evanjustin31@gmail.com',
      to: email,
      subject: 'Password Reset - MomCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Password Reset Request</h2>
          <p>Dear Mother,</p>
          <p>We received a request to reset your password for your MomCare account. Here is your reset code:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <h1 style="color: #4a90e2; margin: 0;">${resetCode}</h1>
          </div>

          <p>This code will expire in 15 minutes.</p>
          <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
          
          <p>Best regards,<br>MomCare Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ', info.response);
    return true;
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw error;
  }
};

module.exports = {
  sendAppointmentEmail,
  sendPasswordResetEmail
}; 