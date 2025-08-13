import { body, param } from 'express-validator';

export const validateReviewId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateBoatId = [
    param('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier.')
];

export const validateUserId = [
    param('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier.')
];

export const validateCreateReview = [
    body('reservation_id').isInt().withMessage('L\'ID de la réservation doit être un entier.'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être comprise entre 1 et 5.'),
    body('comment').optional().isString().withMessage('Le commentaire doit être une chaîne de caractères.')
];

export const validateUpdateReview = [
    body('response').optional().isString().withMessage('La réponse doit être une chaîne de caractères.')
];
