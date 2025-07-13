const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  
  // JWT authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }

  // Custom error
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({ 
      success: false,
      message: err.message 
    });
  }

  // Default to 500 server error
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong' 
  });
};

module.exports = errorHandler;