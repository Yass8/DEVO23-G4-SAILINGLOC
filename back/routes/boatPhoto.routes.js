import express from "express";
import boatPhotoController from "../controllers/boatPhoto.controller.js";
import {
  validateBoatPhotoId,
  validateBoatId,
  validateCreateBoatPhotos,
  validateUpdateBoatPhotos
} from "../validators/boatPhoto.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", boatPhotoController.index);
router.post("/new", validateCreateBoatPhotos, validate, boatPhotoController.create);
router.get("/:id/show", validateBoatPhotoId, validate, boatPhotoController.show);
router.put("/:id/edit", isAuthenticated, authorizeUser(['admin','owner']), validateBoatPhotoId, validateUpdateBoatPhotos, validate, boatPhotoController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin','owner']), validateBoatPhotoId, validate, boatPhotoController.remove);
router.get("/boat/:boatId", validateBoatId, validate, boatPhotoController.getBoatPhotos);

export default router;