import express from "express";
import portController from "../controllers/port.controller.js";

const router = express.Router();

router.get("/", portController.index);
router.post("/new", portController.create);
router.get("/:id/show", portController.show);
router.put("/:id/edit", portController.update);
router.delete("/:id/delete", portController.remove);

export default router;