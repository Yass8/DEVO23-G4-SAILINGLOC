import { body } from 'express-validator';

export const validateContact = [
    body('name').notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('L\'email doit être valide.'),
    body('message').notEmpty().withMessage('Le message est requis.'),
    body('subject').notEmpty().withMessage('Le sujet est requis.')
];