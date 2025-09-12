// tests/unit/routes/review.test.js
import request from 'supertest';
import express from 'express';
import reviewRoutes from '../../../routes/review.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/review.controller.js', () => ({
  index: (req, res) => res.status(200).json([{ id: 1, rating: 5 }]),
  create: (req, res) => res.status(201).json({ id: 1, rating: 5 }),
  show: (req, res) => res.status(200).json({ id: req.params.id, rating: 5 }),
  update: (req, res) => res.status(200).json({ id: req.params.id, updated: true }),
  remove: (req, res) => res.status(204).send(),
  getBoatReviews: (req, res) => res.status(200).json([{ boat_id: req.params.boatId }]),
  getUserReviews: (req, res) => res.status(200).json([{ user_id: req.params.userId }])
}));

jest.mock('../../../validators/review.validator.js', () => ({
  validateReviewId: (req, res, next) => next(),
  validateBoatId: (req, res, next) => next(),
  validateUserId: (req, res, next) => next(),
  validateCreateReview: (req, res, next) => next(),
  validateUpdateReview: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

jest.mock('../../../middlewares/auth/authorize.js', () => ({
  isAuthenticated: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/reviews', reviewRoutes);

describe('Review Routes', () => {
  test('GET /reviews should return all reviews', async () => {
    const response = await request(app)
      .get('/reviews')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
  });

  test('POST /reviews/new should create a review', async () => {
    const response = await request(app)
      .post('/reviews/new')
      .send({ 
        reservation_id: 345,
        rating: 5,
        comment: 'Excellent service!'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.rating).toBe(5);
  });

  test('GET /reviews/:id/show should return specific review', async () => {
    const response = await request(app)
      .get('/reviews/1/show')
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe('1');
  });

  test('PUT /reviews/:id/edit should update review', async () => {
    const response = await request(app)
      .put('/reviews/1/edit')
      .send({ response: 'Thank you for your feedback!' })
      .expect(200);

    expect(response.body).toHaveProperty('updated');
    expect(response.body.updated).toBe(true);
  });

  test('DELETE /reviews/:id/delete should remove review', async () => {
    const response = await request(app)
      .delete('/reviews/1/delete')
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('GET /reviews/boat/:boatId should return boat reviews', async () => {
    const response = await request(app)
      .get('/reviews/boat/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('boat_id');
    expect(response.body[0].boat_id).toBe('1');
  });

  test('GET /reviews/user/:userId should return user reviews', async () => {
    const response = await request(app)
      .get('/reviews/user/1')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('user_id');
    expect(response.body[0].user_id).toBe('1');
  });

  test('All review routes should be defined', () => {
    expect(reviewRoutes.stack).toBeDefined();
    expect(reviewRoutes.stack.length).toBeGreaterThan(0);
  });
});