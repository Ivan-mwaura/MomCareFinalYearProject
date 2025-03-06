const Appointment = require('../models/Appointment');
const Mother = require('../models/Mother');
const CHW = require('../models/CHW');

exports.getDashboardAnalytics = async () => {
  const totalMothers = await Mother.count();
  const totalAppointments = await Appointment.count();
  const totalCHWs = await CHW.count();

  return { totalMothers, totalAppointments, totalCHWs };
};
