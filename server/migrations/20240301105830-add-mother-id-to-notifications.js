'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notifications', 'motherId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'mothers',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'motherId');
  }
}; 