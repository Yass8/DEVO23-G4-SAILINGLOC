import express from "express";
import boatTypeController from "../controllers/boatType.controller.js";
import {
  validateBoatTypeId,
  validateCreateBoatType,
  validateUpdateBoatType
} from "../validators/boatType.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BoatTypes
 *   description: Gestion des types de bateaux
 */

/**
 * @swagger
 * /boat-types:
 *   get:
 *     summary: Lister tous les types de bateaux
 *     tags: [BoatTypes]
 *     responses:
 *       200:
 *         description: Liste des types de bateaux
 */
router.get("/", boatTypeController.index);

/**
 * @swagger
 * /boat-types/new:
 *   post:
 *     summary: Créer un type de bateau
 *     tags: [BoatTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Voilier"
 *               photo_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://cdn.example.com/types/voilier.jpg"
 *     responses:
 *       201:
 *         description: Type créé
 *       400:
 *         description: Erreur de validation
 */
router.post("/new", validateCreateBoatType, validate, boatTypeController.create);

/**
 * @swagger
 * /boat-types/{id}/show:
 *   get:
 *     summary: Récupérer un type de bateau par son ID
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du type
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Type non trouvé
 */
router.get(
  "/:id/show",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatTypeId,
  validate,
  boatTypeController.show
);

/**
 * @swagger
 * /boat-types/{id}/edit:
 *   put:
 *     summary: Mettre à jour un type de bateau
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatTypes]
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
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Catamaran"
 *               photo_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://cdn.example.com/types/catamaran.jpg"
 *     responses:
 *       200:
 *         description: Type mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Type non trouvé
 */
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatTypeId,
  validateUpdateBoatType,
  validate,
  boatTypeController.update
);

/**
 * @swagger
 * /boat-types/{id}/delete:
 *   delete:
 *     summary: Supprimer un type de bateau
 *     tags: [BoatTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Type supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Type non trouvé
 */
router.delete(
  "/:id/delete",
  validateBoatTypeId,
  validate,
  boatTypeController.remove
);

export default router;