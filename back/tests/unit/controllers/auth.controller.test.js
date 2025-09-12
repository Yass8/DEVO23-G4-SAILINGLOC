import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/auth.services.js');

// Import après le mock
import authController from '../../../controllers/auth.controller.js';
import authService from '../../../services/auth.services.js';

describe('Auth Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      params: {},
      body: {},
      headers: {},
      files: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('register', () => {
    it('should register user and return 201', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      const authResponse = { 
        user: { id: 1, email: 'test@example.com' }, 
        token: 'jwt-token' 
      };

      mockReq.body = userData;
      authService.registerUser = jest.fn().mockResolvedValue(authResponse);

      await authController.register(mockReq, mockRes);

      expect(authService.registerUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(authResponse);
    });

    it('should return 500 on error', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Registration error');

      mockReq.body = userData;
      authService.registerUser = jest.fn().mockRejectedValue(error);

      await authController.register(mockReq, mockRes);

      expect(authService.registerUser).toHaveBeenCalledWith(userData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('login', () => {
    it('should login user and return 201', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      const authResponse = { 
        user: { id: 1, email: 'test@example.com' }, 
        token: 'jwt-token' 
      };

      mockReq.body = loginData;
      authService.loginUser = jest.fn().mockResolvedValue(authResponse);

      await authController.login(mockReq, mockRes);

      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(authResponse);
    });

    it('should return 500 on error', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Login error');

      mockReq.body = loginData;
      authService.loginUser = jest.fn().mockRejectedValue(error);

      await authController.login(mockReq, mockRes);

      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with status 200', async () => {
      const token = 'Bearer jwt-token';
      const currentUser = { id: 1, email: 'test@example.com' };

      mockReq.headers.authorization = token;
      authService.getCurrentUser = jest.fn().mockResolvedValue(currentUser);

      await authController.getCurrentUser(mockReq, mockRes);

      expect(authService.getCurrentUser).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(currentUser);
    });

    it('should return 401 on error', async () => {
      const token = 'Bearer invalid-token';
      const error = new Error('Unauthorized');

      mockReq.headers.authorization = token;
      authService.getCurrentUser = jest.fn().mockRejectedValue(error);

      await authController.getCurrentUser(mockReq, mockRes);

      expect(authService.getCurrentUser).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('logout', () => {
    it('should call authService logout method', () => {
      authService.logout = jest.fn();

      authController.logout(mockReq, mockRes);

      expect(authService.logout).toHaveBeenCalledWith(mockReq, mockRes);
    });
  });

  describe('changePassword', () => {
    it('should change password and return 200', async () => {
      const changePasswordData = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        userId: 1
      };
      const response = { message: 'Password changed successfully' };

      mockReq.body = changePasswordData;
      authService.changePassword = jest.fn().mockResolvedValue(response);

      await authController.changePassword(mockReq, mockRes);

      expect(authService.changePassword).toHaveBeenCalledWith(changePasswordData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(response);
    });

    it('should return 500 on error', async () => {
      const changePasswordData = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword'
      };
      const error = new Error('Password change error');

      mockReq.body = changePasswordData;
      authService.changePassword = jest.fn().mockRejectedValue(error);

      await authController.changePassword(mockReq, mockRes);

      expect(authService.changePassword).toHaveBeenCalledWith(changePasswordData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('forgotPasswordEmail', () => {
    it('should send forgot password email and return 200', async () => {
      const email = 'test@example.com';
      const response = { message: 'Password reset email sent' };

      mockReq.body = { email };
      authService.forgotPasswordEmail = jest.fn().mockResolvedValue(response);

      await authController.forgotPasswordEmail(mockReq, mockRes);

      expect(authService.forgotPasswordEmail).toHaveBeenCalledWith(email);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(response);
    });

    it('should return 500 on error', async () => {
      const email = 'test@example.com';
      const error = new Error('Email sending error');

      mockReq.body = { email };
      authService.forgotPasswordEmail = jest.fn().mockRejectedValue(error);

      await authController.forgotPasswordEmail(mockReq, mockRes);

      expect(authService.forgotPasswordEmail).toHaveBeenCalledWith(email);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('resetPassword', () => {
    it('should reset password and return 200', async () => {
      const resetData = {
        token: 'reset-token',
        password: 'newPassword123'
      };
      const response = { message: 'Password reset successfully' };

      mockReq.body = resetData;
      authService.resetPassword = jest.fn().mockResolvedValue(response);

      await authController.resetPassword(mockReq, mockRes);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetData.token, resetData.password);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(response);
    });

    it('should return 400 on error', async () => {
      const resetData = {
        token: 'invalid-token',
        password: 'newPassword123'
      };
      const error = new Error('Invalid token');

      mockReq.body = resetData;
      authService.resetPassword = jest.fn().mockRejectedValue(error);

      await authController.resetPassword(mockReq, mockRes);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetData.token, resetData.password);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('confirmEmail', () => {
    it('should confirm email and return 200', async () => {
      const token = 'confirmation-token';
      const user = { id: 1, email: 'test@example.com', emailConfirmed: true };

      mockReq.params.token = token;
      authService.confirmEmail = jest.fn().mockResolvedValue(user);

      await authController.confirmEmail(mockReq, mockRes);

      expect(authService.confirmEmail).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Email confirmé avec succès.', 
        user 
      });
    });

    it('should return 400 on error', async () => {
      const token = 'invalid-token';
      const error = new Error('Invalid confirmation token');

      mockReq.params.token = token;
      authService.confirmEmail = jest.fn().mockRejectedValue(error);

      await authController.confirmEmail(mockReq, mockRes);

      expect(authService.confirmEmail).toHaveBeenCalledWith(token);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});