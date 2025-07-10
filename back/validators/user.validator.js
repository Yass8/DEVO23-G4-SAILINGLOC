import { body, param } from 'express-validator';

export const validateUserId = [
  param('id').isInt().withMessage('User ID must be an integer')
];

export const validateCreateUser = [
  body('firstname').isString().isLength({ max: 255 }),
  body('lastname').isString().isLength({ max: 255 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isArray()
];

export const validateUpdateUser = [
  body('firstname').optional().isString().isLength({ max: 255 }),
  body('lastname').optional().isString().isLength({ max: 255 }),
  body('phone').optional().isString(),
  body('payment_method').optional().isString()
];