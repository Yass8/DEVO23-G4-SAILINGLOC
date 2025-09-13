import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import contractService from '../../../services/contract.services.js';
import db from '../../../models/index.js';

describe('Contract Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllContracts', () => {
        it('should return all contracts with reservations included', async () => {
            const mockContracts = [
                {
                    id: 1,
                    contract_number: 'CONT-001',
                    status: 'signed',
                    Reservation: { id: 1, start_date: '2024-01-01' }
                },
                {
                    id: 2,
                    contract_number: 'CONT-002',
                    status: 'draft',
                    Reservation: { id: 2, start_date: '2024-01-02' }
                }
            ];

            db.Contract.findAll = jest.fn().mockResolvedValue(mockContracts);
            const result = await contractService.getAllContracts();

            expect(db.Contract.findAll).toHaveBeenCalledWith({
                include: db.Reservation
            });
            expect(result).toEqual(mockContracts);
        });
    });

    describe('createContract', () => {
        it('should create and return a new contract', async () => {
            const newContract = {
                contract_number: 'CONT-001',
                status: 'draft',
                reservation_id: 1,
                terms: 'Standard terms and conditions'
            };
            const createdContract = { id: 1, ...newContract };

            db.Contract.create = jest.fn().mockResolvedValue(createdContract);
            const result = await contractService.createContract(newContract);

            expect(db.Contract.create).toHaveBeenCalledWith(newContract);
            expect(result).toEqual(createdContract);
        });
    });

    describe('getContractById', () => {
        it('should return a contract by ID with reservation included', async () => {
            const contractId = 1;
            const mockContract = {
                id: contractId,
                contract_number: 'CONT-001',
                status: 'signed',
                Reservation: { id: 1, start_date: '2024-01-01' }
            };

            db.Contract.findByPk = jest.fn().mockResolvedValue(mockContract);
            const result = await contractService.getContractById(contractId);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId, {
                include: db.Reservation
            });
            expect(result).toEqual(mockContract);
        });

        it('should return null if contract not found', async () => {
            const contractId = 999;

            db.Contract.findByPk = jest.fn().mockResolvedValue(null);
            const result = await contractService.getContractById(contractId);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId, {
                include: db.Reservation
            });
            expect(result).toBeNull();
        });
    });

    describe('updateContract', () => {
        it('should update and return the contract', async () => {
            const contractId = 1;
            const updateData = { status: 'signed', signed_at: new Date() };
            const mockContract = {
                id: contractId,
                contract_number: 'CONT-001',
                status: 'draft',
                update: jest.fn().mockResolvedValue({ id: contractId, ...updateData })
            };

            db.Contract.findByPk = jest.fn().mockResolvedValue(mockContract);
            const result = await contractService.updateContract(contractId, updateData);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId);
            expect(mockContract.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: contractId, ...updateData });
        });

        it('should return null if contract not found', async () => {
            const contractId = 999;
            const updateData = { status: 'signed' };

            db.Contract.findByPk = jest.fn().mockResolvedValue(null);
            const result = await contractService.updateContract(contractId, updateData);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId);
            expect(result).toBeNull();
        });
    });

    describe('deleteContract', () => {
        it('should delete the contract and return true', async () => {
            const contractId = 1;
            const mockContract = {
                id: contractId,
                contract_number: 'CONT-001',
                status: 'signed',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Contract.findByPk = jest.fn().mockResolvedValue(mockContract);
            const result = await contractService.deleteContract(contractId);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId);
            expect(mockContract.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if contract not found', async () => {
            const contractId = 999;

            db.Contract.findByPk = jest.fn().mockResolvedValue(null);
            const result = await contractService.deleteContract(contractId);

            expect(db.Contract.findByPk).toHaveBeenCalledWith(contractId);
            expect(result).toBeNull();
        });
    });

    describe('getReservationContract', () => {
        it('should return contract for a specific reservation', async () => {
            const reservationId = 1;
            const mockContract = {
                id: 1,
                contract_number: 'CONT-001',
                status: 'signed',
                reservation_id: reservationId,
                Reservation: { id: reservationId, start_date: '2024-01-01' }
            };

            db.Contract.findOne = jest.fn().mockResolvedValue(mockContract);
            const result = await contractService.getReservationContract(reservationId);

            expect(db.Contract.findOne).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.Reservation
            });
            expect(result).toEqual(mockContract);
        });

        it('should return null if no contract found for reservation', async () => {
            const reservationId = 999;

            db.Contract.findOne = jest.fn().mockResolvedValue(null);
            const result = await contractService.getReservationContract(reservationId);

            expect(db.Contract.findOne).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.Reservation
            });
            expect(result).toBeNull();
        });
    });
});