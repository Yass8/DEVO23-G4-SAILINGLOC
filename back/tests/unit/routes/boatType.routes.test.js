import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import boatTypeRoutes from '../../../routes/boatType.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/boatType.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, name: 'Voilier' }]),
  create: (req, res) => res.status(201).json({ id: 1, name: 'New Boat Type' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, name: 'Boat Type Details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send()
}));

jest.mock('../../../validators/boatType.validator.js', () => ({
  validateBoatTypeId: (req, res, next) => next(),
  validateCreateBoatType: (req, res, next) => next(),
  validateUpdateBoatType: (req, res, next) => next()
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
app.use('/boat-types', boatTypeRoutes);

describe('Boat Type Routes', () => {
  test('GET /boat-types should return all boat types', async () => {
    const response = await request(app)
      .get('/boat-types')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /boat-types/new should create boat type', async () => {
    const response = await request(app)
      .post('/boat-types/new')
      .send({ 
        name: 'Catamaran',
        photo_url: 'https://example.com/catamaran.jpg'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Boat Type');
  });

  test('GET /boat-types/:id/show should return specific boat type', async () => {
    const response = await request(app)
      .get('/boat-types/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /boat-types/:id/edit should update boat type', async () => {
    const response = await request(app)
      .put('/boat-types/1/edit')
      .send({ name: 'Updated Boat Type' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /boat-types/:id/delete should remove boat type', async () => {
    const response = await request(app)
      .delete('/boat-types/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('All boat type routes should be defined', () => {
    expect(boatTypeRoutes.stack).toBeDefined();
    expect(boatTypeRoutes.stack.length).toBeGreaterThan(0);
  });
});