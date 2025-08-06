import { body, param } from 'express-validator';

export const validateMessageId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateUserId = [
    param('userId').isInt().withMessage('L\'ID utilisateur doit être un entier.')
];

export const validateReservationId = [
    param('reservation_id').isInt().withMessage('L\'ID de la réservation doit être un entier.')
];

export const validateCreateMessage = [
    body('sender_id').isInt().withMessage('L\'ID de l\'expéditeur doit être un entier.'),
    body('receiver_id').isInt().withMessage('L\'ID du destinataire doit être un entier.'),
    body('content').isString().notEmpty().withMessage('Le contenu du message est obligatoire.'),
    body('reservation_id').optional().isInt().withMessage('L\'ID de la réservation doit être un entier.')
];
