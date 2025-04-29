const passwordResetRoutes = require('./routes/passwordResetRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mothers', motherRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/appointment-records', appointmentRecordRoutes);
app.use('/api/password-reset', passwordResetRoutes); 