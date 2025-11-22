const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const AppointmentRecord = sequelize.define('AppointmentRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  motherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  chwId: {  // Ensure this column exists
    type: DataTypes.UUID,
    allowNull: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  visitType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bloodPressure: {
    type: DataTypes.STRING,
    allowNull: true
  },
  heartRate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  temperature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fundalHeight: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fetalHeartRate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gestationalAge: {
    type: DataTypes.STRING,
    allowNull: true
  },
  physicalFindings: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  labResults: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ultrasoundSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescribedMedications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interventions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nextAppointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  careRecommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adherenceNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  doctorsObservations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientConcerns: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointment_records',
  timestamps: true,
});

module.exports = AppointmentRecord;
