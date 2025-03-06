const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  motherId: { type: DataTypes.UUID, allowNull: false },
  feedback: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'feedback',
  timestamps: true,
});

module.exports = Feedback;
