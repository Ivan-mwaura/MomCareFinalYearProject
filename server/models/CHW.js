const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const CHW = sequelize.define('CHW', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  county: { type: DataTypes.STRING, allowNull: false },
  constituency: { type: DataTypes.STRING, allowNull: false },
  ward: { type: DataTypes.STRING, allowNull: false },
  healthFocusArea: { type: DataTypes.STRING, allowNull: true },
  rolesAndResponsibilities: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, allowNull: false },
  emergencyContactName: { type: DataTypes.STRING, allowNull: true },
  emergencyContactPhone: { type: DataTypes.STRING, allowNull: true },
  emergencyContactRelation: { type: DataTypes.STRING, allowNull: true },
  languagesSpoken: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  assignedPatients: { type: DataTypes.STRING, allowNull:true, defaultValue: 0 }
}, {
  tableName: 'chws',
  timestamps: true,
});

module.exports = CHW;
