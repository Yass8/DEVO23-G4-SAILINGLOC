import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/boatEquipment.services.js');

// Import après le mock
import boatEquipmentController from '../../../controllers/boatEquipment.controller.js';
import boatEquipmentService from '../../../services/boatEquipment.services.js';

describe('BoatEquipment Controller', () => {
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
    it('should return all boat equipments with status 200', async () => {
      const mockEquipments = [
        { id: 1, name: 'GPS', description: 'Navigation system' },
        { id: 2, name: 'Anchor', description: 'Boat anchor' }
      ];

      boatEquipmentService.getAllBoatEquipments = jest.fn().mockResolvedValue(mockEquipments);

      await boatEquipmentController.index(mockReq, mockRes);

      expect(boatEquipmentService.getAllBoatEquipments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEquipments);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      boatEquipmentService.getAllBoatEquipments = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.index(mockReq, mockRes);

      expect(boatEquipmentService.getAllBoatEquipments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create boat equipment and return 201', async () => {
      const newEquipment = { 
        name: 'Life Jackets', 
        description: 'Safety equipment',
        category: 'safety'
      };
      const createdEquipment = { id: 1, ...newEquipment };

      mockReq.body = newEquipment;
      boatEquipmentService.createBoatEquipment = jest.fn().mockResolvedValue(createdEquipment);

      await boatEquipmentController.create(mockReq, mockRes);

      expect(boatEquipmentService.createBoatEquipment).toHaveBeenCalledWith(newEquipment);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdEquipment);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { name: 'New Equipment' };
      boatEquipmentService.createBoatEquipment = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.create(mockReq, mockRes);

      expect(boatEquipmentService.createBoatEquipment).toHaveBeenCalledWith({ name: 'New Equipment' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return boat equipment by ID with status 200', async () => {
      const equipmentId = 1;
      const mockEquipment = { 
        id: equipmentId, 
        name: 'GPS', 
        description: 'Navigation system',
        category: 'navigation'
      };

      mockReq.params.id = equipmentId;
      boatEquipmentService.getBoatEquipmentById = jest.fn().mockResolvedValue(mockEquipment);

      await boatEquipmentController.show(mockReq, mockRes);

      expect(boatEquipmentService.getBoatEquipmentById).toHaveBeenCalledWith(equipmentId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEquipment);
    });

    it('should return 500 on error', async () => {
      const equipmentId = 1;
      const error = new Error('Database error');
      mockReq.params.id = equipmentId;
      boatEquipmentService.getBoatEquipmentById = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.show(mockReq, mockRes);

      expect(boatEquipmentService.getBoatEquipmentById).toHaveBeenCalledWith(equipmentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update boat equipment and return 200', async () => {
      const equipmentId = 1;
      const updateData = { name: 'GPS Updated', description: 'Updated navigation system' };
      const updatedEquipment = { 
        id: equipmentId, 
        ...updateData,
        category: 'navigation'
      };

      mockReq.params.id = equipmentId;
      mockReq.body = updateData;
      boatEquipmentService.updateBoatEquipment = jest.fn().mockResolvedValue(updatedEquipment);

      await boatEquipmentController.update(mockReq, mockRes);

      expect(boatEquipmentService.updateBoatEquipment).toHaveBeenCalledWith(equipmentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedEquipment);
    });

    it('should return 500 on error', async () => {
      const equipmentId = 1;
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update error');

      mockReq.params.id = equipmentId;
      mockReq.body = updateData;
      boatEquipmentService.updateBoatEquipment = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.update(mockReq, mockRes);

      expect(boatEquipmentService.updateBoatEquipment).toHaveBeenCalledWith(equipmentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete boat equipment and return 204', async () => {
      const equipmentId = 1;
      mockReq.params.id = equipmentId;
      boatEquipmentService.deleteBoatEquipment = jest.fn().mockResolvedValue();

      await boatEquipmentController.remove(mockReq, mockRes);

      expect(boatEquipmentService.deleteBoatEquipment).toHaveBeenCalledWith(equipmentId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const equipmentId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = equipmentId;
      boatEquipmentService.deleteBoatEquipment = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.remove(mockReq, mockRes);

      expect(boatEquipmentService.deleteBoatEquipment).toHaveBeenCalledWith(equipmentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatEquipments', () => {
    it('should return boat equipments for specific boat with status 200', async () => {
      const boatId = 1;
      const mockEquipments = [
        { id: 1, name: 'GPS', description: 'Navigation system', boat_id: boatId },
        { id: 2, name: 'Anchor', description: 'Boat anchor', boat_id: boatId }
      ];

      mockReq.params.id = boatId;
      boatEquipmentService.getBoatEquipments = jest.fn().mockResolvedValue(mockEquipments);

      await boatEquipmentController.getBoatEquipments(mockReq, mockRes);

      expect(boatEquipmentService.getBoatEquipments).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEquipments);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatEquipmentService.getBoatEquipments = jest.fn().mockRejectedValue(error);

      await boatEquipmentController.getBoatEquipments(mockReq, mockRes);

      expect(boatEquipmentService.getBoatEquipments).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});