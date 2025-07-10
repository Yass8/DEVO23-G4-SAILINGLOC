import { body, param } from 'express-validator';

export const validateReservationId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateBoatId = [
  param('boat_id').isInt().withMessage('Boat ID must be an integer')
];

export const validateUserId = [
  param('user_id').isInt().withMessage('User ID must be an integer')
];

export const validateCreateReservation = [
  body('boat_id').isInt(),
  body('user_id').isInt(),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('total_price').isDecimal()
];

export const validateUpdateReservation = [
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed'])
];