const db = require('../config/database');
const { generateAccountNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class Account {
  constructor() {
    this.table = 'accounts';
  }

  async create(userId, accountData) {
    try {
      const accountNumber = generateAccountNumber();
      const data = {
        user_id: userId,
        account_number: accountNumber,
        ...accountData
      };

      const [id] = await db(this.table).insert(data);
      return this.findById(id);
    } catch (error) {
      logger.error(`Error creating account: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await db(this.table).where({ id }).first();
    } catch (error) {
      logger.error(`Error finding account by ID: ${error.message}`);
      throw error;
    }
  }

  async findByAccountNumber(accountNumber) {
    try {
      return await db(this.table).where({ account_number: accountNumber }).first();
    } catch (error) {
      logger.error(`Error finding account by account number: ${error.message}`);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await db(this.table).where({ user_id: userId });
    } catch (error) {
      logger.error(`Error finding accounts by user ID: ${error.message}`);
      throw error;
    }
  }

  async updateBalance(id, amount, action = 'credit') {
    try {
      const account = await this.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      let newBalance;
      if (action === 'credit') {
        newBalance = parseFloat(account.balance) + parseFloat(amount);
      } else if (action === 'debit') {
        if (parseFloat(account.balance) < parseFloat(amount)) {
          throw new Error('Insufficient balance');
        }
        newBalance = parseFloat(account.balance) - parseFloat(amount);
      } else {
        throw new Error('Invalid action');
      }

      await db(this.table)
        .where({ id })
        .update({ balance: newBalance });

      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating account balance: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Account();