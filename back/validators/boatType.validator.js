import { body, param } from 'express-validator';

export const validateBoatTypeId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateCreateBoatType = [
    body('name').isString().isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),
    body('photo_url').optional().isURL().withMessage('L\'URL de la photo est invalide.')
];

export const validateUpdateBoatType = [
    body('name').optional().isString().isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),
    body('photo_url').optional().isURL().withMessage('L\'URL de la photo est invalide.')
];
