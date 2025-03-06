const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');  // Import the sequelize instance from connect.js

// Define the User model
const User = sequelize.define('User', {
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
    unique: true,  // Ensure unique email addresses
    validate: {
      isEmail: true,  // Validate that the email format is correct
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,  // Phone is optional
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,  // Location is optional
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password is required
  },
}, {
  // Other options such as table name, timestamps
  tableName: 'chws',  // Table name where the data will be stored
  timestamps: true,     // Enable timestamps (createdAt & updatedAt)
});

module.exports = User;
