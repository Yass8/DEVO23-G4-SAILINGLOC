import { body, param } from 'express-validator';

export const validatePortId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateCreatePort = [
  body('name').isString().isLength({ max: 255 }),
  body('city').isString().isLength({ max: 255 }),
  body('country').isString().isLength({ max: 255 }),
  body('latitude').optional().isDecimal(),
  body('longitude').optional().isDecimal()
];

export const validateUpdatePort = [
  body('name').optional().isString().isLength({ max: 255 }),
  body('city').optional().isString().isLength({ max: 255 })
];