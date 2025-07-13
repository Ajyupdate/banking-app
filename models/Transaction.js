const db = require("../config/database");
const { generateReference } = require("../utils/helpers");
const logger = require("../utils/logger");

class Transaction {
  constructor() {
    this.table = "transactions";
  }

  async create(transactionData) {
    try {
      const reference = transactionData.reference || generateReference();
      const data = {
        reference,
        ...transactionData,
      };

      const [id] = await db(this.table).insert(data);
      return this.findById(id);
    } catch (error) {
      logger.error(`Error creating transaction: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await db(this.table).where({ id }).first();
    } catch (error) {
      logger.error(`Error finding transaction by ID: ${error.message}`);
      throw error;
    }
  }

  async findByReference(reference) {
    try {
      return await db(this.table).where({ reference }).first();
    } catch (error) {
      logger.error(`Error finding transaction by reference: ${error.message}`);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await db(this.table)
        .where({ user_id: userId })
        .orderBy("created_at", "desc");
    } catch (error) {
      logger.error(`Error finding transactions by user ID: ${error.message}`);
      throw error;
    }
  }

  async findByAccountId(accountId) {
    try {
      return await db(this.table)
        .where({ account_id: accountId })
        .orderBy("created_at", "desc");
    } catch (error) {
      logger.error(
        `Error finding transactions by account ID: ${error.message}`
      );
      throw error;
    }
  }

  async updateStatus(reference, status) {
    try {
      const updates = {
        status,
        updated_at: db.fn.now(),
      };

      if (status === "completed") {
        updates.completed_at = db.fn.now();
      }

      await db(this.table).where({ reference }).update(updates);

      return this.findByReference(reference);
    } catch (error) {
      logger.error(`Error updating transaction status: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Transaction();
