const AuthService = require("../services/authService");
const { registerValidator, loginValidator } = require("../utils/validators");
const logger = require("../utils/logger");
const { validationResult } = require("express-validator");

class AuthController {
  async register(req, res, next) {
    try {
      // Validate request body
      await Promise.all(
        registerValidator.map((validation) => validation.run(req))
      );

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { firstName, lastName, email, phone, password } = req.body;

      const user = await AuthService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error(`AuthController.register error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      // Validate request body
      await Promise.all(
        loginValidator.map((validation) => validation.run(req))
      );

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: { user, token },
      });
    } catch (error) {
      logger.error(`AuthController.login error: ${error.message}`);
      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      next(error);
    }
  }
}

module.exports = new AuthController();
