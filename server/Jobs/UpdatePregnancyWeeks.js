 const cron = require('node-cron');
const { Op } = require('sequelize');
const Mother = require('../models/Mother');
const HealthRecord = require('../models/HealthRecord');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { ancVisits, conditionAdjustments } = require('../config/visitSchedules');
const { sendAppointmentEmail } = require('../services/emailService');
const { sendAppointmentSMS } = require('../services/smsService');
const axios = require('axios');

// Constants
const fullTermWeeks = 40;
const bufferDays = 2;

// Extract the job logic into a callable function
async function updatePregnancyWeeksAndScheduleAppointments() {
  console.log('ANC Scheduler job triggered');
  try {
    const mothers = await Mother.findAll({
      where: { dueDate: { [Op.ne]: null } },
      include: [{ model: HealthRecord, as: 'healthRecords' }],
    });
    console.log(`Fetched ${mothers.length} mothers for scheduling`);

    await Promise.all(mothers.map(async (mother) => {
      console.log(`Processing mother: ${mother.firstName} ${mother.lastName} (ID: ${mother.id})`);

      const dueDate = new Date(mother.dueDate);
      const today = new Date();
      const remainingWeeks = Math.ceil((dueDate - today) / (7 * 24 * 60 * 60 * 1000));
      const currentWeeksPregnant = Math.min(fullTermWeeks, Math.max(0, fullTermWeeks - remainingWeeks));
      console.log(`Calculated weeksPregnant for ${mother.firstName} ${mother.lastName}: ${currentWeeksPregnant} (dueDate: ${dueDate.toISOString().split('T')[0]})`);

      // Update weeksPregnant
      if (currentWeeksPregnant !== mother.weeksPregnant) {
        await mother.update({ weeksPregnant: currentWeeksPregnant });
        console.log(`Updated ${mother.firstName} ${mother.lastName}'s weeksPregnant from ${mother.weeksPregnant} to ${currentWeeksPregnant}`);
      } else {
        console.log(`${mother.firstName} ${mother.lastName}'s weeksPregnant unchanged at ${currentWeeksPregnant}`);
      }

      // Skip if past 40 weeks
      if (currentWeeksPregnant >= fullTermWeeks) {
        console.log(`${mother.firstName} ${mother.lastName} has reached or exceeded 40 weeks; skipping ANC scheduling`);
        return;
      }

      const healthRecord = mother.healthRecords[0] || {};
      const conditionSummary = {
        hypertension: healthRecord.hypertension,
        diabetes: healthRecord.diabetes,
        thyroidDisorders: healthRecord.thyroidDisorders,
        obesity: healthRecord.obesity,
        hiv: healthRecord.hiv,
        syphilis: healthRecord.syphilis,
        malaria: healthRecord.malaria,
        uti: healthRecord.uti,
        depression: healthRecord.depression,
        anxiety: healthRecord.anxiety,
        stressLevel: healthRecord.stressLevel,
        previousComplications: healthRecord.previousComplications?.length > 0 ? healthRecord.previousComplications : null,
        parity: healthRecord.parity,
        gravidity: healthRecord.gravidity,
      };
      console.log(`Health conditions for ${mother.firstName} ${mother.lastName}: ${JSON.stringify(conditionSummary, null, 2)}`);

      const scheduledDates = {};

      // Schedule base ANC visits
      console.log(`Checking base ANC visits for ${mother.firstName} ${mother.lastName}`);
      for (const visit of ancVisits) {
        if (currentWeeksPregnant >= visit.thresholdWeeks) {
          console.log(`Evaluating ${visit.title} (threshold: ${visit.thresholdWeeks}) for ${mother.firstName} ${mother.lastName}`);
          const existingAppointment = await Appointment.findOne({
            where: { motherId: mother.id, type: visit.title },
          });
          if (!existingAppointment) {
            const appointmentDateObj = new Date(dueDate);
            const weeksToSubtract = fullTermWeeks - visit.thresholdWeeks;
            appointmentDateObj.setDate(appointmentDateObj.getDate() - (weeksToSubtract * 7) + bufferDays);
            const appointmentDate = appointmentDateObj.toISOString().split('T')[0];
            const appointmentTime = appointmentDateObj.toTimeString().split(' ')[0];
            scheduledDates[visit.title] = appointmentDateObj;

            let details = [...visit.details];
            for (const condition in conditionAdjustments) {
              const conditionValue = healthRecord[condition];
              if ((condition === 'parity' && conditionValue > 4) ||
                  (condition === 'gravidity' && conditionValue > 5) ||
                  (condition === 'depression' && conditionValue && parseInt(conditionValue) >= 2) ||
                  (condition === 'anxiety' && conditionValue && parseInt(conditionValue) >= 2) ||
                  (condition === 'stressLevel' && conditionValue && parseInt(conditionValue) >= 2) ||
                  (condition === 'previousComplications' && conditionValue?.length > 0) ||
                  (conditionValue === true && condition !== 'parity' && condition !== 'gravidity')) {
                if (conditionAdjustments[condition].enhancements[visit.title]) {
                  details = [...details, ...conditionAdjustments[condition].enhancements[visit.title]];
                  console.log(`Added enhancements for ${condition} to ${visit.title} for ${mother.firstName} ${mother.lastName}`);
                }
              }
            }

            // Create the appointment first
            const createdAppointment = await Appointment.create({
              provider: "Dr. Jane Doe",
              type: visit.title,
              date: appointmentDate,
              time: appointmentTime,
              location: "City Hospital",
              status: "Scheduled",
              description: details.join("; "),
              motherId: mother.id,
              chwId: mother.chwId,
            });
            console.log(`Scheduled ${visit.title} for ${mother.firstName} ${mother.lastName} on ${appointmentDate}`);

            // Send email notification
            if (mother.email) {
              try {
                await sendAppointmentEmail(mother.email, {
                  date: appointmentDate,
                  time: appointmentTime,
                  location: "City Hospital",
                  provider: "Dr. Jane Doe",
                  type: visit.title
                });
                console.log(`Email notification sent for ${visit.title} to ${mother.email}`);
              } catch (emailError) {
                console.error(`Error sending email notification for ${visit.title} to ${mother.email}:`, emailError);
              }
            }

            // Send SMS notification
            if (mother.phone) {
              try {
                await sendAppointmentSMS(mother.phone, {
                  date: appointmentDate,
                  time: appointmentTime,
                  location: "City Hospital",
                  provider: "Dr. Jane Doe",
                  type: visit.title
                });
                console.log(`SMS notification sent for ${visit.title} to ${mother.phone}`);
              } catch (smsError) {
                console.error(`Error sending SMS notification for ${visit.title} to ${mother.phone}:`, smsError);
              }
            }

            await Notification.create({
              message: `Appointment for ${mother.firstName} ${mother.lastName}'s "${visit.title}" on ${appointmentDate}`,
              date: appointmentDateObj,
              motherId: mother.id,
              chwId: mother.chwId,
            });

            // Send push notification if mother has an Expo push token
            if (mother.expoPushToken) {
              try {
                const message = {
                  to: mother.expoPushToken,
                  sound: 'default',
                  title: 'New Appointment Scheduled',
                  body: `Your "${visit.title}" is scheduled for ${appointmentDate}`,
                  data: {
                    type: 'appointment',
                    appointmentId: createdAppointment.id,
                  },
                };

                await axios.post('https://exp.host/--/api/v2/push/send', message);
                console.log(`Push notification sent for ${visit.title} to ${mother.firstName} ${mother.lastName}`);
              } catch (error) {
                console.error(`Error sending push notification for ${visit.title} to ${mother.firstName} ${mother.lastName}:`, error);
              }
            }

            console.log(`Created notification for ${visit.title} on ${appointmentDate} for ${mother.firstName} ${mother.lastName}`);
          } else {
            console.log(`${visit.title} already scheduled for ${mother.firstName} ${mother.lastName}`);
          }
        }
      }

      // Schedule supplemental visits
      console.log(`Checking supplemental visits for ${mother.firstName} ${mother.lastName}`);
      for (const condition in conditionAdjustments) {
        const conditionValue = healthRecord[condition];
        if ((condition === 'parity' && conditionValue > 4) ||
            (condition === 'gravidity' && conditionValue > 5) ||
            (condition === 'depression' && conditionValue && parseInt(conditionValue) >= 2) ||
            (condition === 'anxiety' && conditionValue && parseInt(conditionValue) >= 2) ||
            (condition === 'stressLevel' && conditionValue && parseInt(conditionValue) >= 2) ||
            (condition === 'previousComplications' && conditionValue?.length > 0) ||
            (conditionValue === true && condition !== 'parity' && condition !== 'gravidity')) {
          console.log(`Processing condition: ${condition} for ${mother.firstName} ${mother.lastName}`);
          const { supplementalVisits } = conditionAdjustments[condition];
          for (const visit of supplementalVisits) {
            const baseVisitDate = scheduledDates[visit.relativeTo];
            if (baseVisitDate) {
              const baseWeeks = ancVisits.find(v => v.title === visit.relativeTo).thresholdWeeks;
              let weeks = baseWeeks + visit.offsetWeeks;
              console.log(`Scheduling ${visit.title} (${condition}) starting at ${weeks} weeks for ${mother.firstName} ${mother.lastName}`);
              while (weeks <= fullTermWeeks) {
                if (currentWeeksPregnant >= weeks) {
                  const existingAppointment = await Appointment.findOne({
                    where: { motherId: mother.id, type: `${visit.title} (${condition})` },
                  });
                  if (!existingAppointment) {
                    const appointmentDateObj = new Date(dueDate);
                    appointmentDateObj.setDate(appointmentDateObj.getDate() - ((fullTermWeeks - weeks) * 7) + bufferDays);
                    const appointmentDate = appointmentDateObj.toISOString().split('T')[0];
                    const appointmentTime = appointmentDateObj.toTimeString().split(' ')[0];

                    const overlappingVisit = Object.values(scheduledDates).find(date =>
                      date.toISOString().split('T')[0] === appointmentDate
                    );
                    if (overlappingVisit) {
                      console.log(`Skipping ${visit.title} (${condition}) on ${appointmentDate} due to overlap with existing visit`);
                      weeks += parseInt(visit.frequency?.match(/\d+/) || 0) || fullTermWeeks;
                      continue;
                    }

                    // For supplemental visits
                    const createdSupplementalAppointment = await Appointment.create({
                      provider: "Dr. Jane Doe",
                      type: `${visit.title} (${condition})`,
                      date: appointmentDate,
                      time: appointmentTime,
                      location: "City Hospital",
                      status: "Scheduled",
                      description: visit.details.join("; "),
                      motherId: mother.id,
                      chwId: mother.chwId,
                    });
                    console.log(`Scheduled ${visit.title} (${condition}) for ${mother.firstName} ${mother.lastName} on ${appointmentDate}`);

                    // Send email notification for supplemental visits
                    if (mother.email) {
                      try {
                        await sendAppointmentEmail(mother.email, {
                          date: appointmentDate,
                          time: appointmentTime,
                          location: "City Hospital",
                          provider: "Dr. Jane Doe",
                          type: `${visit.title} (${condition})`
                        });
                        console.log(`Email notification sent for ${visit.title} (${condition}) to ${mother.email}`);
                      } catch (emailError) {
                        console.error(`Error sending email notification for ${visit.title} (${condition}) to ${mother.email}:`, emailError);
                      }
                    }

                    // Send SMS notification for supplemental visits
                    if (mother.phone) {
                      try {
                        await sendAppointmentSMS(mother.phone, {
                          date: appointmentDate,
                          time: appointmentTime,
                          location: "City Hospital",
                          provider: "Dr. Jane Doe",
                          type: `${visit.title} (${condition})`
                        });
                        console.log(`SMS notification sent for ${visit.title} (${condition}) to ${mother.phone}`);
                      } catch (smsError) {
                        console.error(`Error sending SMS notification for ${visit.title} (${condition}) to ${mother.phone}:`, smsError);
                      }
                    }

                    await Notification.create({
                      message: `Appointment for ${mother.firstName} ${mother.lastName}'s "${visit.title} (${condition})" on ${appointmentDate}`,
                      date: appointmentDateObj,
                      motherId: mother.id,
                      chwId: mother.chwId,
                    });

                    // Send push notification if mother has an Expo push token
                    if (mother.expoPushToken) {
                      try {
                        const message = {
                          to: mother.expoPushToken,
                          sound: 'default',
                          title: 'New Appointment Scheduled',
                          body: `Your "${visit.title} (${condition})" is scheduled for ${appointmentDate}`,
                          data: {
                            type: 'appointment',
                            appointmentId: createdSupplementalAppointment.id,
                          },
                        };

                        await axios.post('https://exp.host/--/api/v2/push/send', message);
                        console.log(`Push notification sent for ${visit.title} (${condition}) to ${mother.firstName} ${mother.lastName}`);
                      } catch (error) {
                        console.error(`Error sending push notification for ${visit.title} (${condition}) to ${mother.firstName} ${mother.lastName}:`, error);
                      }
                    }

                    console.log(`Created notification for ${visit.title} (${condition}) on ${appointmentDate} for ${mother.firstName} ${mother.lastName}`);
                  } else {
                    console.log(`${visit.title} (${condition}) already scheduled for ${mother.firstName} ${mother.lastName}`);
                  }
                }
                const frequencyWeeks = parseInt(visit.frequency?.match(/\d+/) || 0);
                weeks += frequencyWeeks || fullTermWeeks;
              }
            } else {
              console.log(`Base visit ${visit.relativeTo} not scheduled yet for ${visit.title} (${condition})`);
            }
          }
        }
      }
      console.log(`Completed processing for ${mother.firstName} ${mother.lastName}`);
    }));
    
    return { 
      success: true, 
      message: `Processed ${mothers.length} mothers successfully` 
    };
  } catch (error) {
    console.error('Error in ANC Scheduler job:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Keep the cron job but make it call the function
cron.schedule('0 03 10 * * *', async () => {
  await updatePregnancyWeeksAndScheduleAppointments();
});

// Export the function so it can be called from elsewhere
module.exports = {
  updatePregnancyWeeksAndScheduleAppointments
};