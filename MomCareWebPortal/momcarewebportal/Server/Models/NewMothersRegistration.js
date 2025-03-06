// server/models/Patient.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');  // Import the sequelize instance from connect.js

const Patient = sequelize.define('Patient', {
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
    unique: true, // Ensure unique email addresses
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  county: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  constituency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ward: {
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
  chw: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,  // Use DATEONLY for date without time
    allowNull: false,
  },
  nationalId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Ensure unique National ID
  },
  emergencyContactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyContactRelation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,  // Use DATEONLY for date without time
    allowNull: false,
  }
}, {
  // Other options such as table name, timestamps
  tableName: 'registeredmothers',  // Optional, if you want to explicitly define the table name
  timestamps: true,      // Enable timestamps (createdAt & updatedAt)
});

module.exports = Patient;
