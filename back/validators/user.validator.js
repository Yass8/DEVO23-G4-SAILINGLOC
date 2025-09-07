// user.validator.js
import { body, param } from 'express-validator';


const passwordStrength = (minLength = 8) =>
  body('password')
    .isLength({ min: minLength })
    .withMessage(`Le mot de passe doit faire au moins ${minLength} caractères.`)
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Le mot de passe doit contenir au moins un caractère spécial.');

export const validateUserId = [
  param('id')
    .isInt().withMessage("L'ID utilisateur doit être un entier.")
];

export const validateCreateUser = [
  body('firstname')
    .isString().withMessage('Le prénom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères.'),

  body('lastname')
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères.'),

  body('email')
    .isEmail().withMessage('Veuillez fournir une adresse email valide.'),

  passwordStrength(6),

  body('role')
    .isArray().withMessage('Le rôle doit être un tableau.'),

  body('phone')
    .optional()
    .isString().withMessage('Le téléphone doit être une chaîne de caractères.'),

  body('payment_method')
    .optional()
    .isString().withMessage('La méthode de paiement doit être une chaîne de caractères.'),

  body('photo')
    .optional()
    .isString().withMessage('La photo doit être une chaîne de caractères.'),

  body('address')
    .optional()
    .isString().withMessage("L'adresse doit être une chaîne de caractères.")
];

export const validateUpdateUser = [
  body('firstname')
    .optional()
    .isString().withMessage('Le prénom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères.'),

  body('lastname')
    .optional()
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères.'),

  body('email')
    .optional()
    .isEmail().withMessage('Veuillez fournir une adresse email valide.'),

  passwordStrength(6).optional(),

  body('role')
    .optional()
    .isArray().withMessage('Le rôle doit être un tableau.'),

  body('phone')
    .optional()
    .isString().withMessage('Le téléphone doit être une chaîne de caractères.'),

  // body('payment_method')
  //   .optional()
  //   .isString().withMessage('La méthode de paiement doit être une chaîne de caractères.'),

  body('photo')
    .optional()
    .isString().withMessage('La photo doit être une chaîne de caractères.'),

  body('address')
    .optional()
    .isString().withMessage("L'adresse doit être une chaîne de caractères.")
];