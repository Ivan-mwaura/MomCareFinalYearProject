const AfricasTalking = require('africastalking');

// Initialize Africas Talking SDK
const africastalking = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: 'sandbox' // Use 'sandbox' for testing
});

const sendSMS = async (phoneNumber, message) => {
  try {
    // Format phone number to include country code if not present
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Send SMS using Africas Talking SDK
    const response = await africastalking.SMS.send({
      to: [formattedNumber],
      message: message,
      from: 'MOMCARE' // Optional sender ID
    });

    console.log('SMS sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw error;
  }
};

// Additional function for sending appointment SMS with formatted message
const sendAppointmentSMS = async (phoneNumber, appointmentDetails) => {
  const message = `Appointment Reminder - MomCare\n
Date: ${appointmentDetails.date}
Time: ${appointmentDetails.time}
Location: ${appointmentDetails.location}
Provider: ${appointmentDetails.provider}
Type: ${appointmentDetails.type}

Please arrive 15 minutes before your scheduled time.`;

  return sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendAppointmentSMS
};