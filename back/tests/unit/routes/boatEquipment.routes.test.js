import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import boatEquipmentRoutes from '../../../routes/boatEquipment.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/boatEquipment.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, name: 'GPS' }]),
  create: (req, res) => res.status(201).json({ id: 1, name: 'New Equipment' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, name: 'Equipment Details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getBoatEquipments: (req, res) => res.status(200).json([{ boat_id: req.params.boatId }])
}));

jest.mock('../../../validators/boatEquipment.validator.js', () => ({
  validateBoatEquipmentId: (req, res, next) => next(),
  validateBoatId: (req, res, next) => next(),
  validateCreateBoatEquipment: (req, res, next) => next(),
  validateUpdateBoatEquipment: (req, res, next) => next()
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
app.use('/boat-equipments', boatEquipmentRoutes);

describe('Boat Equipment Routes', () => {
  test('GET /boat-equipments should return all equipment', async () => {
    const response = await request(app)
      .get('/boat-equipments')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /boat-equipments/new should create equipment', async () => {
    const response = await request(app)
      .post('/boat-equipments/new')
      .send({ 
        boat_id: 1, 
        name: 'GPS',
        category: 'Navigation',
        is_required: false
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Equipment');
  });

  test('GET /boat-equipments/:id/show should return specific equipment', async () => {
    const response = await request(app)
      .get('/boat-equipments/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /boat-equipments/:id/edit should update equipment', async () => {
    const response = await request(app)
      .put('/boat-equipments/1/edit')
      .send({ name: 'Updated GPS', category: 'Electronics' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /boat-equipments/:id/delete should remove equipment', async () => {
    const response = await request(app)
      .delete('/boat-equipments/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /boat-equipments/boat/:boatId should return boat equipment', async () => {
    const response = await request(app)
      .get('/boat-equipments/boat/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('boat_id');
    expect(response.body[0].boat_id).toBe('1');
  });

  test('All boat equipment routes should be defined', () => {
    expect(boatEquipmentRoutes.stack).toBeDefined();
    expect(boatEquipmentRoutes.stack.length).toBeGreaterThan(0);
  });
});