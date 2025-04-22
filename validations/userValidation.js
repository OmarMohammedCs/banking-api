import { body } from 'express-validator';

export const signupValidation = [
  body('userName')
    .notEmpty()
    .withMessage('userName is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

