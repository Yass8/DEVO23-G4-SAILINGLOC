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
import { isAuthenticated } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, reservationController.index);
router.post("/new", isAuthenticated, validateCreateReservation, validate, reservationController.create);
router.get("/:id/show", isAuthenticated, validateReservationId, validate, reservationController.show);
router.get("/:reference", isAuthenticated, reservationController.showByReference);
router.put("/:id/edit", isAuthenticated, validateReservationId, validateUpdateReservation, validate, reservationController.update);
router.delete("/:id/delete", isAuthenticated, validateReservationId, validate, reservationController.remove);
router.get("/user/:userId", isAuthenticated, validateUserId, validate, reservationController.getUserBookings);
router.get("/boat/:boat_id", isAuthenticated, validateBoatId, validate, reservationController.getBoatReservations);

export default router;