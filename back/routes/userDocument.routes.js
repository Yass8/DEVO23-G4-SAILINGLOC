import express from "express";
import userDocumentController from "../controllers/userDocument.controller.js";
import {
  validateUserDocumentId,
  validateUserId,
  validateCreateUserDocument,
  validateUpdateUserDocument
} from "../validators/userDocument.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, userDocumentController.index);
router.post("/new", isAuthenticated, validateCreateUserDocument, validate, userDocumentController.create);
router.get("/:id/show", isAuthenticated, validateUserDocumentId, validate, userDocumentController.show);
router.put("/:id/edit", isAuthenticated, validateUserDocumentId, validateUpdateUserDocument, validate, userDocumentController.update);
router.delete("/:id/delete", isAuthenticated, validateUserDocumentId, validate, userDocumentController.remove);
router.get("/user/:user_id", isAuthenticated, validateUserId, validate, userDocumentController.getUserDocuments);

export default router;