const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  motherId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  hypertension: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  diabetes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  thyroidDisorders: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  obesity: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  hiv: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  syphilis: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  malaria: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  uti: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  depression: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anxiety: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stressLevel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  previousComplications: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  parity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gravidity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'health_records',
  timestamps: true,
});

module.exports = HealthRecord;
