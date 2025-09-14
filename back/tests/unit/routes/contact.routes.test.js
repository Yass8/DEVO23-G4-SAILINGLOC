import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import contactRoutes from '../../../routes/contact.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/contact.controller.js', () => ({
  sendContactForm: (req, res) => res.status(200).json({ message: 'Message sent successfully' })
}));

jest.mock('../../../validators/contact.validator.js', () => ({
  validateContact: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/contact', contactRoutes);

describe('Contact Routes', () => {
  test('POST /contact/send should send contact form', async () => {
    const contactData = {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      subject: 'Demande d\'information',
      message: 'Bonjour, je souhaite en savoir plus...'
    };

    const response = await request(app)
      .post('/contact/send')
      .send(contactData)
      .expect(200);

    expect(response.body).toEqual({ message: 'Message sent successfully' });
  });

  test('Contact routes should be defined', () => {
    expect(contactRoutes.stack).toBeDefined();
    expect(contactRoutes.stack.length).toBeGreaterThan(0);
  });
});