const validateAppointmentRecord = (data, isUpdate = false) => {
  const errors = {};

  // Helper function to validate required fields
  const validateRequired = (field, fieldName) => {
    if (!data[field] && data[field] !== 0 && data[field] !== false) {
      errors[field] = `${fieldName} is required`;
    }
  };

  // Helper function to validate numeric range
  const validateNumericRange = (field, fieldName, min, max) => {
    if (data[field] !== undefined && data[field] !== '') {
      const value = Number(data[field]);
      if (isNaN(value) || value < min || value > max) {
        errors[field] = `${fieldName} must be between ${min} and ${max}`;
      }
    }
  };

  // Helper function to validate date
  const validateDate = (field, fieldName) => {
    if (data[field]) {
      const date = new Date(data[field]);
      if (isNaN(date.getTime())) {
        errors[field] = `${fieldName} must be a valid date`;
      }
    }
  };

  // Helper function to validate time format (HH:mm)
  const validateTime = (field, fieldName) => {
    if (data[field] && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data[field])) {
      errors[field] = `${fieldName} must be in HH:mm format`;
    }
  };

  // Skip required validations for updates
  if (!isUpdate) {
    // Visit Details
    validateRequired('appointmentDate', 'Appointment date');
    validateRequired('appointmentTime', 'Appointment time');
    validateRequired('visitType', 'Visit type');
  }

  // Validate dates if provided
  validateDate('appointmentDate', 'Appointment date');
  validateDate('nextAppointmentDate', 'Next appointment date');

  // Validate time if provided
  validateTime('appointmentTime', 'Appointment time');

  // Validate vital signs if provided
  if (data.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(data.bloodPressure)) {
    errors.bloodPressure = 'Blood pressure must be in format systolic/diastolic (e.g., 120/80)';
  }

  validateNumericRange('heartRate', 'Heart rate', 40, 200);
  validateNumericRange('temperature', 'Temperature', 35, 46);
  validateNumericRange('weight', 'Weight', 30, 250);
  validateNumericRange('fundalHeight', 'Fundal height', 0, 250);
  validateNumericRange('fetalHeartRate', 'Fetal heart rate', 80, 160);
  validateNumericRange('gestationalAge', 'Gestational age', 0, 45);

  // Validate text fields length if provided
  const maxLength = 1000;
  const textFields = [
    'physicalFindings',
    'symptoms',
    'labResults',
    'ultrasoundSummary',
    'prescribedMedications',
    'interventions',
    'careRecommendations',
    'adherenceNotes',
    'doctorsObservations',
    'patientConcerns'
  ];

  textFields.forEach(field => {
    if (data[field] && data[field].length > maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} must not exceed ${maxLength} characters`;
    }
  });

  return errors;
};

module.exports = {
  validateAppointmentRecord
}; 