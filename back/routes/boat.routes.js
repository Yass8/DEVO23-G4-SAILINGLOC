import express from "express";
import boatController from "../controllers/boat.controller.js";

const router = express.Router();

router.get("/", boatController.index);
router.post("/new", boatController.create);
router.get("/:id/show", boatController.show);
router.put("/:id/edit", boatController.update);
router.delete("/:id/delete", boatController.remove);

// Routes spécifiques
router.get("/:id/photos", boatController.getBoatPhotos);
router.get("/:id/equipments", boatController.getBoatEquipments);
router.get("/:id/availabilities", boatController.getBoatAvailabilities);
router.get("/:id/reviews", boatController.getBoatReviews);
router.get("/:id/reservations", boatController.getBoatReservations);

export default router;