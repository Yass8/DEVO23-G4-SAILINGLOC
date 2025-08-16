import express from "express";
import portController from "../controllers/port.controller.js";
import {
  validatePortId,
  validateCreatePort,
  validateUpdatePort
} from "../validators/port.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", portController.index);
router.post("/new", isAuthenticated, authorizeUser(['admin']), validateCreatePort, validate, portController.create);
router.get("/:id/show", validatePortId, validate, portController.show);
router.put("/:id/edit", isAuthenticated, authorizeUser(['admin']), validatePortId, validateUpdatePort, validate, portController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin']), validatePortId, validate, portController.remove);

export default router;