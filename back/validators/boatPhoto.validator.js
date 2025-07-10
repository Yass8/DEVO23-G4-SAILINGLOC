import { body, param } from 'express-validator';

export const validateBoatPhotoId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateBoatId = [
  param('boat_id').isInt().withMessage('Boat ID must be an integer')
];

export const validateCreateBoatPhoto = [
  body('boat_id').isInt(),
  body('photo_url').isURL(),
  body('is_main').optional().isBoolean()
];

export const validateUpdateBoatPhoto = [
  body('photo_url').optional().isURL(),
  body('is_main').optional().isBoolean()
];