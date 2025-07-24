import { body } from "express-validator";

export const validateRegister = [
    body("email").isEmail().withMessage("L'email doit être valide"),
    body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
    body("firstname").notEmpty().withMessage("Le prénom est obligatoire"),
    body("lastname").notEmpty().withMessage("Le nom est obligatoire"),
    body("isOwner").optional().isBoolean().withMessage("Le champ isOwner doit être un booléen"),
    body("roles").optional().isArray().withMessage("Les rôles doivent être un tableau de chaînes de caractères")
];
export const validateLogin = [
    body("email").isEmail().withMessage("L'email doit être valide"),
    body("password").notEmpty().withMessage("Le mot de passe est obligatoire")
];
export const validateChangePassword = [
    body("email").isEmail().withMessage("L'email doit être valide"),
    body("oldPassword").notEmpty().withMessage("L'ancien mot de passe est obligatoire"),
    body("newPassword").isLength({ min: 6 }).withMessage("Le nouveau mot de passe doit contenir au moins 6 caractères")
];
export const validateForgotPassword = [
    body("email").isEmail().withMessage("L'email doit être valide")
];