import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import userDocumentService from '../../../services/userDocument.services.js';
import db from '../../../models/index.js';

describe('UserDocument Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUserDocuments', () => {
    it('should return all user documents with users included', async () => {
      const mockDocuments = [
        {
          id: 1,
          type: 'license',
          document_number: 'LIC12345',
          User: { id: 1, name: 'John Doe' }
        },
        {
          id: 2,
          type: 'insurance',
          document_number: 'INS67890',
          User: { id: 2, name: 'Jane Smith' }
        }
      ];

      db.UserDocument.findAll = jest.fn().mockResolvedValue(mockDocuments);
      const result = await userDocumentService.getAllUserDocuments();

      expect(db.UserDocument.findAll).toHaveBeenCalledWith({
        include: db.User
      });
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('createUserDocument', () => {
    it('should create and return a new user document', async () => {
      const newDocument = {
        type: 'license',
        document_number: 'LIC12345',
        user_id: 1
      };
      const createdDocument = { id: 1, ...newDocument };

      db.UserDocument.create = jest.fn().mockResolvedValue(createdDocument);
      const result = await userDocumentService.createUserDocument(newDocument);

      expect(db.UserDocument.create).toHaveBeenCalledWith(newDocument);
      expect(result).toEqual(createdDocument);
    });
  });

  describe('getUserDocumentById', () => {
    it('should return a user document by ID with user included', async () => {
      const documentId = 1;
      const mockDocument = {
        id: documentId,
        type: 'license',
        document_number: 'LIC12345',
        User: { id: 1, name: 'John Doe' }
      };

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(mockDocument);
      const result = await userDocumentService.getUserDocumentById(documentId);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId, {
        include: db.User
      });
      expect(result).toEqual(mockDocument);
    });

    it('should return null if document not found', async () => {
      const documentId = 999;

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userDocumentService.getUserDocumentById(documentId);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId, {
        include: db.User
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUserDocument', () => {
    it('should update and return the user document', async () => {
      const documentId = 1;
      const updateData = { document_number: 'LIC54321', status: 'verified' };
      const mockDocument = {
        id: documentId,
        type: 'license',
        document_number: 'LIC12345',
        status: 'pending',
        update: jest.fn().mockResolvedValue({ id: documentId, ...updateData })
      };

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(mockDocument);
      const result = await userDocumentService.updateUserDocument(documentId, updateData);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId);
      expect(mockDocument.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: documentId, ...updateData });
    });

    it('should return null if document not found', async () => {
      const documentId = 999;
      const updateData = { document_number: 'LIC54321' };

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userDocumentService.updateUserDocument(documentId, updateData);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId);
      expect(result).toBeNull();
    });
  });

  describe('deleteUserDocument', () => {
    it('should delete the user document and return true', async () => {
      const documentId = 1;
      const mockDocument = {
        id: documentId,
        type: 'license',
        document_number: 'LIC12345',
        destroy: jest.fn().mockResolvedValue()
      };

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(mockDocument);
      const result = await userDocumentService.deleteUserDocument(documentId);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId);
      expect(mockDocument.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if document not found', async () => {
      const documentId = 999;

      db.UserDocument.findByPk = jest.fn().mockResolvedValue(null);
      const result = await userDocumentService.deleteUserDocument(documentId);

      expect(db.UserDocument.findByPk).toHaveBeenCalledWith(documentId);
      expect(result).toBeNull();
    });
  });

  describe('getUserDocuments', () => {
    it('should return all documents for a specific user', async () => {
      const userId = 1;
      const mockDocuments = [
        { id: 1, type: 'license', document_number: 'LIC12345', user_id: userId },
        { id: 2, type: 'insurance', document_number: 'INS67890', user_id: userId }
      ];

      db.UserDocument.findAll = jest.fn().mockResolvedValue(mockDocuments);
      const result = await userDocumentService.getUserDocuments(userId);

      expect(db.UserDocument.findAll).toHaveBeenCalledWith({
        where: { user_id: userId }
      });
      expect(result).toEqual(mockDocuments);
    });

    it('should return empty array if no documents found for user', async () => {
      const userId = 999;

      db.UserDocument.findAll = jest.fn().mockResolvedValue([]);
      const result = await userDocumentService.getUserDocuments(userId);

      expect(db.UserDocument.findAll).toHaveBeenCalledWith({
        where: { user_id: userId }
      });
      expect(result).toEqual([]);
    });
  });
});