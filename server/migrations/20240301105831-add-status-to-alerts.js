'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('alerts', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'PENDING'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('alerts', 'status');
  }
}; 