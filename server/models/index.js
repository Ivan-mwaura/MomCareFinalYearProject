// server/models/index.js
const User = require('./User');
const CHW = require('./CHW');
const Mother = require('./Mother');
const Appointment = require('./Appointment');
const Alert = require('./Alert');
const Notification = require('./Notification');
const HealthRecord = require('./HealthRecord');
const Feedback = require('./Feedback');
const HealthTip = require('./HealthTip');
const RiskAssessment = require('./RiskAssessment');

// Create models object
const models = {
  User,
  CHW,
  Mother,
  Appointment,
  Alert,
  Notification,
  HealthRecord,
  Feedback,
  HealthTip,
  RiskAssessment,
};

// Import and run associations using the models object
const defineAssociations = require('./associations');
defineAssociations(models);

module.exports = models;
