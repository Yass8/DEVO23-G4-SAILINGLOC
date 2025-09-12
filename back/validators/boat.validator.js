import { body, param } from 'express-validator';

export const validateBoatId = [
  param('id').isInt().withMessage('L\'ID du bateau doit être un entier')
];

export const validateBoatSlug = [
  param("slug")
    .isString()
    .withMessage("Le slug doit être une chaîne valide")
    .notEmpty()
    .withMessage("Le slug est requis"),
];

export const validateCreateBoat = [
  body('registration_number').isString().isLength({ min: 1, max: 32 })
    .withMessage('L\'immatriculation doit être une chaîne de 1 à 32 caractères'),
  body('name').isString().isLength({ min: 1, max: 255 })
    .withMessage('Le nom doit être une chaîne de 1 à 255 caractères'),
  body('brand').isString().isLength({ max: 255 })
    .withMessage('La marque ne doit pas dépasser 255 caractères'),
  body('length').isFloat({ gt: 0 })
    .withMessage('La longueur doit être un nombre positif'),
  body('daily_price').isDecimal()
    .withMessage('Le prix journalier doit être un nombre décimal'),
  body('user_id').isInt().withMessage('L\'ID utilisateur doit être un entier'),
  body('port_id').optional().isInt().withMessage('L\'ID du port doit être un entier'),
  body('type_id').optional().isInt().withMessage('L\'ID du type doit être un entier')
];

export const validateUpdateBoat = [
  body('name').optional().isString().isLength({ max: 255 })
    .withMessage('Le nom ne doit pas dépasser 255 caractères'),
  body('description').optional().isString()
    .withMessage('La description doit être une chaîne de caractères'),
  body('daily_price').optional().isDecimal()
    .withMessage('Le prix journalier doit être un nombre décimal')
];