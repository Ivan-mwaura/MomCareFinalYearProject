'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure the uuid-ossp extension is enabled (for PostgreSQL)
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('risk_assessments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
        allowNull: false
      },
      motherId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'mothers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      riskLevel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      motherName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pregnancyStage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      weeksPregnant: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // Store the assigned CHW details as JSON. This can include firstName, lastName, email, and phone.
      assignedCHW: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('risk_assessments');
  }
};
