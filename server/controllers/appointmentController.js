// server/controllers/appointmentController.js
const { Appointment, Mother } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ appointment });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{
        model: Mother,
        as: 'mother',
        attributes: ['firstName', 'lastName']
      }]
    });

    // Map the appointments to include a combined motherName field
    const formattedAppointments = appointments.map((appointment) => {
      const a = appointment.toJSON();
      a.motherName = a.mother ? `${a.mother.firstName} ${a.mother.lastName}` : null;
      // Optionally, remove the mother object if you only want the name
      delete a.mother;
      return a;
    });

    res.json({ data: formattedAppointments });
  } catch (error) {
    console.error("Error in getAppointments:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ appointment });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    await Appointment.update(req.body, { where: { id: req.params.id } });
    const updatedAppointment = await Appointment.findByPk(req.params.id);
    res.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
