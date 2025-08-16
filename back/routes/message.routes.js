import express from "express";
import messageController from "../controllers/message.controller.js";
import {
  validateMessageId,
  validateUserId,
  validateReservationId,
  validateCreateMessage
} from "../validators/message.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, messageController.index);
router.post("/new", isAuthenticated, validateCreateMessage, validate, messageController.create);
router.get("/:id/show", isAuthenticated, validateMessageId, validate, messageController.show);
router.put("/:id/edit", isAuthenticated, validateMessageId, validate, messageController.update);
router.delete("/:id/delete", isAuthenticated, validateMessageId, validate, messageController.remove);
router.get("/user/:userId", isAuthenticated, validateUserId, validate, messageController.getUserMessages);
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, messageController.getReservationMessages);

export default router;