import { body, param } from 'express-validator';

export const validateBoatEquipmentId = [
  param('id').isInt().withMessage("L'ID de l'équipement doit être un entier"),
];

export const validateBoatId = [
  param('boatId').isInt().withMessage("L'ID du bateau doit être un entier"),
];

export const validateCreateBoatEquipment = [
  body().isArray().withMessage('Le body doit être un tableau'),
  body('*.boat_id').isInt().withMessage('L\'ID du bateau doit être un entier'),
  body('*.equipment_name').isString().isLength({ max: 255 })
];

export const validateUpdateBoatEquipment = [
  body('name').optional().isString().isLength({ max: 255 })
    .withMessage('Le nom ne doit pas dépasser 255 caractères'),
  body('category').optional().isString().isLength({ max: 255 })
    .withMessage('La catégorie ne doit pas dépasser 255 caractères'),
  body('is_required').optional().isBoolean()
    .withMessage('is_required doit être un booléen'),
];