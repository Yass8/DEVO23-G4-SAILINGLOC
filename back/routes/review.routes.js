import express from "express";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", reviewController.index);
router.post("/new", reviewController.create);
router.get("/:id/show", reviewController.show);
router.put("/:id/edit", reviewController.update);
router.delete("/:id/delete", reviewController.remove);

// Routes spécifiques
router.get("/boat/:boatId", reviewController.getBoatReviews);
router.get("/user/:userId", reviewController.getUserReviews);

export default router;