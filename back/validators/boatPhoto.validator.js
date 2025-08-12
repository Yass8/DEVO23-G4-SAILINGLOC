import { body, param } from 'express-validator';

export const validateBoatPhotoId = [
  param('id').isInt().withMessage('L\'ID doit être un entier')
];

export const validateBoatId = [
    param('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier.')
];

export const validateCreateBoatPhotos = [
  body('boat_id')
    .isInt({ gt: 0 }).withMessage('L’ID du bateau doit être un entier positif'),
  body('mainIndex')
    .isInt({ min: 0 }).withMessage('mainIndex doit être un entier ≥ 0'),
];

export const validateUpdateBoatPhotos = [
  body('boat_id')
    .isInt({ gt: 0 }).withMessage('L’ID du bateau doit être un entier positif'),
  body('mainIndex')
    .isInt({ min: 0 }).withMessage('mainIndex doit être un entier ≥ 0'),
];