import express from "express";
import portController from "../controllers/port.controller.js";
import {
  validatePortId,
  validateCreatePort,
  validateUpdatePort
} from "../validators/port.validator.js";
import { validate } from "../middlewares/validate.js";
import { isAuthenticated, authorizeUser } from "../middlewares/auth/authorize.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ports
 *   description: Gestion des ports
 */

/**
 * @swagger
 * /ports:
 *   get:
 *     summary: Lister tous les ports
 *     tags: [Ports]
 *     responses:
 *       200:
 *         description: Liste des ports
 */
router.get("/", portController.index);

/**
 * @swagger
 * /ports/new:
 *   post:
 *     summary: Créer un port
 *     description: Requiert authentification avec rôle **admin**.
 *     tags: [Ports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, city, country]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Port de La Rochelle"
 *               city:
 *                 type: string
 *                 maxLength: 255
 *                 example: "La Rochelle"
 *               country:
 *                 type: string
 *                 maxLength: 255
 *                 example: "France"
 *               latitude:
 *                 type: string
 *                 description: Décimal
 *                 example: "46.1563"
 *               longitude:
 *                 type: string
 *                 description: Décimal
 *                 example: "-1.1511"
 *     responses:
 *       201:
 *         description: Port créé
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.post(
  "/new",
  isAuthenticated,
  authorizeUser(['admin']),
  validateCreatePort,
  validate,
  portController.create
);

/**
 * @swagger
 * /ports/{id}/show:
 *   get:
 *     summary: Récupérer un port par son ID
 *     tags: [Ports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Détails du port
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Port non trouvé
 */
router.get("/:id/show", validatePortId, validate, portController.show);

/**
 * @swagger
 * /ports/{id}/edit:
 *   put:
 *     summary: Mettre à jour un port
 *     description: Requiert authentification avec rôle **admin**.
 *     tags: [Ports]
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
 *                 example: "Port de Marseille"
 *               city:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Marseille"
 *     responses:
 *       200:
 *         description: Port mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Port non trouvé
 */
router.put(
  "/:id/edit",
  isAuthenticated,
  authorizeUser(['admin']),
  validatePortId,
  validateUpdatePort,
  validate,
  portController.update
);

/**
 * @swagger
 * /ports/{id}/delete:
 *   delete:
 *     summary: Supprimer un port
 *     description: Requiert authentification avec rôle **admin**.
 *     tags: [Ports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Port supprimé
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Port non trouvé
 */
router.delete(
  "/:id/delete",
  isAuthenticated,
  authorizeUser(['admin']),
  validatePortId,
  validate,
  portController.remove
);

export default router;