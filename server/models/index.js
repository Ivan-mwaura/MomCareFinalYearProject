const User = require('./User');
const CHW = require('./CHW');
const Mother = require('./Mother');
const Appointment = require('./Appointment'); // Existing
const AppointmentRecord = require('./AppointmentRecord'); // New
const Alert = require('./Alert');
const Notification = require('./Notification');
const HealthRecord = require('./HealthRecord'); // New
const Feedback = require('./Feedback');
const HealthTip = require('./HealthTip');
const RiskAssessment = require('./RiskAssessment');
const PushToken = require('./PushToken');
const Doctor = require('./Doctor');

// Create models object
const models = {
  User,
  CHW,
  Mother,
  Appointment, // Existing
  AppointmentRecord, // New
  Alert,
  Notification,
  HealthRecord, // New
  Feedback,
  HealthTip,
  RiskAssessment,
  PushToken,
  Doctor,
};

// Import and run associations using the models object
const defineAssociations = require('./associations');
defineAssociations(models);

module.exports = models;
