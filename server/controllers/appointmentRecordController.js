const AppointmentRecord = require('../models/AppointmentRecord');
const Mother = require('../models/Mother'); // Assuming you have a Mother model
const { validateAppointmentRecord } = require('../utils/validation');
const Appointment = require('../models/Appointment'); // Assuming you have an Appointment model

// Create an Appointment Record
exports.createAppointmentRecord = async (req, res) => {
  try {
    console.log("Creating appointment record with data:", req.body);
    const { motherId, appointmentId, ...recordData } = req.body;
    
    console.log("Extracted motherId:", motherId);
    console.log("Extracted appointmentId:", appointmentId);
    console.log("Remaining recordData:", recordData);
    
    // Validate required fields
    if (!motherId) {
      return res.status(400).json({
        success: false,
        message: "Mother ID is required"
      });
    }
    
    // Check if mother exists
    const mother = await Mother.findByPk(motherId);
    if (!mother) {
      return res.status(404).json({
        success: false,
        message: "Mother not found"
      });
    }
    
    // Create the appointment record
    const appointmentRecord = await AppointmentRecord.create({
      motherId,
      appointmentId, // Store the appointmentId if provided
      ...recordData
    });

    console.log("Created appointment record:", appointmentRecord.toJSON());
    console.log("Appointment ID in created record:", appointmentRecord.appointmentId);
    
    // If attended is true and appointmentId is provided, update the appointment status
    if (recordData.attended && appointmentId) {
      try {
        console.log("Updating appointment status for appointmentId:", appointmentId);
        
        // Find the appointment
        const appointment = await Appointment.findByPk(appointmentId);
        
        if (appointment) {
          // Update the appointment status to "Attended"
          await appointment.update({ status: "Attended" });
          console.log("Appointment status updated successfully to 'Attended'");
        } else {
          console.log("Appointment not found for ID:", appointmentId);
        }
      } catch (error) {
        console.error("Error updating appointment status:", error);
        // Continue with the response even if updating appointment status fails
      }
    } else {
      console.log("Not updating appointment status. Attended:", recordData.attended, "AppointmentId:", appointmentId);
    }
    
    res.status(201).json({
      success: true,
      message: "Appointment record created successfully",
      data: appointmentRecord
    });
  } catch (error) {
    console.error("Error creating appointment record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment record",
      error: error.message
    });
  }
};

// Get Appointment Records by motherId
exports.getAppointmentRecordsByMotherId = async (req, res) => {
  try {
    const { motherId } = req.params;

    // Validate motherId
    if (!motherId) {
      return res.status(400).json({ message: "Mother ID is required" });
    }

    // Check if mother exists
    const mother = await Mother.findByPk(motherId);
    if (!mother) {
      return res.status(404).json({ message: "Mother not found" });
    }

    const records = await AppointmentRecord.findAll({ 
      where: { motherId },
      order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']]
    });

    res.json({ 
      message: records.length ? "Records found" : "No records found",
      data: records 
    });
  } catch (error) {
    console.error("Error fetching appointment records:", error);
    res.status(500).json({ 
      message: "Failed to fetch appointment records", 
      error: error.message 
    });
  }
};

// Get a Single Appointment Record by ID
exports.getAppointmentRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id) {
      return res.status(400).json({ message: "Appointment record ID is required" });
    }

    const record = await AppointmentRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Appointment record not found" });
    }

    res.json({ 
      message: "Record found",
      data: record 
    });
  } catch (error) {
    console.error("Error fetching appointment record:", error);
    res.status(500).json({ 
      message: "Failed to fetch appointment record", 
      error: error.message 
    });
  }
};

// Update Appointment Record by ID
exports.updateAppointmentRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate id
    if (!id) {
      return res.status(400).json({ message: "Appointment record ID is required" });
    }

    // Validate update data
    const validationErrors = validateAppointmentRecord(updateData, true);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }

    // Check if record exists
    const existingRecord = await AppointmentRecord.findByPk(id);
    if (!existingRecord) {
      return res.status(404).json({ message: "Appointment record not found" });
    }

    // Check for duplicate appointment if date or time is being updated
    if (updateData.appointmentDate || updateData.appointmentTime) {
      const existingAppointment = await AppointmentRecord.findOne({
        where: {
          motherId: existingRecord.motherId,
          appointmentDate: updateData.appointmentDate || existingRecord.appointmentDate,
          appointmentTime: updateData.appointmentTime || existingRecord.appointmentTime,
          id: { [Op.ne]: id } // Exclude current record
        }
      });

      if (existingAppointment) {
        return res.status(409).json({ 
          message: "An appointment already exists for this mother at the specified date and time" 
        });
      }
    }

    // Update record
    await existingRecord.update(updateData);

    res.json({ 
      message: "Appointment record updated successfully",
      data: existingRecord 
    });
  } catch (error) {
    console.error("Error updating appointment record:", error);
    res.status(500).json({ 
      message: "Failed to update appointment record", 
      error: error.message 
    });
  }
};

// Delete Appointment Record by ID
exports.deleteAppointmentRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!id) {
      return res.status(400).json({ message: "Appointment record ID is required" });
    }

    // Check if record exists
    const record = await AppointmentRecord.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: "Appointment record not found" });
    }

    // Soft delete the record
    await record.update({ deletedAt: new Date() });

    res.json({ 
      message: "Appointment record deleted successfully",
      data: { id } 
    });
  } catch (error) {
    console.error("Error deleting appointment record:", error);
    res.status(500).json({ 
      message: "Failed to delete appointment record", 
      error: error.message 
    });
  }
};
