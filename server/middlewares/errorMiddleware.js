const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, CustomAPIError } = require('../errors');  // Import your custom errors

exports.errorMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  };

  // Sequelize validation error (for fields like email)
  if (err.name === 'SequelizeValidationError') {
    customError.msg = err.errors.map((error) => error.message).join(', ');  // Collecting validation error messages
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Sequelize unique constraint error (email already exists)
  if (err.name === 'SequelizeUniqueConstraintError') {
    customError.msg = `Duplicate value entered for ${err.errors[0].path} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Sequelize foreign key constraint error (for example, invalid reference in a related table)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    customError.msg = `Foreign key constraint violation: ${err.message}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // General Sequelize errors
  if (err.name === 'SequelizeError') {
    customError.msg = `Sequelize error: ${err.message}`;
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // Handle other types of errors (like MongoDB duplicates in your previous MongoDB setup)
  if (err.code && err.code === 11000) {  // Duplicate key in MongoDB (for MongoDB migrations)
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handle errors specific to custom error classes
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  // Return the error response
  return res.status(customError.statusCode).json({ msg: customError.msg });
};


