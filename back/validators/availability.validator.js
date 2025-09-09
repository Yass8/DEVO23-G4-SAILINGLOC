import { body, param } from 'express-validator';

export const validateAvailabilityId = [
  param('id').isInt().withMessage('L\'ID doit être un entier')
];

export const validateBoatId = [
  param('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier')
];

export const validateCreateAvailability = [
  body('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier'),
  body('start_date').isISO8601().withMessage('Format de date de début invalide'),
  body('end_date').isISO8601().withMessage('Format de date de fin invalide'),
  body('status').optional().isIn(['available', 'booked', 'maintenance'])
    .withMessage('Le statut doit être "available", "booked" ou "maintenance"')
];

export const validateUpdateAvailability = [
  body('start_date').optional().isISO8601().withMessage('Format de date de début invalide'),
  body('end_date').optional().isISO8601().withMessage('Format de date de fin invalide'),
  body('status').optional().isIn(['available', 'booked', 'maintenance'])
    .withMessage('Le statut doit être "available", "booked" ou "maintenance"')
];