import express from "express";
import paymentController from "../controllers/payment.controller.js";
import {
  validatePaymentId,
  validateReservationId,
  validateCreatePayment,
  validateUpdatePayment
} from "../validators/payment.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements liés aux réservations
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lister tous les paiements
 *     description: Requiert authentification.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des paiements
 *       401:
 *         description: Non authentifié
 */
router.get("/", isAuthenticated, paymentController.index);

/**
 * @swagger
 * /payments/new:
 *   post:
 *     summary: Créer un paiement
 *     description: Requiert authentification.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservation_id, amount, method, commission_amount]
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 123
 *               amount:
 *                 type: string
 *                 description: Décimal
 *                 example: "250.00"
 *               method:
 *                 type: string
 *                 enum: [credit_card, paypal, bank_transfer]
 *                 example: credit_card
 *               commission_amount:
 *                 type: string
 *                 description: Décimal (commission SailingLoc)
 *                 example: "25.00"
 *     responses:
 *       201:
 *         description: Paiement créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, validateCreatePayment, validate, paymentController.create);

/**
 * @swagger
 * /payments/{id}/show:
 *   get:
 *     summary: Récupérer un paiement par son ID
 *     description: Requiert authentification.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du paiement
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Paiement non trouvé
 */
router.get("/:id/show", isAuthenticated, validatePaymentId, validate, paymentController.show);

/**
 * @swagger
 * /payments/{id}/edit:
 *   put:
 *     summary: Mettre à jour un paiement
 *     description: Requiert authentification.
 *     tags: [Payments]
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
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Paiement mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Paiement non trouvé
 */
router.put("/:id/edit", isAuthenticated, validatePaymentId, validateUpdatePayment, validate, paymentController.update);

/**
 * @swagger
 * /payments/{id}/delete:
 *   delete:
 *     summary: Supprimer un paiement
 *     description: Requiert authentification avec rôle **admin**.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Paiement supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Paiement non trouvé
 */
router.delete("/:id/delete", isAuthenticated, authorizeUser(['admin']), validatePaymentId, validate, paymentController.remove);

/**
 * @swagger
 * /payments/reservation/{reservationId}:
 *   get:
 *     summary: Lister les paiements d'une réservation
 *     description: Requiert authentification.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des paiements de la réservation
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation ou paiements non trouvés
 */
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, paymentController.getReservationPayments);

export default router;