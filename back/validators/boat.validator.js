import { body, param } from 'express-validator';

export const validateBoatId = [
  param('id').isInt().withMessage('Boat ID must be an integer')
];

export const validateCreateBoat = [
  body('reference').isString().isLength({ min: 1, max: 32 }),
  body('name').isString().isLength({ min: 1, max: 255 }),
  body('brand').isString().isLength({ max: 255 }),
  body('length').isFloat({ gt: 0 }),
  body('daily_price').isDecimal(),
  body('user_id').isInt(),
  body('port_id').optional().isInt(),
  body('type_id').optional().isInt()
];

export const validateUpdateBoat = [
  body('name').optional().isString().isLength({ max: 255 }),
  body('description').optional().isString(),
  body('daily_price').optional().isDecimal()
];