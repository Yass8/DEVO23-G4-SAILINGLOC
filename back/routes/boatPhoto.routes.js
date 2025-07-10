import express from "express";
import boatPhotoController from "../controllers/boatPhoto.controller.js";
import {
  validateBoatPhotoId,
  validateBoatId,
  validateCreateBoatPhoto,
  validateUpdateBoatPhoto
} from "../validators/boatPhoto.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", boatPhotoController.index);
router.post("/new", validateCreateBoatPhoto, validate, boatPhotoController.create);
router.get("/:id/show", validateBoatPhotoId, validate, boatPhotoController.show);
router.put("/:id/edit", validateBoatPhotoId, validateUpdateBoatPhoto, validate, boatPhotoController.update);
router.delete("/:id/delete", validateBoatPhotoId, validate, boatPhotoController.remove);
router.get("/boat/:boatId", validateBoatId, validate, boatPhotoController.getBoatPhotos);

export default router;