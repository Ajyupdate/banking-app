const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

class TransactionService {
  async getTransactionById(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      logger.error(`TransactionService.getTransactionById error: ${error.message}`);
      throw error;
    }
  }

  async getTransactionsByUser(userId) {
    try {
      const transactions = await Transaction.findByUserId(userId);
      return transactions;
    } catch (error) {
      logger.error(`TransactionService.getTransactionsByUser error: ${error.message}`);
      throw error;
    }
  }

  async getTransactionsByAccount(accountId) {
    try {
      const transactions = await Transaction.findByAccountId(accountId);
      return transactions;
    } catch (error) {
      logger.error(`TransactionService.getTransactionsByAccount error: ${error.message}`);
      throw error;
    }
  }

  async getTransactionsByType(userId, type) {
    try {
      const transactions = await Transaction.findByUserId(userId)
        .where({ type });
      return transactions;
    } catch (error) {
      logger.error(`TransactionService.getTransactionsByType error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TransactionService();