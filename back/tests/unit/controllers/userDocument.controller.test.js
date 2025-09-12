import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/userDocument.services.js');

// Import après le mock
import userDocumentController from '../../../controllers/userDocument.controller.js';
import userDocumentService from '../../../services/userDocument.services.js';

describe('UserDocument Controller', () => {
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
    it('should return all user documents with status 200', async () => {
      const mockDocuments = [
        { id: 1, type: 'license', userId: 1 },
        { id: 2, type: 'insurance', userId: 2 }
      ];

      userDocumentService.getAllUserDocuments = jest.fn().mockResolvedValue(mockDocuments);

      await userDocumentController.index(mockReq, mockRes);

      expect(userDocumentService.getAllUserDocuments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDocuments);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      userDocumentService.getAllUserDocuments = jest.fn().mockRejectedValue(error);

      await userDocumentController.index(mockReq, mockRes);

      expect(userDocumentService.getAllUserDocuments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create user document and return 201', async () => {
      const newDocument = { type: 'license', userId: 1, documentNumber: '12345' };
      const createdDocument = { id: 1, ...newDocument };

      mockReq.body = newDocument;
      userDocumentService.createUserDocument = jest.fn().mockResolvedValue(createdDocument);

      await userDocumentController.create(mockReq, mockRes);

      expect(userDocumentService.createUserDocument).toHaveBeenCalledWith(newDocument);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdDocument);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { type: 'license' };
      userDocumentService.createUserDocument = jest.fn().mockRejectedValue(error);

      await userDocumentController.create(mockReq, mockRes);

      expect(userDocumentService.createUserDocument).toHaveBeenCalledWith({ type: 'license' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return user document by ID with status 200', async () => {
      const documentId = 1;
      const mockDocument = { id: documentId, type: 'license', userId: 1 };

      mockReq.params.id = documentId;
      userDocumentService.getUserDocumentById = jest.fn().mockResolvedValue(mockDocument);

      await userDocumentController.show(mockReq, mockRes);

      expect(userDocumentService.getUserDocumentById).toHaveBeenCalledWith(documentId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDocument);
    });

    it('should return 500 on error', async () => {
      const documentId = 1;
      const error = new Error('Database error');
      mockReq.params.id = documentId;
      userDocumentService.getUserDocumentById = jest.fn().mockRejectedValue(error);

      await userDocumentController.show(mockReq, mockRes);

      expect(userDocumentService.getUserDocumentById).toHaveBeenCalledWith(documentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update user document and return 200', async () => {
      const documentId = 1;
      const updateData = { type: 'insurance' };
      const updatedDocument = { id: documentId, ...updateData, userId: 1 };

      mockReq.params.id = documentId;
      mockReq.body = updateData;
      userDocumentService.updateUserDocument = jest.fn().mockResolvedValue(updatedDocument);

      await userDocumentController.update(mockReq, mockRes);

      expect(userDocumentService.updateUserDocument).toHaveBeenCalledWith(documentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedDocument);
    });

    it('should return 500 on error', async () => {
      const documentId = 1;
      const updateData = { type: 'insurance' };
      const error = new Error('Update error');

      mockReq.params.id = documentId;
      mockReq.body = updateData;
      userDocumentService.updateUserDocument = jest.fn().mockRejectedValue(error);

      await userDocumentController.update(mockReq, mockRes);

      expect(userDocumentService.updateUserDocument).toHaveBeenCalledWith(documentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete user document and return 204', async () => {
      const documentId = 1;
      mockReq.params.id = documentId;
      userDocumentService.deleteUserDocument = jest.fn().mockResolvedValue();

      await userDocumentController.remove(mockReq, mockRes);

      expect(userDocumentService.deleteUserDocument).toHaveBeenCalledWith(documentId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const documentId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = documentId;
      userDocumentService.deleteUserDocument = jest.fn().mockRejectedValue(error);

      await userDocumentController.remove(mockReq, mockRes);

      expect(userDocumentService.deleteUserDocument).toHaveBeenCalledWith(documentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getUserDocuments', () => {
    it('should return user documents for specific user with status 200', async () => {
      const userId = 1;
      const mockDocuments = [
        { id: 1, type: 'license', userId: 1 },
        { id: 2, type: 'insurance', userId: 1 }
      ];

      mockReq.params.id = userId;
      userDocumentService.getUserDocuments = jest.fn().mockResolvedValue(mockDocuments);

      await userDocumentController.getUserDocuments(mockReq, mockRes);

      expect(userDocumentService.getUserDocuments).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockDocuments);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      userDocumentService.getUserDocuments = jest.fn().mockRejectedValue(error);

      await userDocumentController.getUserDocuments(mockReq, mockRes);

      expect(userDocumentService.getUserDocuments).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});