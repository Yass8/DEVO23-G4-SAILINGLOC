import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/availability.services.js');

// Import après le mock
import availabilityController from '../../../controllers/availability.controller.js';
import availabilityService from '../../../services/availability.services.js';

describe('Availability Controller', () => {
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
    it('should return all availabilities with status 200', async () => {
      const mockAvailabilities = [
        { id: 1, start_date: '2023-01-01', end_date: '2023-01-05', boat_id: 1 },
        { id: 2, start_date: '2023-02-01', end_date: '2023-02-05', boat_id: 2 }
      ];

      availabilityService.getAllAvailabilities = jest.fn().mockResolvedValue(mockAvailabilities);

      await availabilityController.index(mockReq, mockRes);

      expect(availabilityService.getAllAvailabilities).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAvailabilities);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      availabilityService.getAllAvailabilities = jest.fn().mockRejectedValue(error);

      await availabilityController.index(mockReq, mockRes);

      expect(availabilityService.getAllAvailabilities).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create availability and return 201', async () => {
      const newAvailability = { 
        start_date: '2023-01-01', 
        end_date: '2023-01-05', 
        boat_id: 1,
        available: true
      };
      const createdAvailability = { id: 1, ...newAvailability };

      mockReq.body = newAvailability;
      availabilityService.createAvailability = jest.fn().mockResolvedValue(createdAvailability);

      await availabilityController.create(mockReq, mockRes);

      expect(availabilityService.createAvailability).toHaveBeenCalledWith(newAvailability);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdAvailability);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { start_date: '2023-01-01', end_date: '2023-01-05' };
      availabilityService.createAvailability = jest.fn().mockRejectedValue(error);

      await availabilityController.create(mockReq, mockRes);

      expect(availabilityService.createAvailability).toHaveBeenCalledWith({ 
        start_date: '2023-01-01', 
        end_date: '2023-01-05' 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return availability by ID with status 200', async () => {
      const availabilityId = 1;
      const mockAvailability = { 
        id: availabilityId, 
        start_date: '2023-01-01', 
        end_date: '2023-01-05', 
        boat_id: 1,
        available: true
      };

      mockReq.params.id = availabilityId;
      availabilityService.getAvailabilityById = jest.fn().mockResolvedValue(mockAvailability);

      await availabilityController.show(mockReq, mockRes);

      expect(availabilityService.getAvailabilityById).toHaveBeenCalledWith(availabilityId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAvailability);
    });

    it('should return 500 on error', async () => {
      const availabilityId = 1;
      const error = new Error('Database error');
      mockReq.params.id = availabilityId;
      availabilityService.getAvailabilityById = jest.fn().mockRejectedValue(error);

      await availabilityController.show(mockReq, mockRes);

      expect(availabilityService.getAvailabilityById).toHaveBeenCalledWith(availabilityId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update availability and return 200', async () => {
      const availabilityId = 1;
      const updateData = { available: false, end_date: '2023-01-10' };
      const updatedAvailability = { 
        id: availabilityId, 
        ...updateData, 
        start_date: '2023-01-01',
        boat_id: 1
      };

      mockReq.params.id = availabilityId;
      mockReq.body = updateData;
      availabilityService.updateAvailability = jest.fn().mockResolvedValue(updatedAvailability);

      await availabilityController.update(mockReq, mockRes);

      expect(availabilityService.updateAvailability).toHaveBeenCalledWith(availabilityId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedAvailability);
    });

    it('should return 500 on error', async () => {
      const availabilityId = 1;
      const updateData = { available: false };
      const error = new Error('Update error');

      mockReq.params.id = availabilityId;
      mockReq.body = updateData;
      availabilityService.updateAvailability = jest.fn().mockRejectedValue(error);

      await availabilityController.update(mockReq, mockRes);

      expect(availabilityService.updateAvailability).toHaveBeenCalledWith(availabilityId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete availability and return 204', async () => {
      const availabilityId = 1;
      mockReq.params.id = availabilityId;
      availabilityService.deleteAvailability = jest.fn().mockResolvedValue();

      await availabilityController.remove(mockReq, mockRes);

      expect(availabilityService.deleteAvailability).toHaveBeenCalledWith(availabilityId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const availabilityId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = availabilityId;
      availabilityService.deleteAvailability = jest.fn().mockRejectedValue(error);

      await availabilityController.remove(mockReq, mockRes);

      expect(availabilityService.deleteAvailability).toHaveBeenCalledWith(availabilityId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatAvailabilities', () => {
    it('should return boat availabilities with status 200', async () => {
      const boatId = 1;
      const mockAvailabilities = [
        { id: 1, start_date: '2023-01-01', end_date: '2023-01-05', boat_id: boatId },
        { id: 2, start_date: '2023-02-01', end_date: '2023-02-05', boat_id: boatId }
      ];

      mockReq.params.id = boatId;
      availabilityService.getBoatAvailabilities = jest.fn().mockResolvedValue(mockAvailabilities);

      await availabilityController.getBoatAvailabilities(mockReq, mockRes);

      expect(availabilityService.getBoatAvailabilities).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAvailabilities);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      availabilityService.getBoatAvailabilities = jest.fn().mockRejectedValue(error);

      await availabilityController.getBoatAvailabilities(mockReq, mockRes);

      expect(availabilityService.getBoatAvailabilities).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});