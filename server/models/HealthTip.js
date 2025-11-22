const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const HealthTip = sequelize.define('HealthTip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  text: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }
}, {
  tableName: 'healthtips',
  timestamps: true,
});

module.exports = HealthTip;
