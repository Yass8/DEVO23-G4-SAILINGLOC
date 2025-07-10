import express from "express";
import contractController from "../controllers/contract.controller.js";
import {
  validateContractId,
  validateReservationId,
  validateCreateContract,
  validateUpdateContract
} from "../validators/contract.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.get("/", contractController.index);
router.post("/new", validateCreateContract, validate, contractController.create);
router.get("/:id/show", validateContractId, validate, contractController.show);
router.put("/:id/edit", validateContractId, validateUpdateContract, validate, contractController.update);
router.delete("/:id/delete", validateContractId, validate, contractController.remove);
router.get("/reservation/:reservationId", validateReservationId, validate, contractController.getReservationContract);

export default router;