import express from "express";
import paymentController from "../controllers/payment.controller.js";
import {
  validatePaymentId,
  validateReservationId,
  validateCreatePayment,
  validateUpdatePayment
} from "../validators/payment.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, paymentController.index);
router.post("/new", isAuthenticated, validateCreatePayment, validate, paymentController.create);
router.get("/:id/show", isAuthenticated, validatePaymentId, validate, paymentController.show);
router.put("/:id/edit", isAuthenticated, validatePaymentId, validateUpdatePayment, validate, paymentController.update);
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin']), validatePaymentId, validate, paymentController.remove);
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, paymentController.getReservationPayments);

export default router;