import express from "express";
import availabilityController from "../controllers/availability.controller.js";

import { validate } from "../middlewares/validate.js";
import {
  validateAvailabilityId,
  validateBoatId,
  validateCreateAvailability,
  validateUpdateAvailability
} from '../validators/availability.validator.js';
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Availabilities
 *   description: Gestion des disponibilités des bateaux
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:        # Si déjà défini globalement, supprime cette section
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     AvailabilityIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID de la disponibilité
 *     BoatIdParam:
 *       in: path
 *       name: boatId
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID du bateau
 *   schemas:
 *     Availability:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 42
 *         boat_id:
 *           type: integer
 *           example: 12
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-01T09:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-07T18:00:00Z"
 *         status:
 *           type: string
 *           enum: [available, booked, maintenance]
 *           example: "available"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AvailabilityCreateInput:
 *       type: object
 *       required:
 *         - boat_id
 *         - start_date
 *         - end_date
 *       properties:
 *         boat_id:
 *           type: integer
 *           example: 12
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-01T09:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-07T18:00:00Z"
 *         status:
 *           type: string
 *           enum: [available, booked, maintenance]
 *           example: "available"
 *     AvailabilityUpdateInput:
 *       type: object
 *       properties:
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-02T09:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2025-07-08T18:00:00Z"
 *         status:
 *           type: string
 *           enum: [available, booked, maintenance]
 *           example: "maintenance"
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */

/**
 * @swagger
 * /availabilities:
 *   get:
 *     summary: Lister toutes les disponibilités
 *     tags: [Availabilities]
 *     responses:
 *       200:
 *         description: Liste des disponibilités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Availability'
 */
router.get("/", availabilityController.index);

/**
 * @swagger
 * /availabilities/new:
 *   post:
 *     summary: Créer une disponibilité
 *     tags: [Availabilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityCreateInput'
 *     responses:
 *       201:
 *         description: Disponibilité créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Availability'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/new", validateCreateAvailability, validate, availabilityController.create);

/**
 * @swagger
 * /availabilities/{id}/show:
 *   get:
 *     summary: Récupérer une disponibilité par son ID
 *     tags: [Availabilities]
 *     parameters:
 *       - $ref: '#/components/parameters/AvailabilityIdParam'
 *     responses:
 *       200:
 *         description: Détails de la disponibilité
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Availability'
 *       400:
 *         description: Erreur de validation (ID invalide)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Disponibilité non trouvée
 */
router.get("/:id/show", validateAvailabilityId, validate, validateAvailabilityId, validate, availabilityController.show);

/**
 * @swagger
 * /availabilities/{id}/edit:
 *   put:
 *     summary: Mettre à jour une disponibilité
 *     description: Requiert un token.
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AvailabilityIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityUpdateInput'
 *     responses:
 *       200:
 *         description: Disponibilité mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Availability'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Disponibilité non trouvée
 */
router.put("/:id/edit", isAuthenticated, validateUpdateAvailability, validate, availabilityController.update);

/**
 * @swagger
 * /availabilities/{id}/delete:
 *   delete:
 *     summary: Supprimer une disponibilité
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [Availabilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/AvailabilityIdParam'
 *     responses:
 *       204:
 *         description: Disponibilité supprimée
 *       400:
 *         description: Erreur de validation (ID invalide)
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Disponibilité non trouvée
 */
router.delete("/:id/delete",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateAvailabilityId,
  validate,
  availabilityController.remove
);

/**
 * @swagger
 * /availabilities/boat/{boatId}:
 *   get:
 *     summary: Lister les disponibilités d'un bateau
 *     tags: [Availabilities]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des disponibilités du bateau
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Availability'
 *       400:
 *         description: Erreur de validation (boatId invalide)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Bateau ou disponibilités non trouvés
 */
router.get("/boat/:boat_id", validateBoatId, validate, availabilityController.getBoatAvailabilities);

export default router;