const express = require('express');
require('express-async-errors');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv').config();
const { connectDB } = require('./db/connect');
const { logger } = require('./utils/logger');
require('./Jobs/UpdatePregnancyWeeks')

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const motherRoutes = require('./routes/motherRoutes');
const chwRoutes = require('./routes/chwRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const alertRoutes = require('./routes/alertRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const healthRecordRoutes = require('./routes/healthRecordRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const healthTipRoutes = require('./routes/healthTipRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// Import error middleware
const { errorMiddleware } = require('./middlewares/errorMiddleware');


const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors());
//app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mothers', motherRoutes);
app.use('/api/chws', chwRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/healthrecords', healthRecordRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/healthtips', healthTipRoutes);
app.use('/api/predictions', predictionRoutes);

// Error Handler Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to DB', err);
    process.exit(1);
  });
