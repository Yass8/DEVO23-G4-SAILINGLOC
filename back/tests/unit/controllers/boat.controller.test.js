import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/boat.services.js');

// Import après le mock
import boatController from '../../../controllers/boat.controller.js';
import boatService from '../../../services/boat.services.js';

describe('Boat Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      params: {},
      body: {},
      query: {},
      files: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('index', () => {
    it('should return all boats with status 200', async () => {
      const mockBoats = [
        { id: 1, name: 'Boat 1', type: 'sailboat' },
        { id: 2, name: 'Boat 2', type: 'motorboat' }
      ];

      boatService.getAllBoats = jest.fn().mockResolvedValue(mockBoats);

      await boatController.index(mockReq, mockRes);

      expect(boatService.getAllBoats).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoats);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      boatService.getAllBoats = jest.fn().mockRejectedValue(error);

      await boatController.index(mockReq, mockRes);

      expect(boatService.getAllBoats).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create boat and return 201', async () => {
      const newBoat = { 
        name: 'New Boat', 
        type: 'sailboat',
        length: 10,
        capacity: 4
      };
      const createdBoat = { id: 1, ...newBoat };

      mockReq.body = newBoat;
      boatService.createBoat = jest.fn().mockResolvedValue(createdBoat);

      await boatController.create(mockReq, mockRes);

      expect(boatService.createBoat).toHaveBeenCalledWith(newBoat);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdBoat);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { name: 'New Boat' };
      boatService.createBoat = jest.fn().mockRejectedValue(error);

      await boatController.create(mockReq, mockRes);

      expect(boatService.createBoat).toHaveBeenCalledWith({ name: 'New Boat' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return boat by ID with status 200', async () => {
      const boatId = 1;
      const mockBoat = { 
        id: boatId, 
        name: 'Boat 1', 
        type: 'sailboat',
        slug: 'boat-1'
      };

      mockReq.params.id = boatId;
      boatService.getBoatById = jest.fn().mockResolvedValue(mockBoat);

      await boatController.show(mockReq, mockRes);

      expect(boatService.getBoatById).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoat);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatById = jest.fn().mockRejectedValue(error);

      await boatController.show(mockReq, mockRes);

      expect(boatService.getBoatById).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('showBySlug', () => {
    it('should return boat by slug with status 200', async () => {
      const slug = 'boat-1';
      const mockBoat = { 
        id: 1, 
        name: 'Boat 1', 
        type: 'sailboat',
        slug: slug
      };

      mockReq.params.slug = slug;
      boatService.getBoatBySlug = jest.fn().mockResolvedValue(mockBoat);

      await boatController.showBySlug(mockReq, mockRes);

      expect(boatService.getBoatBySlug).toHaveBeenCalledWith(slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoat);
    });

    it('should return 404 if boat not found by slug', async () => {
      const slug = 'non-existent-boat';
      mockReq.params.slug = slug;
      boatService.getBoatBySlug = jest.fn().mockResolvedValue(null);

      await boatController.showBySlug(mockReq, mockRes);

      expect(boatService.getBoatBySlug).toHaveBeenCalledWith(slug);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Bateau introuvable" });
    });

    it('should return 500 on error', async () => {
      const slug = 'boat-1';
      const error = new Error('Database error');
      mockReq.params.slug = slug;
      boatService.getBoatBySlug = jest.fn().mockRejectedValue(error);

      await boatController.showBySlug(mockReq, mockRes);

      expect(boatService.getBoatBySlug).toHaveBeenCalledWith(slug);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update boat and return 200', async () => {
      const boatId = 1;
      const updateData = { name: 'Updated Boat Name', type: 'motorboat' };
      const updatedBoat = { 
        id: boatId, 
        ...updateData,
        slug: 'updated-boat-name'
      };

      mockReq.params.id = boatId;
      mockReq.body = updateData;
      boatService.updateBoat = jest.fn().mockResolvedValue(updatedBoat);

      await boatController.update(mockReq, mockRes);

      expect(boatService.updateBoat).toHaveBeenCalledWith(boatId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedBoat);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const updateData = { name: 'Updated Name' };
      const error = new Error('Update error');

      mockReq.params.id = boatId;
      mockReq.body = updateData;
      boatService.updateBoat = jest.fn().mockRejectedValue(error);

      await boatController.update(mockReq, mockRes);

      expect(boatService.updateBoat).toHaveBeenCalledWith(boatId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete boat and return 204', async () => {
      const boatId = 1;
      mockReq.params.id = boatId;
      boatService.deleteBoat = jest.fn().mockResolvedValue();

      await boatController.remove(mockReq, mockRes);

      expect(boatService.deleteBoat).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = boatId;
      boatService.deleteBoat = jest.fn().mockRejectedValue(error);

      await boatController.remove(mockReq, mockRes);

      expect(boatService.deleteBoat).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getFilteredBoats', () => {
    it('should return filtered boats with status 200', async () => {
      const filters = { type: 'sailboat', minLength: 8 };
      const mockBoats = [
        { id: 1, name: 'Sailboat 1', type: 'sailboat', length: 10 },
        { id: 2, name: 'Sailboat 2', type: 'sailboat', length: 9 }
      ];

      mockReq.query = filters;
      boatService.getFilteredBoats = jest.fn().mockResolvedValue(mockBoats);

      await boatController.getFilteredBoats(mockReq, mockRes);

      expect(boatService.getFilteredBoats).toHaveBeenCalledWith(filters);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBoats);
    });

    it('should return 500 on error', async () => {
      const filters = { type: 'sailboat' };
      const error = new Error('Filter error');

      mockReq.query = filters;
      boatService.getFilteredBoats = jest.fn().mockRejectedValue(error);

      await boatController.getFilteredBoats(mockReq, mockRes);

      expect(boatService.getFilteredBoats).toHaveBeenCalledWith(filters);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatPhotos', () => {
    it('should return boat photos with status 200', async () => {
      const boatId = 1;
      const mockPhotos = [
        { id: 1, url: 'photo1.jpg', boat_id: boatId, main: true },
        { id: 2, url: 'photo2.jpg', boat_id: boatId, main: false }
      ];

      mockReq.params.id = boatId;
      boatService.getBoatPhotos = jest.fn().mockResolvedValue(mockPhotos);

      await boatController.getBoatPhotos(mockReq, mockRes);

      expect(boatService.getBoatPhotos).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPhotos);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatPhotos = jest.fn().mockRejectedValue(error);

      await boatController.getBoatPhotos(mockReq, mockRes);

      expect(boatService.getBoatPhotos).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveeringCalledWith({ error: error.message });
    });
  });

  describe('getBoatEquipments', () => {
    it('should return boat equipments with status 200', async () => {
      const boatId = 1;
      const mockEquipments = [
        { id: 1, name: 'GPS', boat_id: boatId },
        { id: 2, name: 'Anchor', boat_id: boatId }
      ];

      mockReq.params.id = boatId;
      boatService.getBoatEquipments = jest.fn().mockResolvedValue(mockEquipments);

      await boatController.getBoatEquipments(mockReq, mockRes);

      expect(boatService.getBoatEquipments).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockEquipments);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatEquipments = jest.fn().mockRejectedValue(error);

      await boatController.getBoatEquipments(mockReq, mockRes);

      expect(boatService.getBoatEquipments).toHaveBeenCalledWith(boatId);
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
      boatService.getBoatAvailabilities = jest.fn().mockResolvedValue(mockAvailabilities);

      await boatController.getBoatAvailabilities(mockReq, mockRes);

      expect(boatService.getBoatAvailabilities).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAvailabilities);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatAvailabilities = jest.fn().mockRejectedValue(error);

      await boatController.getBoatAvailabilities(mockReq, mockRes);

      expect(boatService.getBoatAvailabilities).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatReviews', () => {
    it('should return boat reviews with status 200', async () => {
      const boatId = 1;
      const mockReviews = [
        { id: 1, rating: 5, comment: 'Excellent', boat_id: boatId },
        { id: 2, rating: 4, comment: 'Very good', boat_id: boatId }
      ];

      mockReq.params.id = boatId;
      boatService.getBoatReviews = jest.fn().mockResolvedValue(mockReviews);

      await boatController.getBoatReviews(mockReq, mockRes);

      expect(boatService.getBoatReviews).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatReviews = jest.fn().mockRejectedValue(error);

      await boatController.getBoatReviews(mockReq, mockRes);

      expect(boatService.getBoatReviews).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatReservations', () => {
    it('should return boat reservations with status 200', async () => {
      const boatId = 1;
      const mockReservations = [
        { id: 1, start_date: '2023-01-01', end_date: '2023-01-05', boat_id: boatId },
        { id: 2, start_date: '2023-02-01', end_date: '2023-02-05', boat_id: boatId }
      ];

      mockReq.params.id = boatId;
      boatService.getBoatReservations = jest.fn().mockResolvedValue(mockReservations);

      await boatController.getBoatReservations(mockReq, mockRes);

      expect(boatService.getBoatReservations).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReservations);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatService.getBoatReservations = jest.fn().mockRejectedValue(error);

      await boatController.getBoatReservations(mockReq, mockRes);

      expect(boatService.getBoatReservations).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});