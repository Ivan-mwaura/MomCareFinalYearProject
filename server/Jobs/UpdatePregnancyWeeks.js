const cron = require('node-cron');
const { Op } = require('sequelize');
const Mother = require('../models/Mother');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { ancVisits } = require('../config/visitSchedules');

// Constants for full term and scheduling buffer
const fullTermWeeks = 40;
const bufferDays = 2;

// Cron job to schedule ANC appointments daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('ANC Scheduler cron job triggered at 12:00 AM');
  try {
    // Fetch all mothers with a valid dueDate
    const mothers = await Mother.findAll({
      where: { dueDate: { [Op.ne]: null } }
    });
    console.log(`Found ${mothers.length} mothers to process.`);

    await Promise.all(mothers.map(async (mother) => {
      const dueDate = new Date(mother.dueDate);
      const today = new Date();

      // Calculate remaining weeks until due date
      const remainingWeeks = Math.ceil((dueDate - today) / (7 * 24 * 60 * 60 * 1000));
      // Calculate current gestational age (weeks pregnant)
      const currentWeeksPregnant = fullTermWeeks - remainingWeeks;
      console.log(`${mother.firstName} ${mother.lastName} is currently ${currentWeeksPregnant} weeks pregnant.`);

      // Iterate through each ANC visit defined in our schedule
      for (const visit of ancVisits) {
        if (currentWeeksPregnant >= visit.thresholdWeeks) {
          // Check if an appointment for this visit already exists for this mother
          const existingAppointment = await Appointment.findOne({
            where: {
              motherId: mother.id,
              type: visit.title
            }
          });

          if (!existingAppointment) {
            // Calculate the scheduled appointment date:
            // Appointment Date = dueDate - ((fullTermWeeks - thresholdWeeks) * 7 days) + bufferDays
            const weeksToSubtract = fullTermWeeks - visit.thresholdWeeks;
            let appointmentDateObj = new Date(dueDate);
            appointmentDateObj.setDate(appointmentDateObj.getDate() - (weeksToSubtract * 7));
            appointmentDateObj.setDate(appointmentDateObj.getDate() + bufferDays);

            // Format the appointment date and time
            const appointmentDate = appointmentDateObj.toISOString().split('T')[0];
            const appointmentTime = appointmentDateObj.toTimeString().split(' ')[0];

            console.log(`Scheduling "${visit.title}" for ${mother.firstName} ${mother.lastName} on ${appointmentDate}`);

            // Create the Appointment record with required fields (using test defaults where necessary)
            const newAppointment = await Appointment.create({
              provider: "Dr. Jane Doe",            // Replace with real provider data if available.
              type: visit.title,                     // e.g., "1st ANC Visit – Booking Visit (Before 12 Weeks)"
              date: appointmentDate,                 // Formatted as YYYY-MM-DD
              time: appointmentTime,                 // Formatted as HH:MM:SS
              location: "City Hospital",             // Replace with actual location if needed.
              status: "Scheduled",                   // Default status for new appointments.
              description: visit.details.join("; "), // Combine details for description.
              motherId: mother.id,
              chwId: mother.chwId                    // Assumes mother record has an assigned CHW.
            });
            console.log(`Created Appointment with ID: ${newAppointment.id}`);

            // Create a Notification record that informs both the mother and her CHW.
            const notificationMessage = `Appointment Notification: An appointment for ${mother.firstName} ${mother.lastName}'s "${visit.title}" is scheduled on ${appointmentDate}. Please ensure all preparations are made.`;
            await Notification.create({
              motherId: mother.id,
              chwId: mother.chwId,
              message: notificationMessage,
              date: appointmentDateObj
            });
            console.log(`Notification created: ${notificationMessage}`);
          } else {
            console.log(`Appointment "${visit.title}" already exists for ${mother.firstName} ${mother.lastName}`);
          }
        } else {
          console.log(`${mother.firstName} ${mother.lastName} has not reached the threshold for "${visit.title}" (${visit.thresholdWeeks} weeks) yet.`);
        }
      }
    }));
  } catch (error) {
    console.error('Error in ANC Scheduler cron job:', error.message);
  }
});
