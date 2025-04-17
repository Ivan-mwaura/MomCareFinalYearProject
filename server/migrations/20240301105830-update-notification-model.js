'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notifications', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('notifications', 'type', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('notifications', 'status', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('notifications', 'location', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('notifications', 'alertId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'alerts',
        key: 'id'
      }
    });
    await queryInterface.addColumn('notifications', 'chwId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'chws',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'title');
    await queryInterface.removeColumn('notifications', 'type');
    await queryInterface.removeColumn('notifications', 'status');
    await queryInterface.removeColumn('notifications', 'location');
    await queryInterface.removeColumn('notifications', 'alertId');
    await queryInterface.removeColumn('notifications', 'chwId');
  }
}; 