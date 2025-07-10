import { body, param } from 'express-validator';

export const validateMessageId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateUserId = [
  param('userId').isInt().withMessage('User ID must be an integer')
];

export const validateReservationId = [
  param('reservation_id').isInt().withMessage('Reservation ID must be an integer')
];

export const validateCreateMessage = [
  body('sender_id').isInt(),
  body('receiver_id').isInt(),
  body('content').isString().notEmpty(),
  body('reservation_id').optional().isInt()
];