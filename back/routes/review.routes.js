import express from "express";
import reviewController from "../controllers/review.controller.js";
import {
  validateReviewId,
  validateBoatId,
  validateUserId,
  validateCreateReview,
  validateUpdateReview
} from "../validators/review.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", reviewController.index);
router.post("/new", validateCreateReview, validate, reviewController.create);
router.get("/:id/show", validateReviewId, validate, reviewController.show);
router.put("/:id/edit", validateReviewId, validateUpdateReview, validate, reviewController.update);
router.delete("/:id/delete", validateReviewId, validate, reviewController.remove);
router.get("/boat/:boatId", validateBoatId, validate, reviewController.getBoatReviews);
router.get("/user/:userId", validateUserId, validate, reviewController.getUserReviews);

export default router;