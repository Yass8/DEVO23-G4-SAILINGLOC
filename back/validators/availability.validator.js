import { body, param } from 'express-validator';

export const validateAvailabilityId = [
    param('id').isInt().withMessage('ID must be an integer')
];

export const validateBoatId = [
    param('boatId').isInt().withMessage('Boat ID must be an integer')
];

export const validateCreateAvailability = [
  body('boat_id').isInt().withMessage('Boat ID must be an integer'),
  body('start_date').isISO8601().withMessage('Invalid start date'),
  body('end_date').isISO8601().withMessage('Invalid end date'),
  body('status').optional().isIn(['available', 'booked', 'maintenance'])
];

export const validateUpdateAvailability = [
  body('start_date').optional().isISO8601(),
  body('end_date').optional().isISO8601(),
  body('status').optional().isIn(['available', 'booked', 'maintenance'])
]