const { body } = require('express-validator');
const { isValidEmail, isValidPhone } = require('./helpers');

const registerValidator = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .custom(isValidEmail).withMessage('Invalid email address'),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .custom(isValidPhone).withMessage('Invalid phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/)
    .withMessage('Password must include uppercase, lowercase, number, and special character'),
];

const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .custom(isValidEmail).withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator
};