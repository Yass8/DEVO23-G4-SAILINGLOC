import { body, param } from 'express-validator';

export const validatePortId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateCreatePort = [
    body('name').isString().isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),
    body('city').isString().isLength({ max: 255 }).withMessage('La ville ne doit pas dépasser 255 caractères.'),
    body('country').isString().isLength({ max: 255 }).withMessage('Le pays ne doit pas dépasser 255 caractères.'),
    body('latitude').optional().isDecimal().withMessage('La latitude doit être un nombre décimal.'),
    body('longitude').optional().isDecimal().withMessage('La longitude doit être un nombre décimal.')
];

export const validateUpdatePort = [
    body('name').optional().isString().isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères.'),
    body('city').optional().isString().isLength({ max: 255 }).withMessage('La ville ne doit pas dépasser 255 caractères.')
];
