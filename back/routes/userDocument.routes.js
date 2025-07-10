import express from "express";
import userDocumentController from "../controllers/userDocument.controller.js";
import {
  validateUserDocumentId,
  validateUserId,
  validateCreateUserDocument,
  validateUpdateUserDocument
} from "../validators/userDocument.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", userDocumentController.index);
router.post("/new", validateCreateUserDocument, validate, userDocumentController.create);
router.get("/:id/show", validateUserDocumentId, validate, userDocumentController.show);
router.put("/:id/edit", validateUserDocumentId, validateUpdateUserDocument, validate, userDocumentController.update);
router.delete("/:id/delete", validateUserDocumentId, validate, userDocumentController.remove);
router.get("/user/:userId", validateUserId, validate, userDocumentController.getUserDocuments);

export default router;