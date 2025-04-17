const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDING' },
  patientId: { type: DataTypes.UUID, allowNull: false }, // References Mother
  patientName: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: 'alerts',
  timestamps: true,
});

module.exports = Alert;
