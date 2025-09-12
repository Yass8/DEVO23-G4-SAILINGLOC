import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/reservation.services.js');

// Import après le mock
import reservationController from '../../../controllers/reservation.controller.js';
import reservationService from '../../../services/reservation.services.js';

describe('Reservation Controller', () => {
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
    it('should return all reservations with status 200', async () => {
      const mockReservations = [
        { id: 1, startDate: '2023-01-01', endDate: '2023-01-05', userId: 1, boatId: 1 },
        { id: 2, startDate: '2023-02-01', endDate: '2023-02-05', userId: 2, boatId: 2 }
      ];

      reservationService.getAllReservations = jest.fn().mockResolvedValue(mockReservations);

      await reservationController.index(mockReq, mockRes);

      expect(reservationService.getAllReservations).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReservations);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      reservationService.getAllReservations = jest.fn().mockRejectedValue(error);

      await reservationController.index(mockReq, mockRes);

      expect(reservationService.getAllReservations).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create reservation and return 201', async () => {
      const newReservation = { 
        startDate: '2023-01-01', 
        endDate: '2023-01-05', 
        userId: 1, 
        boatId: 1 
      };
      const createdReservation = { id: 1, ...newReservation };

      mockReq.body = newReservation;
      reservationService.createReservation = jest.fn().mockResolvedValue(createdReservation);

      await reservationController.create(mockReq, mockRes);

      expect(reservationService.createReservation).toHaveBeenCalledWith(newReservation);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdReservation);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { startDate: '2023-01-01', endDate: '2023-01-05' };
      reservationService.createReservation = jest.fn().mockRejectedValue(error);

      await reservationController.create(mockReq, mockRes);

      expect(reservationService.createReservation).toHaveBeenCalledWith({ 
        startDate: '2023-01-01', 
        endDate: '2023-01-05' 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return reservation by ID with status 200', async () => {
      const reservationId = 1;
      const mockReservation = { 
        id: reservationId, 
        startDate: '2023-01-01', 
        endDate: '2023-01-05', 
        userId: 1, 
        boatId: 1 
      };

      mockReq.params.id = reservationId;
      reservationService.getReservationById = jest.fn().mockResolvedValue(mockReservation);

      await reservationController.show(mockReq, mockRes);

      expect(reservationService.getReservationById).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReservation);
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const error = new Error('Database error');
      mockReq.params.id = reservationId;
      reservationService.getReservationById = jest.fn().mockRejectedValue(error);

      await reservationController.show(mockReq, mockRes);

      expect(reservationService.getReservationById).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update reservation and return 200', async () => {
      const reservationId = 1;
      const updateData = { startDate: '2023-01-10', endDate: '2023-01-15' };
      const updatedReservation = { 
        id: reservationId, 
        ...updateData, 
        userId: 1, 
        boatId: 1 
      };

      mockReq.params.id = reservationId;
      mockReq.body = updateData;
      reservationService.updateReservation = jest.fn().mockResolvedValue(updatedReservation);

      await reservationController.update(mockReq, mockRes);

      expect(reservationService.updateReservation).toHaveBeenCalledWith(reservationId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedReservation);
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const updateData = { startDate: '2023-01-10' };
      const error = new Error('Update error');

      mockReq.params.id = reservationId;
      mockReq.body = updateData;
      reservationService.updateReservation = jest.fn().mockRejectedValue(error);

      await reservationController.update(mockReq, mockRes);

      expect(reservationService.updateReservation).toHaveBeenCalledWith(reservationId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete reservation and return 204', async () => {
      const reservationId = 1;
      mockReq.params.id = reservationId;
      reservationService.deleteReservation = jest.fn().mockResolvedValue();

      await reservationController.remove(mockReq, mockRes);

      expect(reservationService.deleteReservation).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = reservationId;
      reservationService.deleteReservation = jest.fn().mockRejectedValue(error);

      await reservationController.remove(mockReq, mockRes);

      expect(reservationService.deleteReservation).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings with status 200', async () => {
      const userId = 1;
      const mockBookings = [
        { id: 1, startDate: '2023-01-01', endDate: '2023-01-05', userId: 1 },
        { id: 2, startDate: '2023-02-01', endDate: '2023-02-05', userId: 1 }
      ];

      mockReq.params.id = userId;
      reservationService.getUserBookings = jest.fn().mockResolvedValue(mockBookings);

      await reservationController.getUserBookings(mockReq, mockRes);

      expect(reservationService.getUserBookings).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBookings);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      reservationService.getUserBookings = jest.fn().mockRejectedValue(error);

      await reservationController.getUserBookings(mockReq, mockRes);

      expect(reservationService.getUserBookings).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatReservations', () => {
    it('should return boat reservations with status 200', async () => {
      const boatId = 1;
      const mockReservations = [
        { id: 1, startDate: '2023-01-01', endDate: '2023-01-05', boatId: 1 },
        { id: 2, startDate: '2023-02-01', endDate: '2023-02-05', boatId: 1 }
      ];

      mockReq.params.id = boatId;
      reservationService.getBoatReservations = jest.fn().mockResolvedValue(mockReservations);

      await reservationController.getBoatReservations(mockReq, mockRes);

      expect(reservationService.getBoatReservations).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReservations);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      reservationService.getBoatReservations = jest.fn().mockRejectedValue(error);

      await reservationController.getBoatReservations(mockReq, mockRes);

      expect(reservationService.getBoatReservations).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});