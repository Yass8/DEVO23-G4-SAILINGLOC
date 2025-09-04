import { jest } from '@jest/globals';

// Mocks des services
const mockGetAllUsers = jest.fn();
const mockCreateUser = jest.fn();
const mockShowUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockRemoveUser = jest.fn();
const mockUploadUserPhoto = jest.fn();

// Mock userService
jest.unstable_mockModule('../../../services/user.services.js', () => ({
  default: {
    getAllUsers: mockGetAllUsers,
    createUser: mockCreateUser,
    showUser: mockShowUser,
    updateUser: mockUpdateUser,
    removeUser: mockRemoveUser,
    uploadUserPhoto: mockUploadUserPhoto
  }
}));

// Import dynamique
const { default: userController } = await import('../../../controllers/user.controller.js');

describe('User Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      files: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return all users with status 200', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      mockGetAllUsers.mockResolvedValue(mockUsers);

      await userController.index(mockReq, mockRes, mockNext);

      expect(mockGetAllUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });
});