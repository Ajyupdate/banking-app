const db = require('../config/database');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class User {
  constructor() {
    this.table = 'users';
  }

  async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const [id] = await db(this.table).insert(userData);
      return this.findById(id);
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await db(this.table).where({ id }).first();
    } catch (error) {
      logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await db(this.table).where({ email }).first();
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async comparePassword(candidatePassword, userPassword) {
    try {
      return await bcrypt.compare(candidatePassword, userPassword);
    } catch (error) {
      logger.error(`Error comparing passwords: ${error.message}`);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      await db(this.table).where({ id }).update(updates);
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new User();