import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import userRoutes from '../../../routes/user.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/user.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, firstname: 'John', lastname: 'Doe' }]),
  create: (req, res) => res.status(201).json({ id: 1, firstname: 'New', lastname: 'User' }),
  show: (req, res) => res.status(200).json({ id: req.params.id, firstname: 'User', lastname: 'Details' }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  uploadPhoto: (req, res) => res.status(200).json({ id: req.params.id, photo: 'photo.jpg' }),
  getUserBoats: (req, res) => res.status(200).json([{ user_id: req.params.id }]),
  getUserReservations: (req, res) => res.status(200).json([{ user_id: req.params.id }]),
  getUserMessages: (req, res) => res.status(200).json([{ user_id: req.params.id }]),
  getUserReviews: (req, res) => res.status(200).json([{ user_id: req.params.id }]),
  getUserDocuments: (req, res) => res.status(200).json([{ user_id: req.params.id }])
}));

jest.mock('../../../validators/user.validator.js', () => ({
  validateUserId: (req, res, next) => next(),
  validateCreateUser: (req, res, next) => next(),
  validateUpdateUser: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  test('GET /users should return all users', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /users/new should create a user', async () => {
    const response = await request(app)
      .post('/users/new')
      .send({ 
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@example.com',
        password: 'MotDePasseSûr123',
        role: ['user']
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstname).toBe('New');
  });

  test('GET /users/:id/show should return specific user', async () => {
    const response = await request(app)
      .get('/users/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /users/:id/edit should update user', async () => {
    const response = await request(app)
      .put('/users/1/edit')
      .send({ firstname: 'Updated', lastname: 'User' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /users/:id/delete should remove user', async () => {
    const response = await request(app)
      .delete('/users/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('PUT /users/:id/photo should update user photo', async () => {
    const response = await request(app)
      .put('/users/1/photo')
      .send({ photo: 'new-photo.jpg' })
      .expect(200);

    expect(response.body).toHaveProperty('photo');
    expect(response.body.photo).toBe('photo.jpg');
  });

  test('GET /users/:id/boats should return user boats', async () => {
    const response = await request(app)
      .get('/users/1/boats')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /users/:id/reservations should return user reservations', async () => {
    const response = await request(app)
      .get('/users/1/reservations')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /users/:id/messages should return user messages', async () => {
    const response = await request(app)
      .get('/users/1/messages')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /users/:id/reviews should return user reviews', async () => {
    const response = await request(app)
      .get('/users/1/reviews')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('GET /users/:id/documents should return user documents', async () => {
    const response = await request(app)
      .get('/users/1/documents')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('All user routes should be defined', () => {
    expect(userRoutes.stack).toBeDefined();
    expect(userRoutes.stack.length).toBeGreaterThan(0);
  });
});