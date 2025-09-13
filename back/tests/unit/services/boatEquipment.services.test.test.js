import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import boatEquipmentService from '../../../services/boatEquipment.services.js';
import db from '../../../models/index.js';

describe('BoatEquipment Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBoatEquipments', () => {
        it('should return all boat equipments with boats included', async () => {
            const mockEquipments = [
                {
                    id: 1,
                    name: 'GPS',
                    description: 'Navigation system',
                    Boat: { id: 1, name: 'Boat 1' }
                },
                {
                    id: 2,
                    name: 'Anchor',
                    description: 'Heavy anchor',
                    Boat: { id: 2, name: 'Boat 2' }
                }
            ];

            db.BoatEquipment.findAll = jest.fn().mockResolvedValue(mockEquipments);
            const result = await boatEquipmentService.getAllBoatEquipments();

            expect(db.BoatEquipment.findAll).toHaveBeenCalledWith({
                include: db.Boat
            });
            expect(result).toEqual(mockEquipments);
        });
    });

    describe('createBoatEquipment', () => {
        it('should create multiple boat equipments using bulkCreate', async () => {
            const newEquipments = [
                { name: 'GPS', description: 'Navigation system', boat_id: 1 },
                { name: 'Radio', description: 'Communication radio', boat_id: 1 }
            ];
            const createdEquipments = [
                { id: 1, ...newEquipments[0] },
                { id: 2, ...newEquipments[1] }
            ];

            db.BoatEquipment.bulkCreate = jest.fn().mockResolvedValue(createdEquipments);
            const result = await boatEquipmentService.createBoatEquipment(newEquipments);

            expect(db.BoatEquipment.bulkCreate).toHaveBeenCalledWith(newEquipments);
            expect(result).toEqual(createdEquipments);
        });
    });

    describe('getBoatEquipmentById', () => {
        it('should return a boat equipment by ID with boat included', async () => {
            const equipmentId = 1;
            const mockEquipment = {
                id: equipmentId,
                name: 'GPS',
                description: 'Navigation system',
                Boat: { id: 1, name: 'Boat 1' }
            };

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(mockEquipment);
            const result = await boatEquipmentService.getBoatEquipmentById(equipmentId);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId, {
                include: db.Boat
            });
            expect(result).toEqual(mockEquipment);
        });

        it('should return null if equipment not found', async () => {
            const equipmentId = 999;

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatEquipmentService.getBoatEquipmentById(equipmentId);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId, {
                include: db.Boat
            });
            expect(result).toBeNull();
        });
    });

    describe('updateBoatEquipment', () => {
        it('should update and return the boat equipment', async () => {
            const equipmentId = 1;
            const updateData = { name: 'Updated GPS', description: 'New navigation system' };
            const mockEquipment = {
                id: equipmentId,
                name: 'GPS',
                description: 'Navigation system',
                update: jest.fn().mockResolvedValue({ id: equipmentId, ...updateData })
            };

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(mockEquipment);
            const result = await boatEquipmentService.updateBoatEquipment(equipmentId, updateData);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId);
            expect(mockEquipment.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: equipmentId, ...updateData });
        });

        it('should return null if equipment not found', async () => {
            const equipmentId = 999;
            const updateData = { name: 'Updated GPS' };

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatEquipmentService.updateBoatEquipment(equipmentId, updateData);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId);
            expect(result).toBeNull();
        });
    });

    describe('deleteBoatEquipment', () => {
        it('should delete the boat equipment and return true', async () => {
            const equipmentId = 1;
            const mockEquipment = {
                id: equipmentId,
                name: 'GPS',
                description: 'Navigation system',
                destroy: jest.fn().mockResolvedValue()
            };

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(mockEquipment);
            const result = await boatEquipmentService.deleteBoatEquipment(equipmentId);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId);
            expect(mockEquipment.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if equipment not found', async () => {
            const equipmentId = 999;

            db.BoatEquipment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatEquipmentService.deleteBoatEquipment(equipmentId);

            expect(db.BoatEquipment.findByPk).toHaveBeenCalledWith(equipmentId);
            expect(result).toBeNull();
        });
    });

    describe('getBoatEquipments', () => {
        it('should return all equipments for a specific boat', async () => {
            const boatId = 1;
            const mockEquipments = [
                { id: 1, name: 'GPS', description: 'Navigation system', boat_id: boatId },
                { id: 2, name: 'Radio', description: 'Communication radio', boat_id: boatId }
            ];

            db.BoatEquipment.findAll = jest.fn().mockResolvedValue(mockEquipments);
            const result = await boatEquipmentService.getBoatEquipments(boatId);

            expect(db.BoatEquipment.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId }
            });
            expect(result).toEqual(mockEquipments);
        });

        it('should return empty array if no equipments found for boat', async () => {
            const boatId = 999;

            db.BoatEquipment.findAll = jest.fn().mockResolvedValue([]);
            const result = await boatEquipmentService.getBoatEquipments(boatId);

            expect(db.BoatEquipment.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId }
            });
            expect(result).toEqual([]);
        });
    });
});