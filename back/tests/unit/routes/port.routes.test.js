import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import portRoutes from '../../../routes/port.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/port.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, name: 'Port de La Rochelle' }]),
  create: (req, res) => res.status(201).json({ id: 1, name: 'New Port' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, name: 'Port Details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send()
}));

jest.mock('../../../validators/port.validator.js', () => ({
  validatePortId: (req, res, next) => next(),
  validateCreatePort: (req, res, next) => next(),
  validateUpdatePort: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

jest.mock('../../../middlewares/auth/authorize.js', () => ({
  isAuthenticated: (req, res, next) => next(),
  authorizeUser: (roles) => (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/ports', portRoutes);

describe('Port Routes', () => {
  test('GET /ports should return all ports', async () => {
    const response = await request(app)
      .get('/ports')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /ports/new should create a port', async () => {
    const response = await request(app)
      .post('/ports/new')
      .send({ 
        name: 'Port de Marseille',
        city: 'Marseille',
        country: 'France',
        latitude: '43.2965',
        longitude: '5.3698'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Port');
  });

  test('GET /ports/:id/show should return specific port', async () => {
    const response = await request(app)
      .get('/ports/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /ports/:id/edit should update port', async () => {
    const response = await request(app)
      .put('/ports/1/edit')
      .send({ name: 'Updated Port', city: 'Updated City' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /ports/:id/delete should remove port', async () => {
    const response = await request(app)
      .delete('/ports/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('All port routes should be defined', () => {
    expect(portRoutes.stack).toBeDefined();
    expect(portRoutes.stack.length).toBeGreaterThan(0);
  });
});