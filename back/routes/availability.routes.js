import express from "express";
import availabilityController from "../controllers/availability.controller.js";

import { validate } from "../middlewares/validate.js";
import {
    validateAvailabilityId,
    validateBoatId,
    validateCreateAvailability,
    validateUpdateAvailability
} from '../validators/availability.validator.js';
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", availabilityController.index);
router.post("/new", validateCreateAvailability, validate, availabilityController.create);
router.get("/:id/show", validateAvailabilityId, validate, validateAvailabilityId, validate, availabilityController.show);
router.put("/:id/edit", isAuthenticated, validateUpdateAvailability, validate, availabilityController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin', 'owner']), validateAvailabilityId, validate, availabilityController.remove);

router.get("/boat/:boat_id", validateBoatId, validate, availabilityController.getBoatAvailabilities);

export default router;