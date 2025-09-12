// tests/unit/routes/payment.test.js
import request from 'supertest';
import express from 'express';
import paymentRoutes from '../../../routes/payment.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/payment.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, amount: '250.00' }]),
  create: (req, res) => res.status(201).json({ id: 1, amount: '250.00' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, amount: '250.00' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getReservationPayments: (req, res) => res.status(200).json([{ reservation_id: req.params.reservationId }])
}));

jest.mock('../../../validators/payment.validator.js', () => ({
  validatePaymentId: (req, res, next) => next(),
  validateReservationId: (req, res, next) => next(),
  validateCreatePayment: (req, res, next) => next(),
  validateUpdatePayment: (req, res, next) => next()
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
app.use('/payments', paymentRoutes);

describe('Payment Routes', () => {
  test('GET /payments should return all payments', async () => {
    const response = await request(app)
      .get('/payments')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /payments/new should create a payment', async () => {
    const response = await request(app)
      .post('/payments/new')
      .send({ 
        reservation_id: 123,
        amount: '250.00',
        method: 'credit_card',
        commission_amount: '25.00'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.amount).toBe('250.00');
  });

  test('GET /payments/:id/show should return specific payment', async () => {
    const response = await request(app)
      .get('/payments/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /payments/:id/edit should update payment', async () => {
    const response = await request(app)
      .put('/payments/1/edit')
      .send({ status: 'completed' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /payments/:id/delete should remove payment', async () => {
    const response = await request(app)
      .delete('/payments/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /payments/reservation/:reservationId should return reservation payments', async () => {
    const response = await request(app)
      .get('/payments/reservation/123')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('reservation_id');
    expect(response.body[0].reservation_id).toBe('123');
  });

  test('All payment routes should be defined', () => {
    expect(paymentRoutes.stack).toBeDefined();
    expect(paymentRoutes.stack.length).toBeGreaterThan(0);
  });
});