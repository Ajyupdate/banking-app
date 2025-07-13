const db = require("../config/database");
const { generateReference } = require("../utils/helpers");
const logger = require("../utils/logger");

class Transfer {
  constructor() {
    this.table = "transfers";
  }

  async create(transferData) {
    try {
      const reference = generateReference();
      const data = {
        reference,
        ...transferData,
      };

      const [id] = await db(this.table).insert(data);

      const transfer = await this.findByReference(reference);

      return transfer;
    } catch (error) {
      logger.error(`Error creating transfer: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await db(this.table).where({ id }).first();
    } catch (error) {
      logger.error(`Error finding transfer by ID: ${error.message}`);
      throw error;
    }
  }

  async findByReference(reference) {
    try {
      return await db(this.table).where({ reference }).first();
    } catch (error) {
      logger.error(`Error finding transfer by reference: ${error.message}`);
      throw error;
    }
  }

  async findByAccountId(accountId) {
    try {
      return await db(this.table)
        .where({ account_id: accountId })
        .orderBy("created_at", "desc");
    } catch (error) {
      logger.error(`Error finding transfers by account ID: ${error.message}`);
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
      logger.error(`Error updating transfer status: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Transfer();
