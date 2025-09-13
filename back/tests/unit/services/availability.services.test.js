import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import availabilityService from '../../../services/availability.services.js';
import db from '../../../models/index.js';

describe('Availability Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAvailabilities', () => {
        it('should return all availabilities', async () => {
            const mockAvailabilities = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-10',
                    boat_id: 1
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-10',
                    boat_id: 2
                }
            ];

            db.Availability.findAll = jest.fn().mockResolvedValue(mockAvailabilities);
            const result = await availabilityService.getAllAvailabilities();

            expect(db.Availability.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockAvailabilities);
        });
    });

    describe('createAvailability', () => {
        it('should create and return a new availability', async () => {
            const newAvailability = {
                start_date: '2024-01-01',
                end_date: '2024-01-10',
                boat_id: 1
            };
            const createdAvailability = { id: 1, ...newAvailability };

            db.Availability.create = jest.fn().mockResolvedValue(createdAvailability);
            const result = await availabilityService.createAvailability(newAvailability);

            expect(db.Availability.create).toHaveBeenCalledWith(newAvailability);
            expect(result).toEqual(createdAvailability);
        });
    });

    describe('getAvailabilityById', () => {
        it('should return an availability by ID', async () => {
            const availabilityId = 1;
            const mockAvailability = {
                id: availabilityId,
                start_date: '2024-01-01',
                end_date: '2024-01-10',
                boat_id: 1
            };

            db.Availability.findByPk = jest.fn().mockResolvedValue(mockAvailability);
            const result = await availabilityService.getAvailabilityById(availabilityId);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(result).toEqual(mockAvailability);
        });

        it('should return null if availability not found', async () => {
            const availabilityId = 999;

            db.Availability.findByPk = jest.fn().mockResolvedValue(null);
            const result = await availabilityService.getAvailabilityById(availabilityId);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(result).toBeNull();
        });
    });

    describe('updateAvailability', () => {
        it('should update and return the availability', async () => {
            const availabilityId = 1;
            const updateData = { end_date: '2024-01-15', price_per_day: 150 };
            const mockAvailability = {
                id: availabilityId,
                start_date: '2024-01-01',
                end_date: '2024-01-10',
                price_per_day: 100,
                update: jest.fn().mockResolvedValue({ id: availabilityId, ...updateData })
            };

            db.Availability.findByPk = jest.fn().mockResolvedValue(mockAvailability);
            const result = await availabilityService.updateAvailability(availabilityId, updateData);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(mockAvailability.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: availabilityId, ...updateData });
        });

        it('should return null if availability not found', async () => {
            const availabilityId = 999;
            const updateData = { end_date: '2024-01-15' };

            db.Availability.findByPk = jest.fn().mockResolvedValue(null);
            const result = await availabilityService.updateAvailability(availabilityId, updateData);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(result).toBeNull();
        });
    });

    describe('deleteAvailability', () => {
        it('should delete the availability and return true', async () => {
            const availabilityId = 1;
            const mockAvailability = {
                id: availabilityId,
                start_date: '2024-01-01',
                end_date: '2024-01-10',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Availability.findByPk = jest.fn().mockResolvedValue(mockAvailability);
            const result = await availabilityService.deleteAvailability(availabilityId);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(mockAvailability.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if availability not found', async () => {
            const availabilityId = 999;

            db.Availability.findByPk = jest.fn().mockResolvedValue(null);
            const result = await availabilityService.deleteAvailability(availabilityId);

            expect(db.Availability.findByPk).toHaveBeenCalledWith(availabilityId);
            expect(result).toBeNull();
        });
    });

    describe('getBoatAvailabilities', () => {
        it('should return all availabilities for a specific boat with boat included', async () => {
            const boatId = 1;
            const mockAvailabilities = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-10',
                    boat_id: boatId,
                    Boat: { id: boatId, name: 'Boat 1' }
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-10',
                    boat_id: boatId,
                    Boat: { id: boatId, name: 'Boat 1' }
                }
            ];

            db.Availability.findAll = jest.fn().mockResolvedValue(mockAvailabilities);
            const result = await availabilityService.getBoatAvailabilities(boatId);

            expect(db.Availability.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.Boat
            });
            expect(result).toEqual(mockAvailabilities);
        });

        it('should return empty array if no availabilities found for boat', async () => {
            const boatId = 999;

            db.Availability.findAll = jest.fn().mockResolvedValue([]);
            const result = await availabilityService.getBoatAvailabilities(boatId);

            expect(db.Availability.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.Boat
            });
            expect(result).toEqual([]);
        });
    });
});