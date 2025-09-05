import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/payment.services.js');

// Import après le mock
import paymentController from '../../../controllers/payment.controller.js';
import paymentService from '../../../services/payment.services.js';

describe('Payment Controller', () => {
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
    it('should return all payments with status 200', async () => {
      const mockPayments = [
        { id: 1, amount: 100.50, status: 'completed', reservationId: 1 },
        { id: 2, amount: 200.75, status: 'pending', reservationId: 2 }
      ];

      paymentService.getAllPayments = jest.fn().mockResolvedValue(mockPayments);

      await paymentController.index(mockReq, mockRes);

      expect(paymentService.getAllPayments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPayments);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      paymentService.getAllPayments = jest.fn().mockRejectedValue(error);

      await paymentController.index(mockReq, mockRes);

      expect(paymentService.getAllPayments).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create payment and return 201', async () => {
      const newPayment = { 
        amount: 150.00, 
        status: 'completed', 
        reservationId: 1,
        paymentMethod: 'credit_card'
      };
      const createdPayment = { id: 1, ...newPayment };

      mockReq.body = newPayment;
      paymentService.createPayment = jest.fn().mockResolvedValue(createdPayment);

      await paymentController.create(mockReq, mockRes);

      expect(paymentService.createPayment).toHaveBeenCalledWith(newPayment);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdPayment);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { amount: 100.00, status: 'pending' };
      paymentService.createPayment = jest.fn().mockRejectedValue(error);

      await paymentController.create(mockReq, mockRes);

      expect(paymentService.createPayment).toHaveBeenCalledWith({ 
        amount: 100.00, 
        status: 'pending' 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return payment by ID with status 200', async () => {
      const paymentId = 1;
      const mockPayment = { 
        id: paymentId, 
        amount: 100.50, 
        status: 'completed', 
        reservationId: 1 
      };

      mockReq.params.id = paymentId;
      paymentService.getPaymentById = jest.fn().mockResolvedValue(mockPayment);

      await paymentController.show(mockReq, mockRes);

      expect(paymentService.getPaymentById).toHaveBeenCalledWith(paymentId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
    });

    it('should return 500 on error', async () => {
      const paymentId = 1;
      const error = new Error('Database error');
      mockReq.params.id = paymentId;
      paymentService.getPaymentById = jest.fn().mockRejectedValue(error);

      await paymentController.show(mockReq, mockRes);

      expect(paymentService.getPaymentById).toHaveBeenCalledWith(paymentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update payment and return 200', async () => {
      const paymentId = 1;
      const updateData = { status: 'refunded', amount: 100.50 };
      const updatedPayment = { 
        id: paymentId, 
        ...updateData, 
        reservationId: 1 
      };

      mockReq.params.id = paymentId;
      mockReq.body = updateData;
      paymentService.updatePayment = jest.fn().mockResolvedValue(updatedPayment);

      await paymentController.update(mockReq, mockRes);

      expect(paymentService.updatePayment).toHaveBeenCalledWith(paymentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedPayment);
    });

    it('should return 500 on error', async () => {
      const paymentId = 1;
      const updateData = { status: 'failed' };
      const error = new Error('Update error');

      mockReq.params.id = paymentId;
      mockReq.body = updateData;
      paymentService.updatePayment = jest.fn().mockRejectedValue(error);

      await paymentController.update(mockReq, mockRes);

      expect(paymentService.updatePayment).toHaveBeenCalledWith(paymentId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete payment and return 204', async () => {
      const paymentId = 1;
      mockReq.params.id = paymentId;
      paymentService.deletePayment = jest.fn().mockResolvedValue();

      await paymentController.remove(mockReq, mockRes);

      expect(paymentService.deletePayment).toHaveBeenCalledWith(paymentId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const paymentId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = paymentId;
      paymentService.deletePayment = jest.fn().mockRejectedValue(error);

      await paymentController.remove(mockReq, mockRes);

      expect(paymentService.deletePayment).toHaveBeenCalledWith(paymentId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getReservationPayments', () => {
    it('should return reservation payments with status 200', async () => {
      const reservationId = 1;
      const mockPayments = [
        { id: 1, amount: 100.50, status: 'completed', reservationId: 1 },
        { id: 2, amount: 50.25, status: 'refunded', reservationId: 1 }
      ];

      mockReq.params.id = reservationId;
      paymentService.getReservationPayments = jest.fn().mockResolvedValue(mockPayments);

      await paymentController.getReservationPayments(mockReq, mockRes);

      expect(paymentService.getReservationPayments).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPayments);
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const error = new Error('Database error');
      mockReq.params.id = reservationId;
      paymentService.getReservationPayments = jest.fn().mockRejectedValue(error);

      await paymentController.getReservationPayments(mockReq, mockRes);

      expect(paymentService.getReservationPayments).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});