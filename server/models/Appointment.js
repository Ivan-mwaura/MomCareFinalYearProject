const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  provider: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  // Foreign keys: motherId and chwId (set via associations)
  motherId: { type: DataTypes.UUID, allowNull: false },
  chwId: { type: DataTypes.UUID, allowNull: false }
}, {
  tableName: 'appointments',
  timestamps: true,
});

module.exports = Appointment;
