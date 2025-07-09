import express from "express";
import boatTypeController from "../controllers/boatType.controller.js";

const router = express.Router();

router.get("/", boatTypeController.index);
router.post("/new", boatTypeController.create);
router.get("/:id/show", boatTypeController.show);
router.put("/:id/edit", boatTypeController.update);
router.delete("/:id/delete", boatTypeController.remove);

export default router;