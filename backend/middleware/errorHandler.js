// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error('--- ERROR DETECTED ---');
  console.error(err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT expired/invalid errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized, token signature is invalid';
    error = { message, statusCode: 401 };
  }
  if (err.name === 'TokenExpiredError') {
    const message = 'Not authorized, login session has expired';
    error = { message, statusCode: 401 };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = errorHandler;
