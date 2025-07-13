const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const logger = require('./logger');

/**
 * Generate a unique reference
 * @returns {string} Unique reference
 */
const generateReference = () => {
  return `REF-${uuidv4().split('-').join('').toUpperCase()}`;
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate phone number (basic Nigerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
const isValidPhone = (phone) => {
  return validator.isMobilePhone(phone, 'en-NG');
};

/**
 * Generate a random account number
 * @returns {string} 10-digit account number
 */
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

/**
 * Format amount to 2 decimal places
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(2);
};

module.exports = {
  generateReference,
  isValidEmail,
  isValidPhone,
  generateAccountNumber,
  formatAmount
};