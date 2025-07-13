const db = require("../config/database");
const { generateReference } = require("../utils/helpers");
const logger = require("../utils/logger");

class Deposit {
  constructor() {
    this.table = "deposits";
  }

  async create(depositData) {
    try {
      console.log(depositData, 12);
      const reference = generateReference();
      const data = {
        reference,
        ...depositData,
      };

      const [id] = await db(this.table).insert(data);

      const deposit = await this.findByReference(depositData.reference);
      console.log(deposit, 21);
      return deposit;
    } catch (error) {
      logger.error(`Error creating deposit: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await db(this.table).where({ id }).first();
    } catch (error) {
      logger.error(`Error finding deposit by ID: ${error.message}`);
      throw error;
    }
  }

  async findByReference(reference) {
    try {
      return await db(this.table).where({ reference }).first();
    } catch (error) {
      logger.error(`Error finding deposit by reference: ${error.message}`);
      throw error;
    }
  }

  async findByAccountId(accountId) {
    try {
      return await db(this.table).where({ account_id: accountId });
    } catch (error) {
      logger.error(`Error finding deposits by account ID: ${error.message}`);
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
      logger.error(`Error updating deposit status: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Deposit();
