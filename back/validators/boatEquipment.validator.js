import { body, param } from 'express-validator';

export const validateBoatEquipmentId = [
  param('id').isInt().withMessage('L\'ID doit être un entier')
];

export const validateBoatId = [
    param('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier.')
];

export const validateCreateBoatEquipment = [
  body('boat_id').isInt().withMessage('L\'ID du bateau doit être un entier'),
  body('equipment_name').isString().isLength({ max: 255 })
    .withMessage('Le nom de l\'équipement ne doit pas dépasser 255 caractères')
];

export const validateUpdateBoatEquipment = [
  body('equipment_name').optional().isString().isLength({ max: 255 })
    .withMessage('Le nom de l\'équipement ne doit pas dépasser 255 caractères')
];