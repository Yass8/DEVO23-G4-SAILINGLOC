import express from "express";
import boatEquipmentController from "../controllers/boatEquipment.controller.js";
import {
  validateBoatEquipmentId,
  validateBoatId,
  validateCreateBoatEquipment,
  validateUpdateBoatEquipment
} from "../validators/boatEquipment.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", boatEquipmentController.index);
router.post("/new", validateCreateBoatEquipment, validate, boatEquipmentController.create);
router.get("/:id/show", validateBoatEquipmentId, validate, boatEquipmentController.show);
router.put("/:id/edit", validateBoatEquipmentId, validateUpdateBoatEquipment, validate, boatEquipmentController.update);
router.delete("/:id/delete", validateBoatEquipmentId, validate, boatEquipmentController.remove);
router.get("/boat/:boatId", validateBoatId, validate, boatEquipmentController.getBoatEquipments);

export default router;