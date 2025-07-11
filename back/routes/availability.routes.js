import express from "express";
import availabilityController from "../controllers/availability.controller.js";

import { validate } from "../middlewares/validate.js";
import {
    validateAvailabilityId,
    validateBoatId,
    validateCreateAvailability,
    validateUpdateAvailability
} from '../validators/availability.validator.js';

const router = express.Router();

router.get("/", availabilityController.index);
router.post("/new", validateCreateAvailability, validate, availabilityController.create);
router.get("/:id/show", validateAvailabilityId, validate, validateAvailabilityId, validate, availabilityController.show);
router.put("/:id/edit", validateUpdateAvailability, validate, availabilityController.update);
router.delete("/:id/delete", validateAvailabilityId, validate, availabilityController.remove);

// Route spécifique
router.get("/boat/:boatId", validateBoatId, validate, availabilityController.getBoatAvailabilities);

export default router;