// Import models individually
const { Mother, CHW } = require('../models');

const Appointment = require('./Appointment');
const Alert = require('./Alert');
const HealthRecord = require('./HealthRecord');
const Feedback = require('./Feedback');
const User = require('./User');
const RiskAssessment = require('./RiskAssessment');

// server/models/associations.js
const defineAssociations = (models) => {
  // CHW and Mother
  models.CHW.hasMany(models.Mother, { foreignKey: 'chwId', as: 'mothers' });
  models.Mother.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

  // Mother and Appointment
  models.Mother.hasMany(models.Appointment, { foreignKey: 'motherId', as: 'appointments' });
  models.Appointment.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // CHW and Appointment
  models.CHW.hasMany(models.Appointment, { foreignKey: 'chwId', as: 'appointments' });
  models.Appointment.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

  // Mother and HealthRecord
  models.Mother.hasMany(models.HealthRecord, { foreignKey: 'motherId', as: 'healthRecords' });
  models.HealthRecord.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // Mother and Feedback
  models.Mother.hasMany(models.Feedback, { foreignKey: 'motherId', as: 'feedbacks' });
  models.Feedback.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // Mother and Alert
  models.Mother.hasMany(models.Alert, { foreignKey: 'patientId', as: 'alerts' });
  models.Alert.belongsTo(models.Mother, { foreignKey: 'patientId', as: 'mother' });

  // ONE-TO-ONE: A Mother has one User account (for login)
  models.Mother.hasOne(models.User, { foreignKey: 'motherId', as: 'account' });
  models.User.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'motherAccount' });

  // ONE-TO-MANY: A Mother has many RiskAssessment records (for predictions)
  models.Mother.hasMany(models.RiskAssessment, { foreignKey: 'motherId', as: 'riskAssessmentsRecords' });
  models.RiskAssessment.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  //console.log('Mother associations:', models.Mother.associations);
};

module.exports = defineAssociations;
