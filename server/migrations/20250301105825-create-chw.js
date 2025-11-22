'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chws', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      county: {
        type: Sequelize.STRING,
        allowNull: false
      },
      constituency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ward: {
        type: Sequelize.STRING,
        allowNull: false
      },
      healthFocusArea: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rolesAndResponsibilities: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyContactRelation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      languagesSpoken: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      assignedPatients: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('chws');
  }
};
