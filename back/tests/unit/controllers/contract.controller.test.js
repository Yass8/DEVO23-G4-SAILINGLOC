import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/contract.services.js');

// Import après le mock
import contractController from '../../../controllers/contract.controller.js';
import contractService from '../../../services/contract.services.js';

describe('Contract Controller', () => {
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
    it('should return all contracts with status 200', async () => {
      const mockContracts = [
        { id: 1, terms: 'Contract terms 1', status: 'active', reservationId: 1 },
        { id: 2, terms: 'Contract terms 2', status: 'signed', reservationId: 2 }
      ];

      contractService.getAllContracts = jest.fn().mockResolvedValue(mockContracts);

      await contractController.index(mockReq, mockRes);

      expect(contractService.getAllContracts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockContracts);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      contractService.getAllContracts = jest.fn().mockRejectedValue(error);

      await contractController.index(mockReq, mockRes);

      expect(contractService.getAllContracts).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create contract and return 201', async () => {
      const newContract = { 
        terms: 'Contract terms and conditions', 
        status: 'draft', 
        reservationId: 1,
        startDate: '2023-01-01',
        endDate: '2023-01-05'
      };
      const createdContract = { id: 1, ...newContract };

      mockReq.body = newContract;
      contractService.createContract = jest.fn().mockResolvedValue(createdContract);

      await contractController.create(mockReq, mockRes);

      expect(contractService.createContract).toHaveBeenCalledWith(newContract);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdContract);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { terms: 'Test terms', status: 'draft' };
      contractService.createContract = jest.fn().mockRejectedValue(error);

      await contractController.create(mockReq, mockRes);

      expect(contractService.createContract).toHaveBeenCalledWith({ 
        terms: 'Test terms', 
        status: 'draft' 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return contract by ID with status 200', async () => {
      const contractId = 1;
      const mockContract = { 
        id: contractId, 
        terms: 'Contract terms', 
        status: 'active', 
        reservationId: 1 
      };

      mockReq.params.id = contractId;
      contractService.getContractById = jest.fn().mockResolvedValue(mockContract);

      await contractController.show(mockReq, mockRes);

      expect(contractService.getContractById).toHaveBeenCalledWith(contractId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockContract);
    });

    it('should return 500 on error', async () => {
      const contractId = 1;
      const error = new Error('Database error');
      mockReq.params.id = contractId;
      contractService.getContractById = jest.fn().mockRejectedValue(error);

      await contractController.show(mockReq, mockRes);

      expect(contractService.getContractById).toHaveBeenCalledWith(contractId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update contract and return 200', async () => {
      const contractId = 1;
      const updateData = { status: 'signed', terms: 'Updated contract terms' };
      const updatedContract = { 
        id: contractId, 
        ...updateData, 
        reservationId: 1 
      };

      mockReq.params.id = contractId;
      mockReq.body = updateData;
      contractService.updateContract = jest.fn().mockResolvedValue(updatedContract);

      await contractController.update(mockReq, mockRes);

      expect(contractService.updateContract).toHaveBeenCalledWith(contractId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedContract);
    });

    it('should return 500 on error', async () => {
      const contractId = 1;
      const updateData = { status: 'cancelled' };
      const error = new Error('Update error');

      mockReq.params.id = contractId;
      mockReq.body = updateData;
      contractService.updateContract = jest.fn().mockRejectedValue(error);

      await contractController.update(mockReq, mockRes);

      expect(contractService.updateContract).toHaveBeenCalledWith(contractId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete contract and return 204', async () => {
      const contractId = 1;
      mockReq.params.id = contractId;
      contractService.deleteContract = jest.fn().mockResolvedValue();

      await contractController.remove(mockReq, mockRes);

      expect(contractService.deleteContract).toHaveBeenCalledWith(contractId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const contractId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = contractId;
      contractService.deleteContract = jest.fn().mockRejectedValue(error);

      await contractController.remove(mockReq, mockRes);

      expect(contractService.deleteContract).toHaveBeenCalledWith(contractId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getReservationContract', () => {
    it('should return reservation contract with status 200', async () => {
      const reservationId = 1;
      const mockContract = { 
        id: 1, 
        terms: 'Contract terms', 
        status: 'active', 
        reservationId: 1 
      };

      mockReq.params.id = reservationId;
      contractService.getReservationContract = jest.fn().mockResolvedValue(mockContract);

      await contractController.getReservationContract(mockReq, mockRes);

      expect(contractService.getReservationContract).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockContract);
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const error = new Error('Database error');
      mockReq.params.id = reservationId;
      contractService.getReservationContract = jest.fn().mockRejectedValue(error);

      await contractController.getReservationContract(mockReq, mockRes);

      expect(contractService.getReservationContract).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});