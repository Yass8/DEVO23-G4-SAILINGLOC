import express from "express";
import contractController from "../controllers/contract.controller.js";
import {
  validateContractId,
  validateReservationId,
  validateUpdateContract
} from "../validators/contract.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";
const router = express.Router();

router.get("/", isAuthenticated, authorizeUser(['admin']), contractController.index);
router.post("/new", isAuthenticated, contractController.create);
router.get("/:id/show", isAuthenticated, validateContractId, validate, contractController.show);
router.put("/:id/edit", isAuthenticated, validateContractId, validateUpdateContract, validate, contractController.update);
router.delete("/:id/delete", isAuthenticated, validateContractId, validate, contractController.remove);
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, contractController.getReservationContract);

export default router;