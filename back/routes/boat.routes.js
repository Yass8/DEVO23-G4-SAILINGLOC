import express from "express";
import boatController from "../controllers/boat.controller.js";
import {
  validateBoatId,
  validateCreateBoat,
  validateUpdateBoat,
  validateBoatSlug
} from "../validators/boat.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

router.get("/:slug/details", validateBoatSlug, validate, boatController.showBySlug);
/**
 * @swagger
 * tags:
 *   name: Boats
 *   description: Opérations liées aux bateaux
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:        # Si déjà défini ailleurs, vous pouvez supprimer cette section
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   parameters:
 *     BoatIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID du bateau
 *   schemas:
 *     Boat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         reference:
 *           type: string
 *           example: SL-VOIL-2025-0001
 *         name:
 *           type: string
 *           example: Océanis 38.1
 *         brand:
 *           type: string
 *           example: Beneteau
 *         length:
 *           type: number
 *           format: float
 *           example: 11.5
 *         daily_price:
 *           type: string
 *           description: Décimal au format string (ex. Sequelize)
 *           example: "249.90"
 *         user_id:
 *           type: integer
 *           example: 5
 *         port_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         type_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         description:
 *           type: string
 *           example: "Voilier confortable pour croisière côtière."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BoatCreateInput:
 *       type: object
 *       required:
 *         - reference
 *         - name
 *         - brand
 *         - length
 *         - daily_price
 *         - user_id
 *       properties:
 *         reference:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           example: SL-VOIL-2025-0001
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Océanis 38.1
 *         brand:
 *           type: string
 *           maxLength: 255
 *           example: Beneteau
 *         length:
 *           type: number
 *           format: float
 *           minimum: 0
 *           exclusiveMinimum: true
 *           example: 11.5
 *         daily_price:
 *           type: string
 *           description: décimal
 *           example: "249.90"
 *         user_id:
 *           type: integer
 *           example: 5
 *         port_id:
 *           type: integer
 *           example: 3
 *         type_id:
 *           type: integer
 *           example: 2
 *     BoatUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 255
 *           example: Océanis 38.1 (Refit 2024)
 *         description:
 *           type: string
 *           example: "Ajout spi asymétrique, électronique neuve."
 *         daily_price:
 *           type: string
 *           example: "279.00"
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
 * /boats:
 *   get:
 *     summary: Lister tous les bateaux
 *     tags: [Boats]
 *     responses:
 *       200:
 *         description: Liste des bateaux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Boat'
 */
router.get("/", boatController.index);

/**
 * @swagger
 * /boats/new:
 *   post:
 *     summary: Créer un bateau
 *     tags: [Boats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoatCreateInput'
 *     responses:
 *       201:
 *         description: Bateau créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/new", boatController.create);

/**
 * @swagger
 * /boats/{id}/show:
 *   get:
 *     summary: Récupérer un bateau par son ID
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Détails du bateau
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       400:
 *         description: Erreur de validation (ID invalide)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/show", validateBoatId, validate, boatController.show);

/**
 * @swagger
 * /boats/{id}/edit:
 *   put:
 *     summary: Mettre à jour un bateau
 *     description: Requiert un token (rôles **owner** ou **admin**).
 *     tags: [Boats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoatUpdateInput'
 *     responses:
 *       200:
 *         description: Bateau mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boat'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Bateau non trouvé
 */
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeUser(["owner", "admin"]),
  validateBoatId,
  validateUpdateBoat,
  validate,
  boatController.update
);

/**
 * @swagger
 * /boats/{id}/delete:
 *   delete:
 *     summary: Supprimer un bateau
 *     description: Requiert un token (rôles **owner** ou **admin**).
 *     tags: [Boats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       204:
 *         description: Bateau supprimé
 *       400:
 *         description: Erreur de validation (ID invalide)
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Bateau non trouvé
 */
router.delete(
  "/:id/delete",
  isAuthenticated,
  authorizeUser(["owner", "admin"]),
  validateBoatId,
  validate,
  boatController.remove
);

/**
 * @swagger
 * /boats/{id}/photos:
 *   get:
 *     summary: Récupérer les photos d'un bateau
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des photos
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/photos", validateBoatId, validate, boatController.getBoatPhotos);

/**
 * @swagger
 * /boats/{id}/equipments:
 *   get:
 *     summary: Récupérer les équipements d'un bateau
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des équipements
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/equipments", validateBoatId, validate, boatController.getBoatEquipments);

/**
 * @swagger
 * /boats/{id}/availabilities:
 *   get:
 *     summary: Récupérer les disponibilités d'un bateau
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des disponibilités
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/availabilities", validateBoatId, validate, boatController.getBoatAvailabilities);

/**
 * @swagger
 * /boats/{id}/reviews:
 *   get:
 *     summary: Récupérer les avis d'un bateau
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des avis
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/reviews", validateBoatId, validate, boatController.getBoatReviews);

/**
 * @swagger
 * /boats/{id}/reservations:
 *   get:
 *     summary: Récupérer les réservations d'un bateau
 *     tags: [Boats]
 *     parameters:
 *       - $ref: '#/components/parameters/BoatIdParam'
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Bateau non trouvé
 */
router.get("/:id/reservations", validateBoatId, validate, boatController.getBoatReservations);
router.get("/filters", boatController.getFilteredBoats);

export default router;