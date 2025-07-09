import express from "express";
import userDocumentController from "../controllers/userDocument.controller.js";

const router = express.Router();

router.get("/", userDocumentController.index);
router.post("/new/", userDocumentController.create);
router.get("/:id/show", userDocumentController.show);
router.put("/:id/edit", userDocumentController.update);
router.delete("/:id/delete", userDocumentController.remove);
router.get('/user/:userId/', userDocumentController.getUserDocuments);

export default router;
