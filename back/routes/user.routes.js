import express from "express";
import userController from "../controllers/user.controller.js";
import {
  validateUserId,
  validateCreateUser,
  validateUpdateUser
} from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";
const router = express.Router();

router.get("/", userController.index);
router.post("/new", validateCreateUser, validate, userController.create);
router.get("/:id/show", validateUserId, validate, userController.show);
router.put("/:id/edit", validateUserId, validateUpdateUser, validate, userController.update);
router.delete("/:id/delete", validateUserId, validate, userController.remove);

router.get("/:id/boats", validateUserId, validate, userController.getUserBoats);
router.get("/:id/reservations", validateUserId, validate, userController.getUserReservations);
router.get("/:id/messages", validateUserId, validate, userController.getUserMessages);
router.get("/:id/reviews", validateUserId, validate, userController.getUserReviews);
router.get("/:id/documents", validateUserId, validate, userController.getUserDocuments);

export default router;