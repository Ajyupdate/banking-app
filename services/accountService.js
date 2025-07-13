const Account = require('../models/Account');
const User = require('../models/User');
const { generateReference } = require('../utils/helpers');
const logger = require('../utils/logger');

class AccountService {
  async createAccount(userId, accountData) {
    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create account
      const account = await Account.create(userId, {
        account_name: `${user.first_name} ${user.last_name}`,
        ...accountData
      });

      return account;
    } catch (error) {
      logger.error(`AccountService.createAccount error: ${error.message}`);
      throw error;
    }
  }

  async getAccountById(accountId) {
    try {
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      logger.error(`AccountService.getAccountById error: ${error.message}`);
      throw error;
    }
  }

  async getAccountsByUser(userId) {
    try {
      const accounts = await Account.findByUserId(userId);
      return accounts;
    } catch (error) {
      logger.error(`AccountService.getAccountsByUser error: ${error.message}`);
      throw error;
    }
  }

  async getAccountByNumber(accountNumber) {
    try {
      const account = await Account.findByAccountNumber(accountNumber);
      if (!account) {
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      logger.error(`AccountService.getAccountByNumber error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AccountService();