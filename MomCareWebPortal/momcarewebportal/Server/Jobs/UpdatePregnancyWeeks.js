const cron = require('node-cron');
const { Op } = require('sequelize');
const Patient = require('../Models/NewMothersRegistration');

// Cron job to update weeksPregnant at midnight daily
cron.schedule('0 0 * * *', async () => {  // This runs every day at midnight (12:00 AM)
    // This runs every day at midnight (12:00 AM)
  console.log('Cron job triggered at 12:00 PM');  // Debugging log to check if the cron job triggers
  try {
    // Get all registered mothers
    const mothers = await Patient.findAll({
      where: {
        createdAt: { [Op.ne]: null },
      },
    });

    console.log(`Found ${mothers.length} mothers to update.`);  // Debugging log

    // Loop through each mother and update her weeksPregnant
    for (let mother of mothers) {
      const registrationDate = new Date(mother.createdAt);
      const today = new Date();

      // Debugging log: Print both dates for verification
      console.log(`Registration Date for ${mother.firstName} ${mother.lastName}: ${registrationDate}`);
      console.log(`Today's Date: ${today}`);

      // Calculate the number of days since registration
      const timeDifference = today - registrationDate;
      const daysPregnant = Math.floor(timeDifference / (1000 * 60 * 60 * 24));  // Convert ms to days
      const weeksPregnant = Math.floor(daysPregnant / 7);  // Convert days to weeks

      console.log(`Calculated Days Pregnant: ${daysPregnant}`);
      console.log(`Calculated Weeks Pregnant: ${weeksPregnant}`);

      // Only update if the weeksPregnant is greater than 0
      if (weeksPregnant > 0) {
        await mother.update({
          weeksPregnant,
        });

        console.log(`Updated weeksPregnant for ${mother.firstName} ${mother.lastName}: ${weeksPregnant} weeks`);
      } else {
        console.log(`Skipping update for ${mother.firstName} ${mother.lastName}: Weeks Pregnant is 0`);
      }
    }
  } catch (error) {
    console.error('Error updating weeksPregnant:', error.message);  // Error log
  }
});
