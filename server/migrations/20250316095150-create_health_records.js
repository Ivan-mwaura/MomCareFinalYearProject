'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('health_records', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      hypertension: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      diabetes: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      thyroidDisorders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      obesity: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      hiv: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      syphilis: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      malaria: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      uti: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      depression: {
        type: Sequelize.STRING,
        allowNull: true
      },
      anxiety: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stressLevel: {
        type: Sequelize.STRING,
        allowNull: true
      },
      previousComplications: {
        type: Sequelize.JSON,
        allowNull: true
      },
      parity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      gravidity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('health_records');
  }
};
