import express from "express";
import userDocumentController from "../controllers/userDocument.controller.js";
import {
  validateUserDocumentId,
  validateUserId,
  validateCreateUserDocument,
  validateUpdateUserDocument
} from "../validators/userDocument.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserDocuments
 *   description: Gestion des documents utilisateurs
 */

/**
 * @swagger
 * /user-documents:
 *   get:
 *     summary: Lister tous les documents utilisateurs
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents
 *       401:
 *         description: Non authentifié
 */
router.get("/", isAuthenticated, userDocumentController.index);

/**
 * @swagger
 * /user-documents/new:
 *   post:
 *     summary: Créer un document utilisateur
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, file_url, user_id]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [licence, insurance, id_card]
 *                 example: licence
 *               file_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://cdn.example.com/docs/licence-123.pdf"
 *               user_id:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Document créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post("/new", isAuthenticated, validateCreateUserDocument, validate, userDocumentController.create);

/**
 * @swagger
 * /user-documents/{id}/show:
 *   get:
 *     summary: Récupérer un document utilisateur par son ID
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du document
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Document non trouvé
 */
router.get("/:id/show", isAuthenticated, validateUserDocumentId, validate, userDocumentController.show);

/**
 * @swagger
 * /user-documents/{id}/edit:
 *   put:
 *     summary: Mettre à jour un document utilisateur
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
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
 *               is_verified:
 *                 type: boolean
 *                 example: true
 *               Message:
 *                 type: string
 *                 example: "Document validé par l'administration."
 *     responses:
 *       200:
 *         description: Document mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Document non trouvé
 */
router.put("/:id/edit", isAuthenticated, validateUserDocumentId, validateUpdateUserDocument, validate, userDocumentController.update);

/**
 * @swagger
 * /user-documents/{id}/delete:
 *   delete:
 *     summary: Supprimer un document utilisateur
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Document supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Document non trouvé
 */
router.delete("/:id/delete", isAuthenticated, validateUserDocumentId, validate, userDocumentController.remove);

/**
 * @swagger
 * /user-documents/user/{userId}:
 *   get:
 *     summary: Lister les documents d'un utilisateur
 *     description: Requiert authentification.
 *     tags: [UserDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des documents de l'utilisateur
 *       400:
 *         description: Paramètre invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur ou documents non trouvés
 */
router.get("/user/:user_id", isAuthenticated, validateUserId, validate, userDocumentController.getUserDocuments);

export default router;