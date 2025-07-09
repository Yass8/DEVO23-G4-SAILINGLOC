import express from "express";
import boatEquipmentController from "../controllers/boatEquipment.controller.js";

const router = express.Router();

router.get("/", boatEquipmentController.index);
router.post("/new", boatEquipmentController.create);
router.get("/:id/show", boatEquipmentController.show);
router.put("/:id/edit", boatEquipmentController.update);
router.delete("/:id/delete", boatEquipmentController.remove);

// Route spécifique
router.get("/boat/:boatId", boatEquipmentController.getBoatEquipments);

export default router;