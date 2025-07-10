import { body, param } from 'express-validator';

export const validateContractId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateReservationId = [
  param('reservationId').isInt().withMessage('Reservation ID must be an integer')
];

export const validateCreateContract = [
  body('reservation_id').isInt(),
  body('contract_url').isURL()
];

export const validateUpdateContract = [
  body('owner_signature').optional().isBoolean(),
  body('renter_signature').optional().isBoolean()
];