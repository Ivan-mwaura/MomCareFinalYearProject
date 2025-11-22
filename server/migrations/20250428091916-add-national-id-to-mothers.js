'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First add the column as nullable
    await queryInterface.addColumn('mothers', 'nationalId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Update existing records with a default value (using email as a temporary nationalId)
    await queryInterface.sequelize.query(`
      UPDATE mothers 
      SET "nationalId" = CONCAT('TEMP_', id)
      WHERE "nationalId" IS NULL
    `);

    // Now make it non-nullable
    await queryInterface.changeColumn('mothers', 'nationalId', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('mothers', 'nationalId');
  }
};
