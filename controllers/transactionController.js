const TransactionService = require('../services/transactionService');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

class TransactionController {
  async getTransaction(req, res, next) {
    try {
      const transactionId = req.params.id;
      const transaction = await TransactionService.getTransactionById(transactionId);

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      logger.error(`TransactionController.getTransaction error: ${error.message}`);
      next(error);
    }
  }

  async getUserTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      const transactions = await TransactionService.getTransactionsByUser(userId);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error(`TransactionController.getUserTransactions error: ${error.message}`);
      next(error);
    }
  }

  async getAccountTransactions(req, res, next) {
    try {
      const accountId = req.params.accountId;
      const transactions = await TransactionService.getTransactionsByAccount(accountId);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error(`TransactionController.getAccountTransactions error: ${error.message}`);
      next(error);
    }
  }

  async getTransactionsByType(req, res, next) {
    try {
      const userId = req.user.id;
      const type = req.params.type; // deposit, transfer, etc.
      const transactions = await TransactionService.getTransactionsByType(userId, type);

      res.status(200).json({
        success: true,
        data: transactions
      });
    } catch (error) {
      logger.error(`TransactionController.getTransactionsByType error: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new TransactionController();