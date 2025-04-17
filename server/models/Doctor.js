const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  yearsOfExperience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'doctors',
  timestamps: true,
});

module.exports = Doctor;
