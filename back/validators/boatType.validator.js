import { body, param } from 'express-validator';

export const validateBoatTypeId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateCreateBoatType = [
  body('name').isString().isLength({ max: 255 }),
  body('photo_url').optional().isURL()
];

export const validateUpdateBoatType = [
  body('name').optional().isString().isLength({ max: 255 }),
  body('photo_url').optional().isURL()
];