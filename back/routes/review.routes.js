import express from "express";
import reviewController from "../controllers/review.controller.js";
import {
  validateReviewId,
  validateBoatId,
  validateUserId,
  validateCreateReview,
  validateUpdateReview
} from "../validators/review.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gestion des avis (notes/commentaires) liés aux réservations/bateaux/utilisateurs
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Lister tous les avis
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des avis
 *       401:
 *         description: Non authentifié
 */
router.get("/", isAuthenticated, reviewController.index);

/**
 * @swagger
 * /reviews/new:
 *   post:
 *     summary: Créer un avis
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reservation_id, rating]
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 345
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Bateau impeccable, propriétaire très réactif."
 *     responses:
 *       201:
 *         description: Avis créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, validateCreateReview, validate, reviewController.create);

/**
 * @swagger
 * /reviews/{id}/show:
 *   get:
 *     summary: Récupérer un avis par son ID
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de l'avis
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Avis non trouvé
 */
router.get("/:id/show", isAuthenticated, validateReviewId, validate, reviewController.show);

/**
 * @swagger
 * /reviews/{id}/edit:
 *   put:
 *     summary: Mettre à jour un avis (ex. réponse du propriétaire)
 *     description: Requiert authentification.
 *     tags: [Reviews]
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
 *               response:
 *                 type: string
 *                 example: "Merci pour votre retour, au plaisir de vous revoir à bord !"
 *     responses:
 *       200:
 *         description: Avis mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Avis non trouvé
 */
router.put("/:id/edit", isAuthenticated, validateReviewId, validateUpdateReview, validate, reviewController.update);

/**
 * @swagger
 * /reviews/{id}/delete:
 *   delete:
 *     summary: Supprimer un avis
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Avis supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Avis non trouvé
 */
router.delete("/:id/delete", isAuthenticated, validateReviewId, validate, reviewController.remove);

/**
 * @swagger
 * /reviews/boat/{boatId}:
 *   get:
 *     summary: Lister les avis d'un bateau
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boatId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des avis du bateau
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bateau ou avis non trouvés
 */
router.get("/boat/:boatId", isAuthenticated, validateBoatId, validate, reviewController.getBoatReviews);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Lister les avis d'un utilisateur (auteur ou destinataire)
 *     description: Requiert authentification.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des avis de l'utilisateur
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 */
router.get("/user/:userId", isAuthenticated, validateUserId, validate, reviewController.getUserReviews);

export default router;