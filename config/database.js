const knex = require('knex');
const config = require('../knexfile');
const logger = require('../utils/logger');

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Test the database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info(`Database connected successfully in ${environment} mode`);
  })
  .catch(err => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = db;