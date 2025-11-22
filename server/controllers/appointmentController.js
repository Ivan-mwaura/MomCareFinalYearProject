// server/controllers/appointmentController.js
const { Appointment, Mother } = require('../models');
const { sendAppointmentEmail } = require('../services/emailService');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    
    // Get mother's email
    const mother = await Mother.findByPk(req.body.motherId);
    if (mother && mother.email) {
      try {
        await sendAppointmentEmail(mother.email, {
          date: appointment.date,
          time: appointment.time,
          location: appointment.location,
          provider: appointment.provider,
          type: appointment.type
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the appointment creation if email fails
      }
    }

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

exports.getAppointmentsByMotherId = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { motherId: req.params.motherId },
      include: [{
        model: Mother,
        as: 'mother',
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']] // Most recent first
    });

    if (!appointments.length) {
      return res.status(200).json({ data: [] }); // Return empty array instead of 404
    }

    // Map the appointments to include a combined motherName field
    const formattedAppointments = appointments.map((appointment) => {
      const a = appointment.toJSON();
      a.motherName = a.mother ? `${a.mother.firstName} ${a.mother.lastName}` : null;
      delete a.mother;
      return a;
    });

    res.json({ data: formattedAppointments });
  } catch (error) {
    console.error("Error in getAppointmentsByMotherId:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update appointment status to "Attended"
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    console.log(appointmentId);
    
    // Find the appointment
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // Update the status to "Attended"
    await appointment.update({ status: "Attended" });
    
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update appointment status",
      error: error.message 
    });
  }
};
