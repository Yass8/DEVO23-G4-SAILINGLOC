import express from "express";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/", paymentController.index);
router.post("/new", paymentController.create);
router.get("/:id/show", paymentController.show);
router.put("/:id/edit", paymentController.update);
router.delete("/:id/delete", paymentController.remove);

// Route spécifique
router.get("/reservation/:reservationId", paymentController.getReservationPayments);

export default router;