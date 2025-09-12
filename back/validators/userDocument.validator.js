import { body, param } from 'express-validator';

export const validateUserDocumentId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateUserId = [
    param('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier.')
];

export const validateCreateUserDocument = [
    body('type').isIn(['licence', 'insurance', 'id_card', 'cv','proof_of_address']).withMessage('Le type doit être "licence", "insurance" ou "id_card".'),
    body('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier.')
];

export const validateUpdateUserDocument = [
    body('is_verified').optional().isBoolean().withMessage('Le champ vérifié doit être un booléen.'),
    body('Message').optional().isString().withMessage('Le message doit être une chaîne de caractères.')
];
