import { body } from 'express-validator';

const passwordStrength = (minLength = 6) =>
  body('password')
    .isLength({ min: minLength })
    .withMessage(`Le mot de passe doit contenir au moins ${minLength} caractères.`)
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Le mot de passe doit contenir au moins un caractère spécial.');

export const validateRegister = [
  body('email').isEmail().withMessage("L'email doit être valide"),
  passwordStrength(6),
  body('firstname').notEmpty().withMessage('Le prénom est obligatoire'),
  body('lastname').notEmpty().withMessage('Le nom est obligatoire'),
  body('isOwner').optional().isBoolean().withMessage('Le champ isOwner doit être un booléen'),
  body('roles').optional().isArray().withMessage('Les rôles doivent être un tableau de chaînes de caractères')
];

export const validateLogin = [
  body('email').isEmail().withMessage("L'email doit être valide"),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
];

export const validateChangePassword = [
  body('email').isEmail().withMessage("L'email doit être valide"),
  body('oldPassword').notEmpty().withMessage("L'ancien mot de passe est obligatoire"),
  passwordStrength(6)
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage("L'email doit être valide")
];

export const validateResetPassword = [
  passwordStrength(6)
];