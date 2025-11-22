module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('appointment_records', 'chwId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('appointment_records', 'chwId');
  }
};
