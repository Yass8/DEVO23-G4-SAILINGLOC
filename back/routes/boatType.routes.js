import express from "express";
import boatTypeController from "../controllers/boatType.controller.js";
import {
  validateBoatTypeId,
  validateCreateBoatType,
  validateUpdateBoatType
} from "../validators/boatType.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", boatTypeController.index);
router.post("/new", validateCreateBoatType, validate, boatTypeController.create);
router.get("/:id/show",isAuthenticated, authorizeUser(['admin','owner']), validateBoatTypeId, validate, boatTypeController.show);
router.put("/:id/edit",isAuthenticated, authorizeUser(['admin','owner']), validateBoatTypeId, validateUpdateBoatType, validate, boatTypeController.update);
router.delete("/:id/delete", validateBoatTypeId, validate, boatTypeController.remove);

export default router;