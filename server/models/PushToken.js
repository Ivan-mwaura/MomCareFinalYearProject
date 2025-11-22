// models/PushToken.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect'); // adjust path as needed

const PushToken = sequelize.define('PushToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'push_tokens',
  timestamps: true, // createdAt will be auto-generated
  updatedAt: false, // You might not need an updatedAt column
});

module.exports = PushToken;
