import { body, param } from 'express-validator';

export const validateReviewId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateBoatId = [
  param('boat_id').isInt().withMessage('Boat ID must be an integer')
];

export const validateUserId = [
  param('user_id').isInt().withMessage('User ID must be an integer')
];

export const validateCreateReview = [
  body('reservation_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().isString()
];

export const validateUpdateReview = [
  body('response').optional().isString()
];