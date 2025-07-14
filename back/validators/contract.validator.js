import { body, param } from 'express-validator';

export const validateContractId = [
  param('id').isInt().withMessage('L\'ID doit être un entier')
];

export const validateCreateContract = [
  body('reservation_id').isInt().withMessage('L\'ID de réservation doit être un entier'),
  body('contract_url').isURL().withMessage('L\'URL du contrat doit être valide')
];

export const validateUpdateContract = [
  body('owner_signature').optional().isBoolean()
    .withMessage('La signature du propriétaire doit être un booléen'),
  body('renter_signature').optional().isBoolean()
    .withMessage('La signature du locataire doit être un booléen')
];