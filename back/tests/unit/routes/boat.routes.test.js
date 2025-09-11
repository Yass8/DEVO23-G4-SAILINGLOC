// tests/unit/routes/boat.test.js
import request from 'supertest';
import express from 'express';
import boatRoutes from '../../../routes/boat.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/boat.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, name: 'Boat 1' }]),
  create: (req, res) => res.status(201).json({ id: 1, name: 'New Boat' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, name: 'Boat Details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getBoatPhotos: (req, res) => res.status(200).json([{ photo: 'photo1.jpg' }]),
  getBoatEquipments: (req, res) => res.status(200).json([{ equipment: 'GPS' }]),
  getBoatAvailabilities: (req, res) => res.status(200).json([{ availability: '2025-01-01' }]),
  getBoatReviews: (req, res) => res.status(200).json([{ review: 'Great boat' }]),
  getBoatReservations: (req, res) => res.status(200).json([{ reservation: 'res123' }]),
  getFilteredBoats: (req, res) => res.status(200).json([{ filtered: true }])
}));

jest.mock('../../../validators/boat.validator.js', () => ({
  validateBoatId: (req, res, next) => next(),
  validateCreateBoat: (req, res, next) => next(),
  validateUpdateBoat: (req, res, next) => next(),
  validateBoatSlug: (req, res, next) => next()
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
app.use('/boats', boatRoutes);

describe('Boat Routes', () => {
  test('GET /boats should return all boats', async () => {
    const response = await request(app)
      .get('/boats')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /boats/new should create a boat', async () => {
    const response = await request(app)
      .post('/boats/new')
      .send({ 
        reference: 'SL-VOIL-2025-0001', 
        name: 'Océanis 38.1',
        brand: 'Beneteau',
        length: 11.5,
        daily_price: '249.90',
        user_id: 1
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('New Boat');
  });

  test('GET /boats/:id/show should return specific boat', async () => {
    const response = await request(app)
      .get('/boats/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /boats/:id/edit should update boat', async () => {
    const response = await request(app)
      .put('/boats/1/edit')
      .send({ name: 'Updated Boat', daily_price: '279.00' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /boats/:id/delete should remove boat', async () => {
    const response = await request(app)
      .delete('/boats/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /boats/:id/photos should return boat photos', async () => {
    const response = await request(app)
      .get('/boats/1/photos')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('photo');
  });

  test('GET /boats/:id/equipments should return boat equipments', async () => {
    const response = await request(app)
      .get('/boats/1/equipments')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('equipment');
  });

  test('GET /boats/:id/availabilities should return boat availabilities', async () => {
    const response = await request(app)
      .get('/boats/1/availabilities')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('availability');
  });

  test('GET /boats/:id/reviews should return boat reviews', async () => {
    const response = await request(app)
      .get('/boats/1/reviews')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('review');
  });

  test('GET /boats/:id/reservations should return boat reservations', async () => {
    const response = await request(app)
      .get('/boats/1/reservations')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('reservation');
  });

  test('GET /boats/filters should return filtered boats', async () => {
    const response = await request(app)
      .get('/boats/filters')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('filtered');
  });

  test('All boat routes should be defined', () => {
    expect(boatRoutes.stack).toBeDefined();
    expect(boatRoutes.stack.length).toBeGreaterThan(0);
  });
});