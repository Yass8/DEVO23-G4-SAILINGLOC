import express from "express";
import authController from "../controllers/auth.controller.js";
import { validateLogin, validateRegister, validateChangePassword, validateForgotPassword, validateResetPassword } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.post("/login", validateLogin, validate, authController.login);
router.post("/register", validateRegister, validate, authController.register);
router.get("/me", authController.getCurrentUser);
router.get("/confirmation/:token", authController.confirmEmail);
router.post("/change-password", isAuthenticated, validateChangePassword, validate, authController.changePassword);
router.post("/forgot-password-email", validateForgotPassword, validate, authController.forgotPasswordEmail);
router.post("/reset-password", validateResetPassword, validate, authController.resetPassword);

export default router;