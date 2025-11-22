const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const RiskAssessment = sequelize.define('RiskAssessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  motherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  riskLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pregnancyStage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weeksPregnant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // We'll store the assigned CHW details as JSON.
  assignedCHW: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  tableName: 'risk_assessments',
  timestamps: true,
});

module.exports = RiskAssessment;
