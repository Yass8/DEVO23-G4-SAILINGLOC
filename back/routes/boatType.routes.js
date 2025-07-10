import express from "express";
import boatTypeController from "../controllers/boatType.controller.js";
import {
  validateBoatTypeId,
  validateCreateBoatType,
  validateUpdateBoatType
} from "../validators/boatType.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", boatTypeController.index);
router.post("/new", validateCreateBoatType, validate, boatTypeController.create);
router.get("/:id/show", validateBoatTypeId, validate, boatTypeController.show);
router.put("/:id/edit", validateBoatTypeId, validateUpdateBoatType, validate, boatTypeController.update);
router.delete("/:id/delete", validateBoatTypeId, validate, boatTypeController.remove);

export default router;