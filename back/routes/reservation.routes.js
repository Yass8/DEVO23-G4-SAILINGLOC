import express from "express";
import reservationController from "../controllers/reservation.controller.js";
import {
  validateReservationId,
  validateUserId,
  validateBoatId,
  validateCreateReservation,
  validateUpdateReservation
} from "../validators/reservation.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", reservationController.index);
router.post("/new", validateCreateReservation, validate, reservationController.create);
router.get("/:id/show", validateReservationId, validate, reservationController.show);
router.put("/:id/edit", validateReservationId, validateUpdateReservation, validate, reservationController.update);
router.delete("/:id/delete", validateReservationId, validate, reservationController.remove);
router.get("/user/:userId", validateUserId, validate, reservationController.getUserBookings);
router.get("/boat/:boatId", validateBoatId, validate, reservationController.getBoatReservations);

export default router;