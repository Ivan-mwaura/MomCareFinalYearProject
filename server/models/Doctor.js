const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const bcrypt = require('bcryptjs');

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
  hooks: {
    beforeCreate: async (doctor) => {
      if (doctor.password) {
        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(doctor.password, salt);
      }
    },
    beforeUpdate: async (doctor) => {
      if (doctor.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(doctor.password, salt);
      }
    }
  }
});

module.exports = Doctor;
