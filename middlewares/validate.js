import { validationResult } from 'express-validator';
import CustomError from '../utils/error.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg).join(', ');
    return next(new CustomError(errorMsg, 400));
  }
  next();
};

export default validate;
