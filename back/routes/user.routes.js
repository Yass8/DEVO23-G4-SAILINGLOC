import express from "express";
import userController from "../controllers/user.controller.js";
import {
  validateUserId,
  validateCreateUser,
  validateUpdateUser
} from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/", userController.index);

/**
 * @swagger
 * /users/new:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, lastname, email, password, role]
 *             properties:
 *               firstname: { type: string, example: "Jean" }
 *               lastname: { type: string, example: "Dupont" }
 *               email: { type: string, format: email, example: "jean.dupont@example.com" }
 *               password: { type: string, example: "MotDePasseSûr123" }
 *               role:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["user"]
 *               phone: { type: string, example: "+33 6 12 34 56 78" }
 *               payment_method: { type: string, example: "credit_card" }
 *               photo: { type: string, example: "https://cdn.example.com/u/1.jpg" }
 *               address: { type: string, example: "10 rue de la Mer, 17000 La Rochelle" }
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */
router.post("/new", validateCreateUser, validate, userController.create);

/**
 * @swagger
 * /users/{id}/show:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id/show", validateUserId, validate, userController.show);

/**
 * @swagger
 * /users/{id}/edit:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
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
 *               firstname: { type: string, example: "Jean" }
 *               lastname: { type: string, example: "Durand" }
 *               email: { type: string, format: email, example: "jean.durand@example.com" }
 *               password: { type: string, example: "NouveauMotDePasse123" }
 *               role:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["owner"]
 *               phone: { type: string, example: "+33 6 98 76 54 32" }
 *               payment_method: { type: string, example: "paypal" }
 *               photo: { type: string, example: "https://cdn.example.com/u/1-new.jpg" }
 *               address: { type: string, example: "15 quai des Voiliers, 13000 Marseille" }
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put("/:id/edit", validateUserId, validateUpdateUser, validate, userController.update);

/**
 * @swagger
 * /users/{id}/delete:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:id/delete", validateUserId, validate, userController.remove);

/**
 * @swagger
 * /users/{id}/photo:
 *   put:
 *     summary: Mettre à jour la photo de l'utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 example: "https://cdn.example.com/u/1.jpg"
 *     responses:
 *       200:
 *         description: Photo mise à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put("/:id/photo", validateUserId, validate, userController.uploadPhoto);

/**
 * @swagger
 * /users/{id}/boats:
 *   get:
 *     summary: Lister les bateaux d'un utilisateur (propriétaire)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des bateaux de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur ou bateaux non trouvés
 */
router.get("/:id/boats", validateUserId, validate, userController.getUserBoats);

/**
 * @swagger
 * /users/{id}/reservations:
 *   get:
 *     summary: Lister les réservations d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur ou réservations non trouvés
 */
router.get("/:id/reservations", validateUserId, validate, userController.getUserReservations);

/**
 * @swagger
 * /users/{id}/messages:
 *   get:
 *     summary: Lister les messages d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des messages de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur ou messages non trouvés
 */
router.get("/:id/messages", validateUserId, validate, userController.getUserMessages);

/**
 * @swagger
 * /users/{id}/reviews:
 *   get:
 *     summary: Lister les avis d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des avis de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur ou avis non trouvés
 */
router.get("/:id/reviews", validateUserId, validate, userController.getUserReviews);

/**
 * @swagger
 * /users/{id}/documents:
 *   get:
 *     summary: Lister les documents d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des documents de l'utilisateur
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Utilisateur ou documents non trouvés
 */
router.get("/:id/documents", validateUserId, validate, userController.getUserDocuments);

export default router;