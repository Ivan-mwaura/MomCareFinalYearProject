const { Mother, CHW, RiskAssessment, Alert, User } = require('../models');
const { sendPushNotification } = require('../services/pushNotifications');

exports.getAllRiskAssessments = async (req, res) => {
  try {
    const riskAssessments = await RiskAssessment.findAll({
      include: [{
        model: Mother,
        as: 'mother',
        attributes: ['firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: riskAssessments });
  } catch (error) {
    console.error("Error in getAllRiskAssessments:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getRiskPrediction = async (req, res) => {
  // Receive only motherId and predicted_risk from the frontend

  console.log(req.body);
  const { motherId, predicted_risk } = req.body;
  
  if (!motherId || !predicted_risk) {
    return res.status(400).json({ message: 'motherId and predicted_risk are required' });
  }
  
  // Fetch mother's details from the mothers table
  const mother = await Mother.findByPk(motherId);
  if (!mother) {
    return res.status(404).json({ message: 'Mother not found' });
  }
  
  // Build risk assessment data using mother's details
  const riskData = {
    motherId: mother.id,
    riskLevel: predicted_risk, // e.g., "High"
    motherName: `${mother.firstName} ${mother.lastName}`,
    location: mother.ward || "Unknown", // adjust field name if needed
    pregnancyStage: mother.pregnancyStage || "Unknown",
    weeksPregnant: mother.weeksPregnant || 0,
    assignedCHW: null,
  };

  // If a CHW is assigned to the mother, fetch the CHW details and include them in riskData
  if (mother.chwId) {
    const chw = await CHW.findByPk(mother.chwId);
    if (chw) {
      riskData.assignedCHW = {
        firstName: chw.firstName,
        lastName: chw.lastName,
        email: chw.email,
        phone: chw.phone,
        // Add any other CHW details if necessary
      };
    }
  }
  
  // Create the RiskAssessment record
  const riskAssessmentRecord = await RiskAssessment.create(riskData);

  // If the predicted risk is "High", create an alert for the assigned CHW
  if (predicted_risk === "High" && mother.chwId) {
    const chw = await CHW.findByPk(mother.chwId);
    if (chw) {
      // Build the alert record details
      const alertData = {
        type: "High Risk Alert",
        description: `Mother ${mother.firstName} ${mother.lastName} is assessed at high risk.`,
        patientId: mother.id,
        patientName: `${mother.firstName} ${mother.lastName}`,
        date: new Date(), // or format as needed
      };
      
      // Create the alert record in the database
      const alertRecord = await Alert.create(alertData);
      
      // Optionally, send a push notification to the CHW.
      // Here we assume the CHW is also a User (or has an associated User record).
      // You may need to adjust the lookup logic based on your data model.
      const chwUser = await User.findOne({ where: { email: chw.email } });
      if (chwUser && chwUser.pushToken) {
        const title = "High Risk Alert";
        const body = `Patient ${mother.firstName} ${mother.lastName} is at high risk. Please review the assessment.`;
        await sendPushNotification(chwUser.pushToken, title, body, { alertId: alertRecord.id });
      }
    }
  }
  
  // Return the created RiskAssessment record
  res.json(riskAssessmentRecord);
};
