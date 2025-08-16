import { body, param } from 'express-validator';

export const validatePaymentId = [
    param('id').isInt().withMessage('L\'ID doit être un entier.')
];

export const validateReservationId = [
    param('reservation_id').isInt().withMessage('L\'ID de la réservation doit être un entier.')
];

export const validateCreatePayment = [
    body('reservation_id').isInt().withMessage('L\'ID de la réservation doit être un entier.'),
    body('amount').isDecimal().withMessage('Le montant doit être un nombre décimal.'),
    body('method').isIn(['credit_card', 'paypal', 'bank_transfer']).withMessage('La méthode de paiement doit être "credit_card", "paypal" ou "bank_transfer".'),
    body('commission_amount').isDecimal().withMessage('Le montant de la commission doit être un nombre décimal.')
];

export const validateUpdatePayment = [
    body('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Le statut doit être "pending", "completed", "failed" ou "refunded".')
];
