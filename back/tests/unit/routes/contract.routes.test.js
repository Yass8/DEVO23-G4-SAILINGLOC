import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import contractRoutes from '../../../routes/contract.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/contract.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, reservation_id: 123 }]),
  create: (req, res) => res.status(201).json({ id: 1, reservation_id: 123 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, reservation_id: 123 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getReservationContract: (req, res) => res.status(200).json({ reservation_id: req.params.reservationId })
}));

jest.mock('../../../validators/contract.validator.js', () => ({
  validateContractId: (req, res, next) => next(),
  validateReservationId: (req, res, next) => next(),
  validateCreateContract: (req, res, next) => next(),
  validateUpdateContract: (req, res, next) => next()
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
app.use('/contracts', contractRoutes);

describe('Contract Routes', () => {
  test('GET /contracts should return all contracts', async () => {
    const response = await request(app)
      .get('/contracts')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /contracts/new should create a contract', async () => {
    const response = await request(app)
      .post('/contracts/new')
      .send({ 
        reservation_id: 123,
        contract_url: 'https://example.com/contract.pdf'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.reservation_id).toBe(123);
  });

  test('GET /contracts/:id/show should return specific contract', async () => {
    const response = await request(app)
      .get('/contracts/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /contracts/:id/edit should update contract', async () => {
    const response = await request(app)
      .put('/contracts/1/edit')
      .send({ owner_signature: true, renter_signature: false })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /contracts/:id/delete should remove contract', async () => {
    const response = await request(app)
      .delete('/contracts/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /contracts/reservation/:reservationId should return reservation contract', async () => {
    const response = await request(app)
      .get('/contracts/reservation/123')
      .expect(200);

    expect(response.body).toHaveProperty('reservation_id');
    expect(response.body.reservation_id).toBe('123');
  });

  test('All contract routes should be defined', () => {
    expect(contractRoutes.stack).toBeDefined();
    expect(contractRoutes.stack.length).toBeGreaterThan(0);
  });
});