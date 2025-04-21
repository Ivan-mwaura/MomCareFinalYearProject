const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'chw', 'mother', 'doctor'),
    allowNull: false,
  },
  motherId: {
    type: DataTypes.UUID,
    allowNull: true  // Only set when role === 'mother'
  },
  fcmToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expoPushToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
