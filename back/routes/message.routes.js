import express from "express";
import messageController from "../controllers/message.controller.js";
import {
  validateMessageId,
  validateUserId,
  validateReservationId,
  validateCreateMessage
} from "../validators/message.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messagerie entre utilisateurs (liée éventuellement à une réservation)
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Lister tous les messages (scopé par la politique du contrôleur)
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 *       401:
 *         description: Non authentifié
 */
router.get("/", isAuthenticated, messageController.index);

/**
 * @swagger
 * /messages/new:
 *   post:
 *     summary: Envoyer un message
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sender_id, receiver_id, content]
 *             properties:
 *               sender_id:
 *                 type: integer
 *                 example: 5
 *               receiver_id:
 *                 type: integer
 *                 example: 12
 *               content:
 *                 type: string
 *                 example: "Bonjour, votre bateau est-il disponible ce week-end ?"
 *               reservation_id:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Message créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, validateCreateMessage, validate, messageController.create);

/**
 * @swagger
 * /messages/{id}/show:
 *   get:
 *     summary: Récupérer un message par son ID
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du message
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Message non trouvé
 */
router.get("/:id/show", isAuthenticated, validateMessageId, validate, messageController.show);

/**
 * @swagger
 * /messages/{id}/edit:
 *   put:
 *     summary: Mettre à jour un message
 *     description: Requiert authentification.
 *     tags: [Messages]
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
 *               content:
 *                 type: string
 *                 example: "Mise à jour du contenu du message."
 *     responses:
 *       200:
 *         description: Message mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Message non trouvé
 */
router.put("/:id/edit", isAuthenticated, validateMessageId, validate, messageController.update);

/**
 * @swagger
 * /messages/{id}/delete:
 *   delete:
 *     summary: Supprimer un message
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Message supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Message non trouvé
 */
router.delete("/:id/delete", isAuthenticated, validateMessageId, validate, messageController.remove);

/**
 * @swagger
 * /messages/user/{userId}:
 *   get:
 *     summary: Lister les messages d'un utilisateur
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des messages de l'utilisateur
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 */
router.get("/user/:userId", isAuthenticated, validateUserId, validate, messageController.getUserMessages);

/**
 * @swagger
 * /messages/reservation/{reservationId}:
 *   get:
 *     summary: Lister les messages associés à une réservation
 *     description: Requiert authentification.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des messages de la réservation
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation ou messages non trouvés
 */
router.get("/reservation/:reservationId", isAuthenticated, validateReservationId, validate, messageController.getReservationMessages);

export default router;