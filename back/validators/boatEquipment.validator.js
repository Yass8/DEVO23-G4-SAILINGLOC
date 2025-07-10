import { body, param } from 'express-validator';

export const validateBoatEquipmentId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateBoatId = [
  param('boat_id').isInt().withMessage('Boat ID must be an integer')
];

export const validateCreateBoatEquipment = [
  body('boat_id').isInt(),
  body('equipment_name').isString().isLength({ max: 255 })
];

export const validateUpdateBoatEquipment = [
  body('equipment_name').optional().isString().isLength({ max: 255 })
];