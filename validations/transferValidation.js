import { body } from 'express-validator';

export const transferValidation = [
  body('id').notEmpty().withMessage('Receiver ID is required'),
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),
  body('transactionType')
    .isIn(['credit', 'debit'])
    .withMessage('Transaction type must be credit or debit'),
];
