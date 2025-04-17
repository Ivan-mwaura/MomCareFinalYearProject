'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointment_records', {
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
      appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      appointmentTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      visitType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      attended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bloodPressure: {
        type: Sequelize.STRING,
        allowNull: true
      },
      heartRate: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      temperature: {
        type: Sequelize.STRING,
        allowNull: true
      },
      weight: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fundalHeight: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fetalHeartRate: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gestationalAge: {
        type: Sequelize.STRING,
        allowNull: true
      },
      physicalFindings: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      symptoms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      labResults: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      ultrasoundSummary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      prescribedMedications: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      interventions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      nextAppointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      careRecommendations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      adherenceNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      doctorsObservations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      patientConcerns: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('appointment_records');
  }
};
