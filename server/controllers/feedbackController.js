// server/controllers/feedbackController.js
const { Feedback } = require('../models');

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ feedback });
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.json({ data: feedbacks });
  } catch (error) {
    console.error("Error in getFeedback:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
