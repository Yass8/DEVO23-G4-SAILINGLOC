import express from "express";
import boatEquipmentController from "../controllers/boatEquipment.controller.js";
import {
  validateBoatEquipmentId,
  validateBoatId,
  validateCreateBoatEquipment,
  validateUpdateBoatEquipment
} from "../validators/boatEquipment.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", boatEquipmentController.index);
router.post("/new", validateCreateBoatEquipment, validate, boatEquipmentController.create);
router.get("/:id/show", validateBoatEquipmentId, validate, boatEquipmentController.show);
router.put("/:id/edit", isAuthenticated, authorizeUser(['admin', 'owner']), validateBoatEquipmentId, validateUpdateBoatEquipment, validate, boatEquipmentController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin', 'owner']), validateBoatEquipmentId, validate, boatEquipmentController.remove);
router.get("/boat/:boatId", validateBoatId, validate, boatEquipmentController.getBoatEquipments);
router.post("/boat/:boatId/sync", isAuthenticated, authorizeUser(['admin', 'owner']), boatEquipmentController.syncEquipments);
export default router;