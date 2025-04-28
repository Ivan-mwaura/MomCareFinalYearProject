const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Mother = sequelize.define('Mother', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: { isEmail: true }
  },
  phone: { type: DataTypes.STRING, allowNull: true },
  nationalId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [5, 20] // National ID should be between 5 and 20 characters
    }
  },
  county: { type: DataTypes.STRING, allowNull: false },
  constituency: { type: DataTypes.STRING, allowNull: false },
  ward: { type: DataTypes.STRING, allowNull: false },
  pregnancyStage: { type: DataTypes.STRING, allowNull: false },
  weeksPregnant: { type: DataTypes.INTEGER, allowNull: false },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  // Foreign key for CHW set via associations (chwId)
  chwId: { type: DataTypes.UUID, allowNull: true },
  expoPushToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'mothers',
  timestamps: true,
});

module.exports = Mother;
