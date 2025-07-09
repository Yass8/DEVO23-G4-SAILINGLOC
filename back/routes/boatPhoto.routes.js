import express from "express";
import boatPhotoController from "../controllers/boatPhoto.controller.js";

const router = express.Router();

router.get("/", boatPhotoController.index);
router.post("/new", boatPhotoController.create);
router.get("/:id/show", boatPhotoController.show);
router.put("/:id/edit", boatPhotoController.update);
router.delete("/:id/delete", boatPhotoController.remove);

// Route spécifique
router.get("/boat/:boatId", boatPhotoController.getBoatPhotos);

export default router;