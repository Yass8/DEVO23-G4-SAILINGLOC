// tests/unit/routes/message.test.js
import request from 'supertest';
import express from 'express';
import messageRoutes from '../../../routes/message.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/message.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, content: 'Hello' }]),
  create: (req, res) => res.status(201).json({ id: 1, content: 'New message' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, content: 'Message details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getUserMessages: (req, res) => res.status(200).json([{ user_id: req.params.userId }]),
  getReservationMessages: (req, res) => res.status(200).json([{ reservation_id: req.params.reservationId }])
}));

jest.mock('../../../validators/message.validator.js', () => ({
  validateMessageId: (req, res, next) => next(),
  validateUserId: (req, res, next) => next(),
  validateReservationId: (req, res, next) => next(),
  validateCreateMessage: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

jest.mock('../../../middlewares/auth/authorize.js', () => ({
  isAuthenticated: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/messages', messageRoutes);

describe('Message Routes', () => {
  test('GET /messages should return all messages', async () => {
    const response = await request(app)
      .get('/messages')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /messages/new should create a message', async () => {
    const response = await request(app)
      .post('/messages/new')
      .send({ 
        sender_id: 1,
        receiver_id: 2,
        content: 'Hello there!',
        reservation_id: 123
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe('New message');
  });

  test('GET /messages/:id/show should return specific message', async () => {
    const response = await request(app)
      .get('/messages/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /messages/:id/edit should update message', async () => {
    const response = await request(app)
      .put('/messages/1/edit')
      .send({ content: 'Updated message content' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /messages/:id/delete should remove message', async () => {
    const response = await request(app)
      .delete('/messages/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /messages/user/:userId should return user messages', async () => {
    const response = await request(app)
      .get('/messages/user/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /messages/reservation/:reservationId should return reservation messages', async () => {
    const response = await request(app)
      .get('/messages/reservation/123')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('reservation_id');
    expect(response.body[0].reservation_id).toBe('123');
  });

  test('All message routes should be defined', () => {
    expect(messageRoutes.stack).toBeDefined();
    expect(messageRoutes.stack.length).toBeGreaterThan(0);
  });
});