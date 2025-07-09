import express from "express";
import reservationController from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/", reservationController.index);
router.post("/new", reservationController.create);
router.get("/:id/show", reservationController.show);
router.put("/:id/edit", reservationController.update);
router.delete("/:id/delete", reservationController.remove);

// Routes spécifiques
router.get("/user/:userId", reservationController.getUserBookings);
router.get("/boat/:boatId", reservationController.getBoatReservations);

export default router;