const AccountService = require("../services/accountService");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");

class AccountController {
  async createAccount(req, res, next) {
    try {
      const userId = req.user.id;

      const account = await AccountService.createAccount(userId, req.body);

      res.status(201).json({
        success: true,

        data: account,
      });
    } catch (error) {
      logger.error(`AccountController.createAccount error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getAccount(req, res, next) {
    try {
      const accountId = req.params.id;
      const account = await AccountService.getAccountById(accountId);

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      logger.error(`AccountController.getAccount error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getUserAccounts(req, res, next) {
    try {
      const userId = req.user.id;
      const accounts = await AccountService.getAccountsByUser(userId);

      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error) {
      logger.error(`AccountController.getUserAccounts error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }

  async getAccountByNumber(req, res, next) {
    try {
      const accountNumber = req.params.accountNumber;
      const account = await AccountService.getAccountByNumber(accountNumber);

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error) {
      logger.error(
        `AccountController.getAccountByNumber error: ${error.message}`
      );
      res.status(400).json({
        success: false,
        message: error.message,
      });
      next(error);
    }
  }
}

module.exports = new AccountController();
