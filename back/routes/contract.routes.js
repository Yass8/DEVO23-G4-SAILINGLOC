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

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: Gestion des contrats de location
 */

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Lister tous les contrats
 *     description: Requiert un token avec rôle **admin**.
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contrats
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.get("/", isAuthenticated, authorizeUser(['admin']), contractController.index);

/**
 * @swagger
 * /contracts/new:
 *   post:
 *     summary: Créer un contrat
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservation_id, contract_url]
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 123
 *               contract_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://cdn.example.com/contracts/ctr-123.pdf"
 *     responses:
 *       201:
 *         description: Contrat créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, contractController.create);

/**
 * @swagger
 * /contracts/{id}/show:
 *   get:
 *     summary: Récupérer un contrat par son ID
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du contrat
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Contrat non trouvé
 */
router.get("/:id/show", isAuthenticated, validateContractId, validate, contractController.show);

/**
 * @swagger
 * /contracts/{id}/edit:
 *   put:
 *     summary: Mettre à jour un contrat
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner_signature:
 *                 type: boolean
 *                 example: true
 *               renter_signature:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Contrat mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Contrat non trouvé
 */
router.put("/:id/edit", isAuthenticated, validateContractId, validateUpdateContract, validate, contractController.update);

/**
 * @swagger
 * /contracts/{id}/delete:
 *   delete:
 *     summary: Supprimer un contrat
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Contrat supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Contrat non trouvé
 */
router.delete("/:id/delete", isAuthenticated, validateContractId, validate, contractController.remove);

/**
 * @swagger
 * /contracts/reservation/{reservationId}:
 *   get:
 *     summary: Récupérer le contrat associé à une réservation
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contrat de la réservation
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation ou contrat non trouvé
 */
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, contractController.getReservationContract);

export default router;