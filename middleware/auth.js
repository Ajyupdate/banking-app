const jwt = require("jsonwebtoken");
const AuthService = require("../services/authService");
const logger = require("../utils/logger");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    // Verify token
    const decoded = await AuthService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

module.exports = auth;
