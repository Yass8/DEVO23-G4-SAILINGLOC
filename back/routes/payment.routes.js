import express from "express";
import paymentController from "../controllers/payment.controller.js";
import {
  validatePaymentId,
  validateReservationId,
  validateCreatePayment,
  validateUpdatePayment
} from "../validators/payment.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", paymentController.index);
router.post("/new", validateCreatePayment, validate, paymentController.create);
router.get("/:id/show", validatePaymentId, validate, paymentController.show);
router.put("/:id/edit", validatePaymentId, validateUpdatePayment, validate, paymentController.update);
router.delete("/:id/delete", validatePaymentId, validate, paymentController.remove);
router.get("/reservation/:reservationId", validateReservationId, validate, paymentController.getReservationPayments);

export default router;