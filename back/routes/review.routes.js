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
import { isAuthenticated } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, reviewController.index);
router.post("/new", isAuthenticated, validateCreateReview, validate, reviewController.create);
router.get("/:id/show", isAuthenticated, validateReviewId, validate, reviewController.show);
router.put("/:id/edit", isAuthenticated, validateReviewId, validateUpdateReview, validate, reviewController.update);
router.delete("/:id/delete", isAuthenticated, validateReviewId, validate, reviewController.remove);
router.get("/boat/:boatId", isAuthenticated, validateBoatId, validate, reviewController.getBoatReviews);
router.get("/user/:userId", isAuthenticated, validateUserId, validate, reviewController.getUserReviews);

export default router;