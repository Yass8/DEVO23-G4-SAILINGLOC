import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import portService from '../../../services/port.services.js';
import db from '../../../models/index.js';

describe('Port Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPorts', () => {
        it('should return all ports with boats included', async () => {
            const mockPorts = [
                {
                    id: 1,
                    name: 'Port 1',
                    Boats: [{ id: 1, name: 'Boat 1' }]
                },
                {
                    id: 2,
                    name: 'Port 2',
                    Boats: [{ id: 2, name: 'Boat 2' }]
                }
            ];

            db.Port.findAll = jest.fn().mockResolvedValue(mockPorts);
            const result = await portService.getAllPorts();

            expect(db.Port.findAll).toHaveBeenCalledWith({
                include: db.Boat
            });
            expect(result).toEqual(mockPorts);
        });
    });

    describe('createPort', () => {
        it('should create and return a new port', async () => {
            const newPort = {
                name: 'New Port',
                location: 'Location',
                capacity: 50
            };
            const createdPort = { id: 1, ...newPort };

            db.Port.create = jest.fn().mockResolvedValue(createdPort);
            const result = await portService.createPort(newPort);

            expect(db.Port.create).toHaveBeenCalledWith(newPort);
            expect(result).toEqual(createdPort);
        });
    });

    describe('getPortById', () => {
        it('should return a port by ID with boats included', async () => {
            const portId = 1;
            const mockPort = {
                id: portId,
                name: 'Port 1',
                Boats: [{ id: 1, name: 'Boat 1' }]
            };

            db.Port.findByPk = jest.fn().mockResolvedValue(mockPort);
            const result = await portService.getPortById(portId);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId, {
                include: db.Boat
            });
            expect(result).toEqual(mockPort);
        });

        it('should return null if port not found', async () => {
            const portId = 999;

            db.Port.findByPk = jest.fn().mockResolvedValue(null);
            const result = await portService.getPortById(portId);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId, {
                include: db.Boat
            });
            expect(result).toBeNull();
        });
    });

    describe('updatePort', () => {
        it('should update and return the port', async () => {
            const portId = 1;
            const updateData = { name: 'Updated Port', capacity: 100 };
            const mockPort = {
                id: portId,
                name: 'Original Port',
                capacity: 50,
                update: jest.fn().mockResolvedValue({ id: portId, ...updateData })
            };

            db.Port.findByPk = jest.fn().mockResolvedValue(mockPort);
            const result = await portService.updatePort(portId, updateData);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId);
            expect(mockPort.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: portId, ...updateData });
        });

        it('should return null if port not found', async () => {
            const portId = 999;
            const updateData = { name: 'Updated Port' };

            db.Port.findByPk = jest.fn().mockResolvedValue(null);
            const result = await portService.updatePort(portId, updateData);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId);
            expect(result).toBeNull();
        });
    });

    describe('deletePort', () => {
        it('should delete the port and return true', async () => {
            const portId = 1;
            const mockPort = {
                id: portId,
                name: 'Port to delete',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Port.findByPk = jest.fn().mockResolvedValue(mockPort);
            const result = await portService.deletePort(portId);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId);
            expect(mockPort.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if port not found', async () => {
            const portId = 999;

            db.Port.findByPk = jest.fn().mockResolvedValue(null);
            const result = await portService.deletePort(portId);

            expect(db.Port.findByPk).toHaveBeenCalledWith(portId);
            expect(result).toBeNull();
        });
    });
});