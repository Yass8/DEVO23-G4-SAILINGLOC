import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/port.services.js');

// Import après le mock
import portController from '../../../controllers/port.controller.js';
import portService from '../../../services/port.services.js';

describe('Port Controller', () => {
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
    it('should return all ports with status 200', async () => {
      const mockPorts = [
        { id: 1, name: 'Port de Marseille', city: 'Marseille', country: 'France' },
        { id: 2, name: 'Port de Nice', city: 'Nice', country: 'France' }
      ];

      portService.getAllPorts = jest.fn().mockResolvedValue(mockPorts);

      await portController.index(mockReq, mockRes);

      expect(portService.getAllPorts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPorts);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      portService.getAllPorts = jest.fn().mockRejectedValue(error);

      await portController.index(mockReq, mockRes);

      expect(portService.getAllPorts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create port and return 201', async () => {
      const newPort = { 
        name: 'Port de Toulon', 
        city: 'Toulon', 
        country: 'France',
        latitude: 43.1184,
        longitude: 5.9356
      };
      const createdPort = { id: 1, ...newPort };

      mockReq.body = newPort;
      portService.createPort = jest.fn().mockResolvedValue(createdPort);

      await portController.create(mockReq, mockRes);

      expect(portService.createPort).toHaveBeenCalledWith(newPort);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdPort);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { name: 'Port Test', city: 'Test City' };
      portService.createPort = jest.fn().mockRejectedValue(error);

      await portController.create(mockReq, mockRes);

      expect(portService.createPort).toHaveBeenCalledWith({ 
        name: 'Port Test', 
        city: 'Test City' 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return port by ID with status 200', async () => {
      const portId = 1;
      const mockPort = { 
        id: portId, 
        name: 'Port de Marseille', 
        city: 'Marseille', 
        country: 'France' 
      };

      mockReq.params.id = portId;
      portService.getPortById = jest.fn().mockResolvedValue(mockPort);

      await portController.show(mockReq, mockRes);

      expect(portService.getPortById).toHaveBeenCalledWith(portId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPort);
    });

    it('should return 500 on error', async () => {
      const portId = 1;
      const error = new Error('Database error');
      mockReq.params.id = portId;
      portService.getPortById = jest.fn().mockRejectedValue(error);

      await portController.show(mockReq, mockRes);

      expect(portService.getPortById).toHaveBeenCalledWith(portId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update port and return 200', async () => {
      const portId = 1;
      const updateData = { name: 'Port de Marseille Updated', city: 'Marseille' };
      const updatedPort = { 
        id: portId, 
        ...updateData, 
        country: 'France' 
      };

      mockReq.params.id = portId;
      mockReq.body = updateData;
      portService.updatePort = jest.fn().mockResolvedValue(updatedPort);

      await portController.update(mockReq, mockRes);

      expect(portService.updatePort).toHaveBeenCalledWith(portId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedPort);
    });

    it('should return 500 on error', async () => {
      const portId = 1;
      const updateData = { name: 'Updated Port Name' };
      const error = new Error('Update error');

      mockReq.params.id = portId;
      mockReq.body = updateData;
      portService.updatePort = jest.fn().mockRejectedValue(error);

      await portController.update(mockReq, mockRes);

      expect(portService.updatePort).toHaveBeenCalledWith(portId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete port and return 204', async () => {
      const portId = 1;
      mockReq.params.id = portId;
      portService.deletePort = jest.fn().mockResolvedValue();

      await portController.remove(mockReq, mockRes);

      expect(portService.deletePort).toHaveBeenCalledWith(portId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const portId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = portId;
      portService.deletePort = jest.fn().mockRejectedValue(error);

      await portController.remove(mockReq, mockRes);

      expect(portService.deletePort).toHaveBeenCalledWith(portId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});