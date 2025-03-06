const express = require('express');
require('dotenv').config();  // Load environment variables
const {connectDB} = require('./db/connect');  // Import the connectDB function
const Patient = require('./Models/NewMothersRegistration'); // Import the Patient model
const { createPatient } = require('./Controllers/PatientManagement/NewMothersRegistration');
const mainRoutes = require('./Routes/routes');
const cors = require('cors');
const errorHandlerMiddleware = require('./Middleware/errorhandler');
require('./Jobs/UpdatePregnancyWeeks');  // Import the cron job



const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cors());
app.use("/api/v1", mainRoutes);
app.use(errorHandlerMiddleware);

// Start the server and connect to PostgreSQL
const start = async () => {
    try {
      // Connect to PostgreSQL database
      const sequelize = await connectDB();  // This will return the sequelize instance
  
      console.log('Database connected!', sequelize.models);
  
      // Sync models (creates tables if they don't exist)
      await sequelize.sync({ force: false }); // `force: false` will not drop existing tables
      console.log('Models synchronized with the database.');
  
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (error) {
      console.error('Error starting the server:', error);
    }
  };
  
  start();
  