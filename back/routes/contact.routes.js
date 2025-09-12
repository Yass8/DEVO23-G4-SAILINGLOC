import express from 'express';
import contactController from '../controllers/contact.controller.js';
import { validateContact } from '../validators/contact.validator.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Envoi du formulaire de contact
 */

/**
 * @swagger
 * /contact/send:
 *   post:
 *     summary: Envoyer un message via le formulaire de contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               subject:
 *                 type: string
 *                 example: "Demande d'information sur la location"
 *               message:
 *                 type: string
 *                 example: "Bonjour, je souhaite en savoir plus sur vos offres..."
 *     responses:
 *       200:
 *         description: Message envoyé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/send', validateContact, validate, contactController.sendContactForm);

export default router;