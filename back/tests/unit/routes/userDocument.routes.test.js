import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import userDocumentRoutes from '../../../routes/userDocument.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/userDocument.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, type: 'licence', user_id: 42 }]),
  create: (req, res) => res.status(201).json({ id: 1, type: 'licence', user_id: 42 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, type: 'licence', user_id: 42 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getUserDocuments: (req, res) => res.status(200).json([{ user_id: req.params.userId }])
}));

jest.mock('../../../validators/userDocument.validator.js', () => ({
  validateUserDocumentId: (req, res, next) => next(),
  validateUserId: (req, res, next) => next(),
  validateCreateUserDocument: (req, res, next) => next(),
  validateUpdateUserDocument: (req, res, next) => next()
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
app.use('/user-documents', userDocumentRoutes);

describe('User Document Routes', () => {
  test('GET /user-documents should return all documents', async () => {
    const response = await request(app)
      .get('/user-documents')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /user-documents/new should create a document', async () => {
    const response = await request(app)
      .post('/user-documents/new')
      .send({ 
        type: 'licence',
        file_url: 'https://example.com/licence.pdf',
        user_id: 42
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toBe('licence');
  });

  test('GET /user-documents/:id/show should return specific document', async () => {
    const response = await request(app)
      .get('/user-documents/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /user-documents/:id/edit should update document', async () => {
    const response = await request(app)
      .put('/user-documents/1/edit')
      .send({ is_verified: true, Message: 'Document validé' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /user-documents/:id/delete should remove document', async () => {
    const response = await request(app)
      .delete('/user-documents/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /user-documents/user/:userId should return user documents', async () => {
    const response = await request(app)
      .get('/user-documents/user/42')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('42');
  });

  test('All user document routes should be defined', () => {
    expect(userDocumentRoutes.stack).toBeDefined();
    expect(userDocumentRoutes.stack.length).toBeGreaterThan(0);
  });
});