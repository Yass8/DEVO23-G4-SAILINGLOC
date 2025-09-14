import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '../../../routes/auth.routes.js';

// Mock des contrôleurs et middlewares
jest.mock('../../../controllers/auth.controller.js', () => ({
  login: (req, res) => res.status(200).json({ token: 'mock-token' }),
  register: (req, res) => res.status(201).json({ message: 'User created' }),
  getCurrentUser: (req, res) => res.status(200).json({ user: 'mock-user' }),
  confirmEmail: (req, res) => res.status(200).json({ message: 'Email confirmed' }),
  changePassword: (req, res) => res.status(200).json({ message: 'Password changed' }),
  forgotPasswordEmail: (req, res) => res.status(200).json({ message: 'Email sent' }),
  resetPassword: (req, res) => res.status(200).json({ message: 'Password reset' })
}));

jest.mock('../../../validators/auth.validator.js', () => ({
  validateLogin: (req, res, next) => next(),
  validateRegister: (req, res, next) => next(),
  validateChangePassword: (req, res, next) => next(),
  validateForgotPassword: (req, res, next) => next(),
  validateResetPassword: (req, res, next) => next()
}));

jest.mock('../../../middlewares/validate.js', () => ({
  validate: (req, res, next) => next()
}));

jest.mock('../../../middlewares/auth/authorize.js', () => ({
  isAuthenticated: (req, res, next) => next()
}));

jest.mock('csurf', () => () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  test('POST /auth/login should return token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'password123' })
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/register should create user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ 
        email: 'test@email.com', 
        password: 'password123',
        firstname: 'Jean',
        lastname: 'Dupont'
      })
      .expect(201);

    expect(response.body).toEqual({ message: 'User created' });
  });

  test('GET /auth/me should return current user', async () => {
    const response = await request(app)
      .get('/auth/me')
      .expect(200);

    expect(response.body).toHaveProperty('user');
  });

  test('GET /auth/confirmation/:token should confirm email', async () => {
    const response = await request(app)
      .get('/auth/confirmation/mock-token')
      .expect(200);

    expect(response.body).toEqual({ message: 'Email confirmed' });
  });

  test('POST /auth/change-password should change password', async () => {
    const response = await request(app)
      .post('/auth/change-password')
      .send({ 
        email: 'test@email.com',
        oldPassword: 'oldpass',
        newPassword: 'newpass'
      })
      .expect(200);

    expect(response.body).toEqual({ message: 'Password changed' });
  });

  test('POST /auth/forgot-password-email should send email', async () => {
    const response = await request(app)
      .post('/auth/forgot-password-email')
      .send({ email: 'test@email.com' })
      .expect(200);

    expect(response.body).toEqual({ message: 'Email sent' });
  });

  test('POST /auth/reset-password should reset password', async () => {
    const response = await request(app)
      .post('/auth/reset-password')
      .send({ password: 'newpassword123' })
      .expect(200);

    expect(response.body).toEqual({ message: 'Password reset' });
  });

  test('All auth routes should be defined', () => {
    expect(authRoutes.stack).toBeDefined();
    expect(authRoutes.stack.length).toBeGreaterThan(0);
  });
});