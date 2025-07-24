import express from "express";
import authController from "../controllers/auth.controller.js";
import { validateLogin, validateRegister, validateChangePassword, validateForgotPassword } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.post("/login", validateLogin, validate, authController.login);
router.post("/register", validateRegister, validate, authController.register);
router.get("/logout", authController.logout);
router.get("/me", authController.getCurrentUser);
router.post("/change-password",  validateChangePassword, validate, authController.changePassword); 
router.post("/forgot-password", validateForgotPassword, validate, authController.forgotPassword);

export default router;