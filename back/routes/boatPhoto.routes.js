import express from "express";
import boatPhotoController from "../controllers/boatPhoto.controller.js";
import {
  validateBoatPhotoId,
  validateBoatId,
  validateCreateBoatPhotos,
  validateUpdateBoatPhotos
} from "../validators/boatPhoto.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BoatPhotos
 *   description: Gestion des photos des bateaux
 */

/**
 * @swagger
 * /boat-photos:
 *   get:
 *     summary: Lister tous les enregistrements de photos
 *     tags: [BoatPhotos]
 *     responses:
 *       200:
 *         description: Liste des enregistrements de photos
 */
router.get("/", boatPhotoController.index);

/**
 * @swagger
 * /boat-photos/new:
 *   post:
 *     summary: Créer un enregistrement de photos pour un bateau
 *     tags: [BoatPhotos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [boat_id, mainIndex]
 *             properties:
 *               boat_id:
 *                 type: integer
 *                 example: 12
 *               mainIndex:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *     responses:
 *       201:
 *         description: Enregistrement créé
 *       400:
 *         description: Erreur de validation
 */
router.post("/new", validateCreateBoatPhotos, validate, boatPhotoController.create);

/**
 * @swagger
 * /boat-photos/{id}/show:
 *   get:
 *     summary: Récupérer un enregistrement de photos par son ID
 *     tags: [BoatPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails des photos
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Enregistrement non trouvé
 */
router.get("/:id/show", validateBoatPhotoId, validate, boatPhotoController.show);

/**
 * @swagger
 * /boat-photos/{id}/edit:
 *   put:
 *     summary: Mettre à jour un enregistrement de photos
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatPhotos]
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
 *               boat_id:
 *                 type: integer
 *                 example: 12
 *               mainIndex:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1
 *     responses:
 *       200:
 *         description: Enregistrement mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Enregistrement non trouvé
 */
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatPhotoId,
  validateUpdateBoatPhotos,
  validate,
  boatPhotoController.update
);

/**
 * @swagger
 * /boat-photos/{id}/delete:
 *   delete:
 *     summary: Supprimer un enregistrement de photos
 *     description: Requiert un token (rôles **admin** ou **owner**).
 *     tags: [BoatPhotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Enregistrement supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (rôle insuffisant)
 *       404:
 *         description: Enregistrement non trouvé
 */
router.delete(
  "/:id/delete",
  isAuthenticated,
  authorizeUser(['admin', 'owner']),
  validateBoatPhotoId,
  validate,
  boatPhotoController.remove
);

/**
 * @swagger
 * /boat-photos/boat/{boatId}:
 *   get:
 *     summary: Récupérer les photos d'un bateau
 *     tags: [BoatPhotos]
 *     parameters:
 *       - in: path
 *         name: boatId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Photos du bateau
 *       400:
 *         description: Paramètre invalide
 *       404:
 *         description: Bateau ou photos non trouvés
 */
router.get("/boat/:boatId", validateBoatId, validate, boatPhotoController.getBoatPhotos);

export default router;