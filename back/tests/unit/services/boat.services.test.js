import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');
jest.mock('sequelize');

// Import après le mock
import boatService from '../../../services/boat.services.js';
import db from '../../../models/index.js';
import { Op } from 'sequelize';

describe('Boat Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllBoats', () => {
        it('should return all boats with user, port and boat type included', async () => {
            const mockBoats = [
                {
                    id: 1,
                    name: 'Boat 1',
                    User: { id: 1, name: 'Owner 1' },
                    Port: { id: 1, name: 'Port 1' },
                    BoatType: { id: 1, name: 'Type 1' }
                },
                {
                    id: 2,
                    name: 'Boat 2',
                    User: { id: 2, name: 'Owner 2' },
                    Port: { id: 2, name: 'Port 2' },
                    BoatType: { id: 2, name: 'Type 2' }
                }
            ];

            db.Boat.findAll = jest.fn().mockResolvedValue(mockBoats);
            const result = await boatService.getAllBoats();

            expect(db.Boat.findAll).toHaveBeenCalledWith({
                include: [db.User, db.Port, db.BoatType]
            });
            expect(result).toEqual(mockBoats);
        });
    });

    describe('createBoat', () => {
        it('should create and return a new boat', async () => {
            const newBoat = {
                name: 'New Boat',
                daily_price: 200,
                user_id: 1,
                port_id: 1,
                type_id: 1
            };
            const createdBoat = { id: 1, ...newBoat };

            db.Boat.create = jest.fn().mockResolvedValue(createdBoat);
            const result = await boatService.createBoat(newBoat);

            expect(db.Boat.create).toHaveBeenCalledWith(newBoat);
            expect(result).toEqual(createdBoat);
        });
    });

    describe('getBoatById', () => {
        it('should return a boat by ID with user, port and boat type included', async () => {
            const boatId = 1;
            const mockBoat = {
                id: boatId,
                name: 'Boat 1',
                User: { id: 1, name: 'Owner 1' },
                Port: { id: 1, name: 'Port 1' },
                BoatType: { id: 1, name: 'Type 1' }
            };

            db.Boat.findByPk = jest.fn().mockResolvedValue(mockBoat);
            const result = await boatService.getBoatById(boatId);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId, {
                include: [db.User, db.Port, db.BoatType]
            });
            expect(result).toEqual(mockBoat);
        });

        it('should return null if boat not found', async () => {
            const boatId = 999;

            db.Boat.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatService.getBoatById(boatId);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId, {
                include: [db.User, db.Port, db.BoatType]
            });
            expect(result).toBeNull();
        });
    });

    describe('getBoatBySlug', () => {
        it('should return a boat by slug with detailed includes', async () => {
            const slug = 'boat-1';
            const mockBoat = {
                id: 1,
                name: 'Boat 1',
                slug: slug,
                Port: { id: 1, name: 'Port 1', city: 'City 1' },
                BoatType: { id: 1, name: 'Type 1' },
                BoatPhotos: [{ id: 1, photo_url: 'photo1.jpg', is_main: true }],
                BoatEquipments: [{ id: 1, equipment_name: 'GPS' }],
                Availabilities: [{ id: 1, start_date: '2024-01-01', end_date: '2024-01-10', status: 'available' }]
            };

            db.Boat.findOne = jest.fn().mockResolvedValue(mockBoat);
            const result = await boatService.getBoatBySlug(slug);

            expect(db.Boat.findOne).toHaveBeenCalledWith({
                where: { slug },
                include: [
                    { model: db.Port, attributes: ["id", "name", "city"] },
                    { model: db.BoatType, attributes: ["id", "name"] },
                    { model: db.BoatPhoto, attributes: ["id", "photo_url", "is_main"] },
                    { model: db.BoatEquipment, attributes: ["id", "equipment_name"] },
                    {
                        model: db.Availability,
                        attributes: ["id", "start_date", "end_date", "status"],
                        where: {
                            end_date: { [Op.gte]: expect.any(Date) }
                        }
                    }
                ]
            });
            expect(result).toEqual(mockBoat);
        });
    });

    describe('updateBoat', () => {
        it('should update and return the boat', async () => {
            const boatId = 1;
            const updateData = { name: 'Updated Boat', daily_price: 250 };
            const mockBoat = {
                id: boatId,
                name: 'Original Boat',
                daily_price: 200,
                update: jest.fn().mockResolvedValue({ id: boatId, ...updateData })
            };

            db.Boat.findByPk = jest.fn().mockResolvedValue(mockBoat);
            const result = await boatService.updateBoat(boatId, updateData);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId);
            expect(mockBoat.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: boatId, ...updateData });
        });

        it('should return null if boat not found', async () => {
            const boatId = 999;
            const updateData = { name: 'Updated Boat' };

            db.Boat.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatService.updateBoat(boatId, updateData);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId);
            expect(result).toBeNull();
        });
    });

    describe('deleteBoat', () => {
        it('should delete the boat and return true', async () => {
            const boatId = 1;
            const mockBoat = {
                id: boatId,
                name: 'Boat to delete',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Boat.findByPk = jest.fn().mockResolvedValue(mockBoat);
            const result = await boatService.deleteBoat(boatId);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId);
            expect(mockBoat.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if boat not found', async () => {
            const boatId = 999;

            db.Boat.findByPk = jest.fn().mockResolvedValue(null);
            const result = await boatService.deleteBoat(boatId);

            expect(db.Boat.findByPk).toHaveBeenCalledWith(boatId);
            expect(result).toBeNull();
        });
    });

    describe('getBoatPhotos', () => {
        it('should return all photos for a specific boat', async () => {
            const boatId = 1;
            const mockPhotos = [
                { id: 1, photo_url: 'photo1.jpg', is_main: true, boat_id: boatId },
                { id: 2, photo_url: 'photo2.jpg', is_main: false, boat_id: boatId }
            ];

            db.BoatPhoto.findAll = jest.fn().mockResolvedValue(mockPhotos);
            const result = await boatService.getBoatPhotos(boatId);

            expect(db.BoatPhoto.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId }
            });
            expect(result).toEqual(mockPhotos);
        });
    });

    describe('getBoatEquipments', () => {
        it('should return all equipments for a specific boat', async () => {
            const boatId = 1;
            const mockEquipments = [
                { id: 1, name: 'GPS', description: 'Navigation', boat_id: boatId },
                { id: 2, name: 'Radio', description: 'Communication', boat_id: boatId }
            ];

            db.BoatEquipment.findAll = jest.fn().mockResolvedValue(mockEquipments);
            const result = await boatService.getBoatEquipments(boatId);

            expect(db.BoatEquipment.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId }
            });
            expect(result).toEqual(mockEquipments);
        });
    });

    describe('getBoatAvailabilities', () => {
        it('should return all availabilities for a specific boat', async () => {
            const boatId = 1;
            const mockAvailabilities = [
                { id: 1, start_date: '2024-01-01', end_date: '2024-01-10', boat_id: boatId },
                { id: 2, start_date: '2024-02-01', end_date: '2024-02-10', boat_id: boatId }
            ];

            db.Availability.findAll = jest.fn().mockResolvedValue(mockAvailabilities);
            const result = await boatService.getBoatAvailabilities(boatId);

            expect(db.Availability.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId }
            });
            expect(result).toEqual(mockAvailabilities);
        });
    });

    describe('getBoatReviews', () => {
        it('should return all reviews for a specific boat with user included', async () => {
            const boatId = 1;
            const mockReviews = [
                {
                    id: 1,
                    rating: 5,
                    comment: 'Excellent',
                    boat_id: boatId,
                    User: { id: 1, name: 'Reviewer 1' }
                },
                {
                    id: 2,
                    rating: 4,
                    comment: 'Very good',
                    boat_id: boatId,
                    User: { id: 2, name: 'Reviewer 2' }
                }
            ];

            db.Review.findAll = jest.fn().mockResolvedValue(mockReviews);
            const result = await boatService.getBoatReviews(boatId);

            expect(db.Review.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.User
            });
            expect(result).toEqual(mockReviews);
        });
    });

    describe('getBoatReservations', () => {
        it('should return all reservations for a specific boat with user included', async () => {
            const boatId = 1;
            const mockReservations = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-05',
                    boat_id: boatId,
                    User: { id: 1, name: 'Renter 1' }
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-05',
                    boat_id: boatId,
                    User: { id: 2, name: 'Renter 2' }
                }
            ];

            db.Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);
            const result = await boatService.getBoatReservations(boatId);

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.User
            });
            expect(result).toEqual(mockReservations);
        });
    });

    describe('getFilteredBoats', () => {
        it('should return filtered boats with pagination', async () => {
            const filters = {
                startDate: '2024-01-01',
                endDate: '2024-01-10',
                port: '1',
                type: '2',
                capacity: '4',
                price: '300',
                length: '10',
                search: 'sail',
                page: '0',
                limit: '9'
            };

            const mockResult = {
                count: 5,
                rows: [
                    { id: 1, name: 'Sailboat 1', daily_price: 200 },
                    { id: 2, name: 'Sailboat 2', daily_price: 250 }
                ]
            };

            db.Boat.findAndCountAll = jest.fn().mockResolvedValue(mockResult);

            const result = await boatService.getFilteredBoats(filters);

            expect(db.Boat.findAndCountAll).toHaveBeenCalled();
            expect(result).toEqual({
                total: mockResult.count,
                boats: mockResult.rows,
                page: 0,
                pages: Math.ceil(mockResult.count / 9)
            });
        });

        it('should handle filters without dates', async () => {
            const filters = {
                port: '1',
                type: '2',
                page: '0',
                limit: '9'
            };

            const mockResult = {
                count: 3,
                rows: [
                    { id: 1, name: 'Boat 1', daily_price: 200 },
                    { id: 2, name: 'Boat 2', daily_price: 250 }
                ]
            };

            db.Boat.findAndCountAll = jest.fn().mockResolvedValue(mockResult);

            const result = await boatService.getFilteredBoats(filters);

            expect(db.Boat.findAndCountAll).toHaveBeenCalled();
            expect(result.total).toBe(3);
        });
    });
});