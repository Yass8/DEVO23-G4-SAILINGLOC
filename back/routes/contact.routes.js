import express from 'express';
import contactController from '../controllers/contact.controller.js';
import { validateContact } from '../validators/contact.validator.js';
import { validate } from '../middlewares/validate.js';
const router = express.Router();

router.post('/send', validateContact, validate, contactController.sendContactForm);


export default router;