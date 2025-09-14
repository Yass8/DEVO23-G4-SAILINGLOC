import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import availabilityRoutes from '../../../routes/availability.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/availability.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, boat_id: 1 }]),
  create: (req, res) => res.status(201).json({ id: 1, boat_id: 1 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, boat_id: 1 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getBoatAvailabilities: (req, res) => res.status(200).json([{ boat_id: req.params.boatId }])
}));

jest.mock('../../../validators/availability.validator.js', () => ({
  validateAvailabilityId: (req, res, next) => next(),
  validateBoatId: (req, res, next) => next(),
  validateCreateAvailability: (req, res, next) => next(),
  validateUpdateAvailability: (req, res, next) => next()
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
app.use('/availabilities', availabilityRoutes);

describe('Availability Routes', () => {
  test('GET /availabilities should return all availabilities', async () => {
    const response = await request(app)
      .get('/availabilities')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /availabilities/new should create availability', async () => {
    const response = await request(app)
      .post('/availabilities/new')
      .send({ boat_id: 1, start_date: '2025-01-01', end_date: '2025-01-10' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.boat_id).toBe(1);
  });

  test('GET /availabilities/:id/show should return specific availability', async () => {
    const response = await request(app)
      .get('/availabilities/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /availabilities/:id/edit should update availability', async () => {
    const response = await request(app)
      .put('/availabilities/1/edit')
      .send({ start_date: '2025-01-02', end_date: '2025-01-11' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /availabilities/:id/delete should remove availability', async () => {
    const response = await request(app)
      .delete('/availabilities/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /availabilities/boat/:boatId should return boat availabilities', async () => {
    const response = await request(app)
      .get('/availabilities/boat/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('boat_id');
    expect(response.body[0].boat_id).toBe('1');
  });

  test('All availability routes should be defined', () => {
    expect(availabilityRoutes.stack).toBeDefined();
    expect(availabilityRoutes.stack.length).toBeGreaterThan(0);
  });
});