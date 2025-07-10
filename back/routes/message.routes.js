import express from "express";
import messageController from "../controllers/message.controller.js";
import {
  validateMessageId,
  validateUserId,
  validateReservationId,
  validateCreateMessage
} from "../validators/message.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", messageController.index);
router.post("/new", validateCreateMessage, validate, messageController.create);
router.get("/:id/show", validateMessageId, validate, messageController.show);
router.put("/:id/edit", validateMessageId, validate, messageController.update);
router.delete("/:id/delete", validateMessageId, validate, messageController.remove);
router.get("/user/:userId", validateUserId, validate, messageController.getUserMessages);
router.get("/reservation/:reservationId", validateReservationId, validate, messageController.getReservationMessages);

export default router;