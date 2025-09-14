import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/boatType.services.js');

// Import après le mock
import boatTypeController from '../../../controllers/boatType.controller.js';
import boatTypeService from '../../../services/boatType.services.js';

describe('BoatType Controller', () => {
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
    it('should return all boat types with status 200', async () => {
      const mockBoatTypes = [
        { id: 1, name: 'Voilier', description: 'Boat with sails' },
        { id: 2, name: 'Bateau à moteur', description: 'Motor boat' }
      ];

      boatTypeService.getAllBoatTypes = jest.fn().mockResolvedValue(mockBoatTypes);

      await boatTypeController.index(mockReq, mockRes);

      expect(boatTypeService.getAllBoatTypes).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoatTypes);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      boatTypeService.getAllBoatTypes = jest.fn().mockRejectedValue(error);

      await boatTypeController.index(mockReq, mockRes);

      expect(boatTypeService.getAllBoatTypes).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create boat type and return 201', async () => {
      const newBoatType = { 
        name: 'Catamaran', 
        description: 'Double-hulled boat' 
      };
      const createdBoatType = { id: 1, ...newBoatType };

      mockReq.body = newBoatType;
      boatTypeService.createBoatType = jest.fn().mockResolvedValue(createdBoatType);

      await boatTypeController.create(mockReq, mockRes);

      expect(boatTypeService.createBoatType).toHaveBeenCalledWith(newBoatType);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdBoatType);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { name: 'New Type' };
      boatTypeService.createBoatType = jest.fn().mockRejectedValue(error);

      await boatTypeController.create(mockReq, mockRes);

      expect(boatTypeService.createBoatType).toHaveBeenCalledWith({ name: 'New Type' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return boat type by ID with status 200', async () => {
      const boatTypeId = 1;
      const mockBoatType = { 
        id: boatTypeId, 
        name: 'Voilier', 
        description: 'Boat with sails' 
      };

      mockReq.params.id = boatTypeId;
      boatTypeService.getBoatTypeById = jest.fn().mockResolvedValue(mockBoatType);

      await boatTypeController.show(mockReq, mockRes);

      expect(boatTypeService.getBoatTypeById).toHaveBeenCalledWith(boatTypeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoatType);
    });

    it('should return 500 on error', async () => {
      const boatTypeId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatTypeId;
      boatTypeService.getBoatTypeById = jest.fn().mockRejectedValue(error);

      await boatTypeController.show(mockReq, mockRes);

      expect(boatTypeService.getBoatTypeById).toHaveBeenCalledWith(boatTypeId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update boat type and return 200', async () => {
      const boatTypeId = 1;
      const updateData = { name: 'Voilier Updated', description: 'Updated description' };
      const updatedBoatType = { 
        id: boatTypeId, 
        ...updateData 
      };

      mockReq.params.id = boatTypeId;
      mockReq.body = updateData;
      boatTypeService.updateBoatType = jest.fn().mockResolvedValue(updatedBoatType);

      await boatTypeController.update(mockReq, mockRes);

      expect(boatTypeService.updateBoatType).toHaveBeenCalledWith(boatTypeId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedBoatType);
    });

    it('should return 500 on error', async () => {
      const boatTypeId = 1;
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update error');

      mockReq.params.id = boatTypeId;
      mockReq.body = updateData;
      boatTypeService.updateBoatType = jest.fn().mockRejectedValue(error);

      await boatTypeController.update(mockReq, mockRes);

      expect(boatTypeService.updateBoatType).toHaveBeenCalledWith(boatTypeId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete boat type and return 204', async () => {
      const boatTypeId = 1;
      mockReq.params.id = boatTypeId;
      boatTypeService.deleteBoatType = jest.fn().mockResolvedValue();

      await boatTypeController.remove(mockReq, mockRes);

      expect(boatTypeService.deleteBoatType).toHaveBeenCalledWith(boatTypeId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const boatTypeId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = boatTypeId;
      boatTypeService.deleteBoatType = jest.fn().mockRejectedValue(error);

      await boatTypeController.remove(mockReq, mockRes);

      expect(boatTypeService.deleteBoatType).toHaveBeenCalledWith(boatTypeId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});