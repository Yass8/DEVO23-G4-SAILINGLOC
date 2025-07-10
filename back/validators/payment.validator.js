import { body, param } from 'express-validator';

export const validatePaymentId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateReservationId = [
  param('reservation_id').isInt().withMessage('Reservation ID must be an integer')
];

export const validateCreatePayment = [
  body('reservation_id').isInt(),
  body('amount').isDecimal(),
  body('method').isIn(['credit_card', 'paypal', 'bank_transfer']),
  body('commission_amount').isDecimal()
];

export const validateUpdatePayment = [
  body('status').optional().isIn(['pending', 'completed', 'failed', 'refunded'])
];