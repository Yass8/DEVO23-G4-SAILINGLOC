import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');
jest.mock('../../../utils/uploadFile.js');
jest.mock('fs');
jest.mock('path');

// Import après le mock
import userService from '../../../services/user.services.js';
import db from '../../../models/index.js';
import uploadFile from '../../../utils/uploadFile.js';
import fs from 'fs';
import path from 'path';

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com' },
        { id: 2, email: 'user2@test.com' }
      ];

      db.User.findAll = jest.fn().mockResolvedValue(mockUsers);
      const result = await userService.getAllUsers();

      expect(db.User.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const newUser = { email: 'user@test.com', password: 'password' };
      const createdUser = { id: 1, ...newUser };

      db.User.create = jest.fn().mockResolvedValue(createdUser);
      const result = await userService.createUser(newUser);

      expect(db.User.create).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('showUser', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser = { id: userId, email: 'user@test.com' };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.showUser(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.showUser(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const userId = 1;
      const updateData = { email: 'user2@test.com' };
      const mockUser = {
        id: userId,
        email: 'user@test.com',
        update: jest.fn().mockResolvedValue({ id: userId, ...updateData })
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.updateUser(userId, updateData);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: userId, ...updateData });
    });

    it('should return null if user not found', async () => {
      const userId = 999;
      const updateData = { email: 'user2@test.com' };

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.updateUser(userId, updateData);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('removeUser', () => {
    it('should delete the user and return true', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@gmail.com',
        destroy: jest.fn().mockResolvedValue()
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.removeUser(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.removeUser(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('getUserBoats', () => {
    it('should return user boats', async () => {
      const userId = 1;
      const mockBoats = [{ id: 1, name: 'Boat 1' }, { id: 2, name: 'Boat 2' }];
      const mockUser = {
        id: userId,
        Boats: mockBoats
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.getUserBoats(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Boat
      });
      expect(result).toEqual(mockBoats);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.getUserBoats(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Boat
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations', async () => {
      const userId = 1;
      const mockReservations = [{ id: 1 }, { id: 2 }];
      const mockUser = {
        id: userId,
        Reservations: mockReservations
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.getUserReservations(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Reservation
      });
      expect(result).toEqual(mockReservations);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.getUserReservations(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Reservation
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserMessages', () => {
    it('should return user messages', async () => {
      const userId = 1;
      const mockMessages = [{ id: 1, content: 'Hello' }];
      const mockUser = {
        id: userId,
        Messages: mockMessages
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.getUserMessages(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Message
      });
      expect(result).toEqual(mockMessages);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.getUserMessages(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Message
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserReviews', () => {
    it('should return user reviews', async () => {
      const userId = 1;
      const mockReviews = [{ id: 1, rating: 5 }];
      const mockUser = {
        id: userId,
        Reviews: mockReviews
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.getUserReviews(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Review
      });
      expect(result).toEqual(mockReviews);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.getUserReviews(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.Review
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserDocuments', () => {
    it('should return user documents', async () => {
      const userId = 1;
      const mockDocuments = [{ id: 1, type: 'license' }];
      const mockUser = {
        id: userId,
        UserDocuments: mockDocuments
      };

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      const result = await userService.getUserDocuments(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.UserDocument
      });
      expect(result).toEqual(mockDocuments);
    });

    it('should return null if user not found', async () => {
      const userId = 999;

      db.User.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userService.getUserDocuments(userId);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId, {
        include: db.UserDocument
      });
      expect(result).toBeNull();
    });
  });

  describe('uploadUserPhoto', () => {
    it('should upload user photo and update user', async () => {
      const userId = 1;
      const mockFile = {
        data: 'file-data',
        name: 'photo.jpg'
      };
      const mockUser = {
        id: userId,
        photo: 'old-photo.jpg',
        update: jest.fn().mockResolvedValue()
      };
      const newFilePath = 'users/1/profile/photo.jpg';

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      uploadFile.saveFile = jest.fn().mockResolvedValue(newFilePath);
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.unlinkSync = jest.fn();
      path.join = jest.fn().mockReturnValue('full/path/to/old-photo.jpg');

      const result = await userService.uploadUserPhoto(userId, mockFile);

      expect(db.User.findByPk).toHaveBeenCalledWith(userId);
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(uploadFile.saveFile).toHaveBeenCalledWith(
        'user',
        mockFile.data,
        mockFile.name,
        `users/${userId}/profile`,
        ['.jpg', '.jpeg', '.png'],
        2
      );
      expect(mockUser.update).toHaveBeenCalledWith({ photo: newFilePath });
    });

    it('should throw error if user not found', async () => {
      const userId = 999;
      const mockFile = {
        data: 'file-data',
        name: 'photo.jpg'
      };

      db.User.findByPk = jest.fn().mockResolvedValue(null);

      await expect(userService.uploadUserPhoto(userId, mockFile))
        .rejects
        .toThrow('Utilisateur non trouvé');
    });

    it('should not delete file if photo is an avatar', async () => {
      const userId = 1;
      const mockFile = {
        data: 'file-data',
        name: 'photo.jpg'
      };
      const mockUser = {
        id: userId,
        photo: 'avatar-default.png', // Photo qui commence par "avatar"
        update: jest.fn().mockResolvedValue()
      };
      const newFilePath = 'users/1/profile/photo.jpg';

      db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
      uploadFile.saveFile = jest.fn().mockResolvedValue(newFilePath);
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.unlinkSync = jest.fn();
      path.join = jest.fn().mockReturnValue('full/path/to/avatar-default.png');

      await userService.uploadUserPhoto(userId, mockFile);

      // Vérifie que unlinkSync n'a pas été appelé pour les avatars
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });
  });
});