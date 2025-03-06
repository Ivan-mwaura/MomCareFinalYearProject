const { Sequelize } = require('sequelize');

// PostgreSQL connection setup
const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: false,  // Disable logging for cleaner output
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    return sequelize;  // Return the sequelize instance for further use
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
    throw error;  // Throw error if the connection fails
  }
};

module.exports = { sequelize, connectDB };  // Export sequelize and connectDB together
