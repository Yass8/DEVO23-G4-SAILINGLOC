import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import reservationRoutes from '../../../routes/reservation.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/reservation.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, boat_id: 1, user_id: 1 }]),
  create: (req, res) => res.status(201).json({ id: 1, boat_id: 1, user_id: 1 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, boat_id: 1, user_id: 1 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getUserBookings: (req, res) => res.status(200).json([{ user_id: req.params.userId }]),
  getBoatReservations: (req, res) => res.status(200).json([{ boat_id: req.params.boatId }])
}));

jest.mock('../../../validators/reservation.validator.js', () => ({
  validateReservationId: (req, res, next) => next(),
  validateUserId: (req, res, next) => next(),
  validateBoatId: (req, res, next) => next(),
  validateCreateReservation: (req, res, next) => next(),
  validateUpdateReservation: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

jest.mock('../../../middlewares/auth/authorize.js', () => ({
  isAuthenticated: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/reservations', reservationRoutes);

describe('Reservation Routes', () => {
  test('GET /reservations should return all reservations', async () => {
    const response = await request(app)
      .get('/reservations')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /reservations/new should create a reservation', async () => {
    const response = await request(app)
      .post('/reservations/new')
      .send({ 
        boat_id: 1,
        user_id: 1,
        start_date: '2025-08-20T09:00:00Z',
        end_date: '2025-08-23T18:00:00Z',
        total_price: '749.90'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.boat_id).toBe(1);
  });

  test('GET /reservations/:id/show should return specific reservation', async () => {
    const response = await request(app)
      .get('/reservations/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /reservations/:id/edit should update reservation', async () => {
    const response = await request(app)
      .put('/reservations/1/edit')
      .send({ status: 'confirmed' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /reservations/:id/delete should remove reservation', async () => {
    const response = await request(app)
      .delete('/reservations/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /reservations/user/:userId should return user reservations', async () => {
    const response = await request(app)
      .get('/reservations/user/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /reservations/boat/:boatId should return boat reservations', async () => {
    const response = await request(app)
      .get('/reservations/boat/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('boat_id');
    expect(response.body[0].boat_id).toBe('1');
  });

  test('All reservation routes should be defined', () => {
    expect(reservationRoutes.stack).toBeDefined();
    expect(reservationRoutes.stack.length).toBeGreaterThan(0);
  });
});