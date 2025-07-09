import express from "express";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", userController.index);
router.post("/new", userController.create);
router.get("/:id/show", userController.show);
router.put("/:id/edit", userController.update);
router.delete("/:id/delete", userController.remove);

// Routes spécifiques
router.get("/:id/boats", userController.getUserBoats);
router.get("/:id/reservations", userController.getUserReservations);
router.get("/:id/messages", userController.getUserMessages);
router.get("/:id/reviews", userController.getUserReviews);
router.get("/:id/documents", userController.getUserDocuments);

export default router;