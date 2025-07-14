const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Create new user
      const user = await User.create(userData);

      // Remove password from response
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;

      return userObj;
    } catch (error) {
      logger.error(`AuthService.register error: ${error.message}`);
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Check if user exists
      const user = await User.findByEmail(email);
      console.log(user, 32);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Check if password matches
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;

      return { user: userObj, token };
    } catch (error) {
      logger.error(`AuthService.login error: ${error.message}`);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      logger.error(`AuthService.verifyToken error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
