import { body, param } from 'express-validator';

export const validateBoatPhotoId = [
  param('id').isInt().withMessage('L\'ID doit être un entier')
];

export const validateCreateBoatPhoto = [
  body('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier'),
  body('photo_url').isURL().withMessage('L\'URL de la photo doit être valide'),
  body('is_main').optional().isBoolean()
    .withMessage('Le champ is_main doit être un booléen')
];

export const validateUpdateBoatPhoto = [
  body('photo_url').optional().isURL().withMessage('L\'URL de la photo doit être valide'),
  body('is_main').optional().isBoolean()
    .withMessage('Le champ is_main doit être un booléen')
];