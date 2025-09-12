// tests/unit/routes/boatPhoto.test.js
import request from 'supertest';
import express from 'express';
import boatPhotoRoutes from '../../../routes/boatPhoto.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/boatPhoto.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, boat_id: 1 }]),
  create: (req, res) => res.status(201).json({ id: 1, boat_id: 1, mainIndex: 0 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, boat_id: 1 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getBoatPhotos: (req, res) => res.status(200).json([{ boat_id: req.params.boatId }])
}));

jest.mock('../../../validators/boatPhoto.validator.js', () => ({
  validateBoatPhotoId: (req, res, next) => next(),
  validateBoatId: (req, res, next) => next(),
  validateCreateBoatPhotos: (req, res, next) => next(),
  validateUpdateBoatPhotos: (req, res, next) => next()
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
app.use('/boat-photos', boatPhotoRoutes);

describe('Boat Photo Routes', () => {
  test('GET /boat-photos should return all photo records', async () => {
    const response = await request(app)
      .get('/boat-photos')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /boat-photos/new should create photo record', async () => {
    const response = await request(app)
      .post('/boat-photos/new')
      .send({ 
        boat_id: 1, 
        mainIndex: 0 
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.boat_id).toBe(1);
  });

  test('GET /boat-photos/:id/show should return specific photo record', async () => {
    const response = await request(app)
      .get('/boat-photos/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /boat-photos/:id/edit should update photo record', async () => {
    const response = await request(app)
      .put('/boat-photos/1/edit')
      .send({ mainIndex: 1 })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /boat-photos/:id/delete should remove photo record', async () => {
    const response = await request(app)
      .delete('/boat-photos/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /boat-photos/boat/:boatId should return boat photos', async () => {
    const response = await request(app)
      .get('/boat-photos/boat/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('boat_id');
    expect(response.body[0].boat_id).toBe('1');
  });

  test('All boat photo routes should be defined', () => {
    expect(boatPhotoRoutes.stack).toBeDefined();
    expect(boatPhotoRoutes.stack.length).toBeGreaterThan(0);
  });
});