'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Define the enum name as used in PostgreSQL (this might differ based on initial creation)
    const enumName = 'enum_users_role'; 

    // SQL to add the new value to the enum type
    await queryInterface.sequelize.query(`ALTER TYPE ${enumName} ADD VALUE IF NOT EXISTS 'doctor';`);
  },

  async down (queryInterface, Sequelize) {
    // Reverting this change requires recreating the enum without the 'doctor' value,
    // which is complex and potentially data-destructive if doctors have been created.
    // A safer approach is to simply not remove the value on rollback,
    // or handle it manually if absolutely necessary.
    // For now, we'll leave the down migration empty or log a message.
    console.log(`Reverting the addition of 'doctor' to ${enumName} is not automatically supported. Manual intervention might be needed.`);
    // Or simply: return Promise.resolve();
  }
};
