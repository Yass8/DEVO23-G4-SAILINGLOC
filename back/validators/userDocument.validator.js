import { body, param } from 'express-validator';

export const validateUserDocumentId = [
  param('id').isInt().withMessage('ID must be an integer')
];

export const validateUserId = [
  param('user_id').isInt().withMessage('User ID must be an integer')
];

export const validateCreateUserDocument = [
  body('type').isIn(['licence', 'insurance', 'id_card']),
  body('file_url').isURL(),
  body('user_id').isInt()
];

export const validateUpdateUserDocument = [
  body('is_verified').optional().isBoolean(),
  body('Message').optional().isString()
];