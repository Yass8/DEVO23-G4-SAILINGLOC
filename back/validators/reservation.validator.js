import { body, param } from 'express-validator';

export const validateReservationId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateBoatId = [
    param('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier.')
];

export const validateUserId = [
    param('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier.')
];

export const validateCreateReservation = [
    body('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier.'),
    body('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier.'),
    body('start_date').isISO8601().withMessage('La date de début est invalide.'),
    body('end_date').isISO8601().withMessage('La date de fin est invalide.'),
    body('total_price').isDecimal().withMessage('Le prix total doit être un nombre décimal.')
];

export const validateUpdateReservation = [
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Le statut doit être "pending", "confirmed", "cancelled" ou "completed".')
];
