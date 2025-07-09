import express from "express";
import messageController from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", messageController.index);
router.post("/new", messageController.create);
router.get("/:id/show", messageController.show);
router.put("/:id/edit", messageController.update);
router.delete("/:id/delete", messageController.remove);

// Routes spécifiques
router.get("/user/:userId", messageController.getUserMessages);
router.get("/reservation/:reservationId", messageController.getReservationMessages);

export default router;