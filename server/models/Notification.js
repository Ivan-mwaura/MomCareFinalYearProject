const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  message: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
