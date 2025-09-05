import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/user.services.js');

// Import après le mock
import userController from '../../../controllers/user.controller.js';
import userService from '../../../services/user.services.js';

describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      params: {},
      body: {},
      files: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('index', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com' },
        { id: 2, email: 'user2@test.com' }
      ];

      userService.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

      await userController.index(mockReq, mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      userService.getAllUsers = jest.fn().mockRejectedValue(error);

      await userController.index(mockReq, mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('create', () => {
    it('should create user and return 201', async () => {
      const newUser = { email: 'user@test.com', password: 'password' };
      const createdUser = { id: 1, ...newUser };

      mockReq.body = newUser;
      userService.createUser = jest.fn().mockResolvedValue(createdUser);

      await userController.create(mockReq, mockRes);

      expect(userService.createUser).toHaveBeenCalledWith(newUser);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdUser);
    });

    it('should return 400 on error', async () => {
      const error = new Error('Validation error');
      mockReq.body = { email: 'invalid' };
      userService.createUser = jest.fn().mockRejectedValue(error);

      await userController.create(mockReq, mockRes);

      expect(userService.createUser).toHaveBeenCalledWith({ email: 'invalid' });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('show', () => {
    it('should return user with status 200', async () => {
      const userId = 1;
      const mockUser = { id: userId, email: 'user@test.com' };

      mockReq.params.id = userId;
      userService.showUser = jest.fn().mockResolvedValue(mockUser);

      await userController.show(mockReq, mockRes);

      expect(userService.showUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      const userId = 999;
      mockReq.params.id = userId;
      userService.showUser = jest.fn().mockResolvedValue(null);

      await userController.show(mockReq, mockRes);

      expect(userService.showUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.showUser = jest.fn().mockRejectedValue(error);

      await userController.show(mockReq, mockRes);

      expect(userService.showUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('update', () => {
    it('should update user and return 200', async () => {
      const userId = 1;
      const updateData = { email: 'updated@test.com' };
      const updatedUser = { id: userId, ...updateData };

      mockReq.params.id = userId;
      mockReq.body = updateData;
      userService.updateUser = jest.fn().mockResolvedValue(updatedUser);

      await userController.update(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if user not found', async () => {
      const userId = 999;
      const updateData = { email: 'updated@test.com' };

      mockReq.params.id = userId;
      mockReq.body = updateData;
      userService.updateUser = jest.fn().mockResolvedValue(null);

      await userController.update(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
    });

    it('should return 400 on error', async () => {
      const userId = 1;
      const updateData = { email: 'invalid' };
      const error = new Error('Validation error');

      mockReq.params.id = userId;
      mockReq.body = updateData;
      userService.updateUser = jest.fn().mockRejectedValue(error);

      await userController.update(mockReq, mockRes);

      expect(userService.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('remove', () => {
    it('should delete user and return 204', async () => {
      const userId = 1;
      mockReq.params.id = userId;
      userService.removeUser = jest.fn().mockResolvedValue(true);

      await userController.remove(mockReq, mockRes);

      expect(userService.removeUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      const userId = 999;
      mockReq.params.id = userId;
      userService.removeUser = jest.fn().mockResolvedValue(null);

      await userController.remove(mockReq, mockRes);

      expect(userService.removeUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.removeUser = jest.fn().mockRejectedValue(error);

      await userController.remove(mockReq, mockRes);

      expect(userService.removeUser).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserBoats', () => {
    it('should return user boats with status 200', async () => {
      const userId = 1;
      const mockBoats = [{ id: 1, name: 'Boat 1' }];

      mockReq.params.id = userId;
      userService.getUserBoats = jest.fn().mockResolvedValue(mockBoats);

      await userController.getUserBoats(mockReq, mockRes);

      expect(userService.getUserBoats).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoats);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.getUserBoats = jest.fn().mockRejectedValue(error);

      await userController.getUserBoats(mockReq, mockRes);

      expect(userService.getUserBoats).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations with status 200', async () => {
      const userId = 1;
      const mockReservations = [{ id: 1, date: '2023-01-01' }];

      mockReq.params.id = userId;
      userService.getUserReservations = jest.fn().mockResolvedValue(mockReservations);

      await userController.getUserReservations(mockReq, mockRes);

      expect(userService.getUserReservations).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReservations);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.getUserReservations = jest.fn().mockRejectedValue(error);

      await userController.getUserReservations(mockReq, mockRes);

      expect(userService.getUserReservations).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserMessages', () => {
    it('should return user messages with status 200', async () => {
      const userId = 1;
      const mockMessages = [{ id: 1, content: 'Hello' }];

      mockReq.params.id = userId;
      userService.getUserMessages = jest.fn().mockResolvedValue(mockMessages);

      await userController.getUserMessages(mockReq, mockRes);

      expect(userService.getUserMessages).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.getUserMessages = jest.fn().mockRejectedValue(error);

      await userController.getUserMessages(mockReq, mockRes);

      expect(userService.getUserMessages).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserReviews', () => {
    it('should return user reviews with status 200', async () => {
      const userId = 1;
      const mockReviews = [{ id: 1, rating: 5 }];

      mockReq.params.id = userId;
      userService.getUserReviews = jest.fn().mockResolvedValue(mockReviews);

      await userController.getUserReviews(mockReq, mockRes);

      expect(userService.getUserReviews).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.getUserReviews = jest.fn().mockRejectedValue(error);

      await userController.getUserReviews(mockReq, mockRes);

      expect(userService.getUserReviews).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getUserDocuments', () => {
    it('should return user documents with status 200', async () => {
      const userId = 1;
      const mockDocuments = [{ id: 1, type: 'license' }];

      mockReq.params.id = userId;
      userService.getUserDocuments = jest.fn().mockResolvedValue(mockDocuments);

      await userController.getUserDocuments(mockReq, mockRes);

      expect(userService.getUserDocuments).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDocuments);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userService.getUserDocuments = jest.fn().mockRejectedValue(error);

      await userController.getUserDocuments(mockReq, mockRes);

      expect(userService.getUserDocuments).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('uploadPhoto', () => {
    it('should upload photo and return 200', async () => {
      const userId = 1;
      const mockFile = { photo: { data: 'file-data', name: 'photo.jpg' } };
      const mockUser = { id: userId, photo: 'users/1/profile/photo.jpg' };

      mockReq.params.id = userId;
      mockReq.files = mockFile;
      userService.uploadUserPhoto = jest.fn().mockResolvedValue(mockUser);

      await userController.uploadPhoto(mockReq, mockRes);

      expect(userService.uploadUserPhoto).toHaveBeenCalledWith(userId, mockFile.photo);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 if no photo provided', async () => {
      const userId = 1;
      mockReq.params.id = userId;
      mockReq.files = {};

      await userController.uploadPhoto(mockReq, mockRes);

      expect(userService.uploadUserPhoto).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Aucune photo fournie" });
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const mockFile = { photo: { data: 'file-data', name: 'photo.jpg' } };
      const error = new Error('Upload error');

      mockReq.params.id = userId;
      mockReq.files = mockFile;
      userService.uploadUserPhoto = jest.fn().mockRejectedValue(error);

      await userController.uploadPhoto(mockReq, mockRes);

      expect(userService.uploadUserPhoto).toHaveBeenCalledWith(userId, mockFile.photo);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});