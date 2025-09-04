import { describe, it, jest } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import userService from '../../../services/user.services.js';
import db from '../../../models/index.js';

describe('User Service', () => {
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@test.com' },
        { id: 2, email: 'user2@test.com' }
      ];
      
      // Mock de la fonction
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

        // Mock de la fonction
        db.User.create = jest.fn().mockResolvedValue(createdUser);
        const result = await userService.createUser(newUser);
        expect(db.User.create).toHaveBeenCalledWith(newUser);
        expect(result).toEqual(createdUser);


    });
    describe('showUser', () => {
        it('should return a user by ID', async () => {
            const userId = 1;
            const mockUser = { id: userId, email: 'user@test.com' };

            // Mock de la fonction
            db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
            const result = await userService.showUser(userId);
            expect(db.User.findByPk).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUser);
        });
    });
    describe('updateUser', () => {
        it('should update and return the user', async () => {
            const userId = 1;
            const updateData = { email: 'user2@test.com' };
            const mockUser = { id: userId, email: 'user@test.com', update: jest.fn().mockResolvedValue({ id: userId, ...updateData }) };

            // Mock de la fonction
            db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
            const result = await userService.updateUser(userId, updateData);
            expect(db.User.findByPk).toHaveBeenCalledWith(userId);
            expect(mockUser.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: userId, ...updateData });
        });
    });

  });
});