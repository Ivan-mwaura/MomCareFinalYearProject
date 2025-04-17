// Import models individually
const { Mother, CHW } = require('../models');

const Appointment = require('./Appointment'); // Existing
const AppointmentRecord = require('./AppointmentRecord'); // New
const Alert = require('./Alert');
const HealthRecord = require('./HealthRecord'); // New
const Feedback = require('./Feedback');
const User = require('./User');
const RiskAssessment = require('./RiskAssessment');
const PushToken = require('./PushToken');
const Doctor = require('./Doctor');
const Notification = require('./Notification');

const defineAssociations = (models) => {
  // CHW and Mother
  models.CHW.hasMany(models.Mother, { foreignKey: 'chwId', as: 'mothers' });
  models.Mother.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

  // Mother and Appointment (Existing)
  models.Mother.hasMany(models.Appointment, { foreignKey: 'motherId', as: 'appointments' });
  models.Appointment.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // CHW and Appointment (Existing)
  models.CHW.hasMany(models.Appointment, { foreignKey: 'chwId', as: 'appointments' });
  models.Appointment.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

  // Mother and HealthRecord (New)
  models.Mother.hasMany(models.HealthRecord, { foreignKey: 'motherId', as: 'healthRecords' });
  models.HealthRecord.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // Mother and AppointmentRecord (New)
  models.Mother.hasMany(models.AppointmentRecord, { foreignKey: 'motherId', as: 'appointmentRecords' });
  models.AppointmentRecord.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // CHW and AppointmentRecord (New)
  models.CHW.hasMany(models.AppointmentRecord, { foreignKey: 'chwId', as: 'appointmentRecords' });
  models.AppointmentRecord.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

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

  // Mother and PushToken (one-to-many)
  models.Mother.hasMany(models.PushToken, { foreignKey: 'motherId', as: 'pushTokens' });
  models.PushToken.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // Mother and Notification
  models.Mother.hasMany(models.Notification, { foreignKey: 'motherId', as: 'notifications' });
  models.Notification.belongsTo(models.Mother, { foreignKey: 'motherId', as: 'mother' });

  // CHW and Notification
  models.CHW.hasMany(models.Notification, { foreignKey: 'chwId', as: 'notifications' });
  models.Notification.belongsTo(models.CHW, { foreignKey: 'chwId', as: 'chw' });

  // Alert and Notification
  models.Alert.hasMany(models.Notification, { foreignKey: 'alertId', as: 'notifications' });
  models.Notification.belongsTo(models.Alert, { foreignKey: 'alertId', as: 'alert' });

  //models.Doctor.hasMany(models.AppointmentRecord, { foreignKey: 'doctorId', as: 'appointments' });
  //models.AppointmentRecord.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
};

module.exports = defineAssociations;
