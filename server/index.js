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
const pushNotificationsRoutes = require('./routes/pushNotificationsRoutes');
const appointmentRecordRoutes = require('./routes/appointmentRecordRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
// Import error middleware
const { errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8081', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
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
app.use('/api/registerPushToken', pushNotificationsRoutes);
app.use('/api/appointmentRecords', appointmentRecordRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/password-reset', passwordResetRoutes);
// Error Handler Middleware
app.use(errorMiddleware);

app.get('/', (req, res) => res.json({ message: 'Welcome to Mom Care API' }));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

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
