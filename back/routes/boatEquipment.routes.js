import express from "express";
import boatEquipmentController from "../controllers/boatEquipment.controller.js";
import {
  validateBoatEquipmentId,
  validateBoatId,
  validateCreateBoatEquipment,
  validateUpdateBoatEquipment
} from "../validators/boatEquipment.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BoatEquipments
 *   description: Gestion des équipements des bateaux
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:             # Si déjà défini globalement, supprime cette section
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     BoatEquipmentIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID de l'équipement de bateau
 *     BoatIdParam:
 *       in: path
 *       name: boatId
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID du bateau
 *   schemas:
 *     BoatEquipment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         boat_id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: "GPS traceur"
 *         category:
 *           type: string
 *           example: "Navigation"
 *         is_required:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BoatEquipmentCreateInput:
 *       type: object
 *       required:
 *         - boat_id
 *         - name
 *       properties:
 *         boat_id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: "Guindeau électrique"
 *         category:
 *           type: string
 *           example: "Mouillage"
 *         is_required:
 *           type: boolean
 *           example: false
 *     BoatEquipmentUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Guindeau électrique (neuf)"
 *         category:
 *           type: string
 *           example: "Mouillage"
 *         is_required:
 *           type: boolean
 *           example: true
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg: { type: string }
 *               param: { type: string }
 *               location: { type: string }
 */

/**
 * @swagger
 * /boat-equipments:
 *   get:
 *     summary: Lister tous les équipements de bateaux
 *     tags: [BoatEquipments]
 *     responses:
 *       200:
 *         description: Liste des équipements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/BoatEquipment' }
 */
router.get("/", boatEquipmentController.index);

/**
 * @swagger
 * /boat-equipments/new:
 *   post:
 *     summary: Créer un équipement pour un bateau
 *     tags: [BoatEquipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoatEquipmentCreateInput' }
 *     responses:
 *       201:
 *         description: Équipement créé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoatEquipment' }
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 */
router.post("/new", validateCreateBoatEquipment, validate, boatEquipmentController.create);

/**
 * @swagger
 * /boat-equipments/{id}/show:
 *   get:
 *     summary: Récupérer un équipement par son ID
 *     tags: [BoatEquipments]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatEquipmentIdParam'
 *     responses:
 *       200:
 *         description: Détails de l'équipement
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoatEquipment' }
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       404:
 *         description: Équipement non trouvé
 */
router.get("/:id/show", validateBoatEquipmentId, validate, boatEquipmentController.show);

/**
 * @swagger
 * /boat-equipments/{id}/edit:
 *   put:
 *     summary: Mettre à jour un équipement
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatEquipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BoatEquipmentIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BoatEquipmentUpdateInput' }
 *     responses:
 *       200:
 *         description: Équipement mis à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BoatEquipment' }
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Équipement non trouvé
 */
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatEquipmentId,
  validateUpdateBoatEquipment,
  validate,
  boatEquipmentController.update
);

/**
 * @swagger
 * /boat-equipments/{id}/delete:
 *   delete:
 *     summary: Supprimer un équipement
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatEquipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BoatEquipmentIdParam'
 *     responses:
 *       204:
 *         description: Équipement supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Équipement non trouvé
 */
router.delete(
  "/:id/delete",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatEquipmentId,
  validate,
  boatEquipmentController.remove
);

/**
 * @swagger
 * /boat-equipments/boat/{boatId}:
 *   get:
 *     summary: Lister les équipements d'un bateau
 *     tags: [BoatEquipments]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des équipements du bateau
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/BoatEquipment' }
 *       400:
 *         description: boatId invalide
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       404:
 *         description: Bateau ou équipements non trouvés
 */
router.get("/boat/:boatId", validateBoatId, validate, boatEquipmentController.getBoatEquipments);

export default router;