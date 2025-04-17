const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  alertId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'alerts',
      key: 'id'
    }
  },
  chwId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'chws',
      key: 'id'
    }
  },
  motherId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'mothers',
      key: 'id'
    }
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;
