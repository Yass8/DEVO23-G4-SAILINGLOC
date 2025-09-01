import express from "express";
import boatController from "../controllers/boat.controller.js";
import {
  validateBoatId,
  validateCreateBoat,
  validateUpdateBoat
} from "../validators/boat.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", boatController.index);
router.post("/new", validateCreateBoat, validate, boatController.create);
router.get("/:id/show", validateBoatId, validate, boatController.show);
router.put("/:id/edit", isAuthenticated, authorizeUser(['owner', 'admin']), validateBoatId, validateUpdateBoat, validate, boatController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['owner', 'admin']), validateBoatId, validate, boatController.remove);

router.get("/:id/photos", validateBoatId, validate, boatController.getBoatPhotos);
router.get("/:id/equipments", validateBoatId, validate, boatController.getBoatEquipments);
router.get("/:id/availabilities", validateBoatId, validate, boatController.getBoatAvailabilities);
router.get("/:id/reviews", validateBoatId, validate, boatController.getBoatReviews);
router.get("/:id/reservations", validateBoatId, validate, boatController.getBoatReservations);

export default router;