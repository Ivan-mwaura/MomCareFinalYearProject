const Appointment = require('../models/Appointment');

exports.createAppointment = async (data) => {
  return await Appointment.create(data);
};

exports.getAllAppointments = async () => {
  return await Appointment.findAll();
};
