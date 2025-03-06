const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  motherId: { type: DataTypes.UUID, allowNull: false },
  visitSummary: { type: DataTypes.TEXT, allowNull: true },
  labResults: { type: DataTypes.TEXT, allowNull: true },
  riskAssessments: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'healthrecords',
  timestamps: true,
});

module.exports = HealthRecord;
