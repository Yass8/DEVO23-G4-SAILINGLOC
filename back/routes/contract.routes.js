import express from "express";
import contractController from "../controllers/contract.controller.js";

const router = express.Router();

router.get("/", contractController.index);
router.post("/new", contractController.create);
router.get("/:id/show", contractController.show);
router.put("/:id/edit", contractController.update);
router.delete("/:id/delete", contractController.remove);

// Route spécifique
router.get("/reservation/:reservationId", contractController.getReservationContract);

export default router;