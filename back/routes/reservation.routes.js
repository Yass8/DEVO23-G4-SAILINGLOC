import express from "express";
import reservationController from "../controllers/reservation.controller.js";
import {
  validateReservationId,
  validateUserId,
  validateBoatId,
  validateCreateReservation,
  validateUpdateReservation
} from "../validators/reservation.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Lister toutes les réservations
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       401:
 *         description: Non authentifié
 */
router.get("/", isAuthenticated, reservationController.index);

/**
 * @swagger
 * /reservations/new:
 *   post:
 *     summary: Créer une réservation
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [boat_id, user_id, start_date, end_date, total_price]
 *             properties:
 *               boat_id: { type: integer, example: 12 }
 *               user_id: { type: integer, example: 5 }
 *               start_date: { type: string, format: date-time, example: "2025-08-20T09:00:00Z" }
 *               end_date: { type: string, format: date-time, example: "2025-08-23T18:00:00Z" }
 *               total_price: { type: string, description: "Décimal", example: "749.90" }
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, validateCreateReservation, validate, reservationController.create);

/**
 * @swagger
 * /reservations/{id}/show:
 *   get:
 *     summary: Récupérer une réservation par son ID
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation non trouvée
 */
router.get("/:id/show", isAuthenticated, validateReservationId, validate, reservationController.show);

/**
 * @swagger
 * /reservations/{id}/edit:
 *   put:
 *     summary: Mettre à jour une réservation
 *     description: Requiert authentification.
 *     tags: [Reservations]
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
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation non trouvée
 */
router.put("/:id/edit", isAuthenticated, validateReservationId, validateUpdateReservation, validate, reservationController.update);

/**
 * @swagger
 * /reservations/{id}/delete:
 *   delete:
 *     summary: Supprimer une réservation
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Réservation supprimée
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation non trouvée
 */
router.delete("/:id/delete", isAuthenticated, validateReservationId, validate, reservationController.remove);

/**
 * @swagger
 * /reservations/user/{userId}:
 *   get:
 *     summary: Lister les réservations d'un utilisateur
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Réservations de l'utilisateur
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 */
router.get("/user/:userId", isAuthenticated, validateUserId, validate, reservationController.getUserBookings);

/**
 * @swagger
 * /reservations/boat/{boatId}:
 *   get:
 *     summary: Lister les réservations d'un bateau
 *     description: Requiert authentification.
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boatId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Réservations du bateau
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bateau ou réservations non trouvés
 */
router.get("/boat/:boatId", isAuthenticated, validateBoatId, validate, reservationController.getBoatReservations);

export default router;