import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import reservationService from '../../../services/reservation.services.js';
import db from '../../../models/index.js';

describe('Reservation Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReservations', () => {
        it('should return all reservations with users and boats included', async () => {
            const mockReservations = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-05',
                    status: 'confirmed',
                    User: { id: 1, name: 'User 1' },
                    Boat: { id: 1, name: 'Boat 1' }
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-05',
                    status: 'pending',
                    User: { id: 2, name: 'User 2' },
                    Boat: { id: 2, name: 'Boat 2' }
                }
            ];

            db.Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);
            const result = await reservationService.getAllReservations();

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                include: [db.User, db.Boat]
            });
            expect(result).toEqual(mockReservations);
        });
    });

    describe('createReservation', () => {
        it('should create and return a new reservation', async () => {
            const newReservation = {
                start_date: '2024-01-01',
                end_date: '2024-01-05',
                user_id: 1,
                boat_id: 1,
                status: 'pending',
                total_price: 500
            };
            const createdReservation = { id: 1, ...newReservation };

            db.Reservation.create = jest.fn().mockResolvedValue(createdReservation);
            const result = await reservationService.createReservation(newReservation);

            expect(db.Reservation.create).toHaveBeenCalledWith(newReservation);
            expect(result).toEqual(createdReservation);
        });
    });

    describe('getReservationById', () => {
        it('should return a reservation by ID with user, boat, payment and contract included', async () => {
            const reservationId = 1;
            const mockReservation = {
                id: reservationId,
                start_date: '2024-01-01',
                end_date: '2024-01-05',
                status: 'confirmed',
                User: { id: 1, name: 'User 1' },
                Boat: { id: 1, name: 'Boat 1' },
                Payment: { id: 1, amount: 500, status: 'completed' },
                Contract: { id: 1, contract_number: 'CONT-001', status: 'signed' }
            };

            db.Reservation.findByPk = jest.fn().mockResolvedValue(mockReservation);
            const result = await reservationService.getReservationById(reservationId);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId, {
                include: [db.User, db.Boat, db.Payment, db.Contract]
            });
            expect(result).toEqual(mockReservation);
        });

        it('should return null if reservation not found', async () => {
            const reservationId = 999;

            db.Reservation.findByPk = jest.fn().mockResolvedValue(null);
            const result = await reservationService.getReservationById(reservationId);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId, {
                include: [db.User, db.Boat, db.Payment, db.Contract]
            });
            expect(result).toBeNull();
        });
    });

    describe('updateReservation', () => {
        it('should update and return the reservation', async () => {
            const reservationId = 1;
            const updateData = { status: 'confirmed', total_price: 550 };
            const mockReservation = {
                id: reservationId,
                start_date: '2024-01-01',
                end_date: '2024-01-05',
                status: 'pending',
                total_price: 500,
                update: jest.fn().mockResolvedValue({ id: reservationId, ...updateData })
            };

            db.Reservation.findByPk = jest.fn().mockResolvedValue(mockReservation);
            const result = await reservationService.updateReservation(reservationId, updateData);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId);
            expect(mockReservation.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: reservationId, ...updateData });
        });

        it('should return null if reservation not found', async () => {
            const reservationId = 999;
            const updateData = { status: 'confirmed' };

            db.Reservation.findByPk = jest.fn().mockResolvedValue(null);
            const result = await reservationService.updateReservation(reservationId, updateData);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId);
            expect(result).toBeNull();
        });
    });

    describe('deleteReservation', () => {
        it('should delete the reservation and return true', async () => {
            const reservationId = 1;
            const mockReservation = {
                id: reservationId,
                start_date: '2024-01-01',
                end_date: '2024-01-05',
                status: 'confirmed',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Reservation.findByPk = jest.fn().mockResolvedValue(mockReservation);
            const result = await reservationService.deleteReservation(reservationId);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId);
            expect(mockReservation.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if reservation not found', async () => {
            const reservationId = 999;

            db.Reservation.findByPk = jest.fn().mockResolvedValue(null);
            const result = await reservationService.deleteReservation(reservationId);

            expect(db.Reservation.findByPk).toHaveBeenCalledWith(reservationId);
            expect(result).toBeNull();
        });
    });

    describe('getUserBookings', () => {
        it('should return all reservations for a specific user', async () => {
            const userId = 1;
            const mockReservations = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-05',
                    status: 'confirmed',
                    user_id: userId,
                    Boat: { id: 1, name: 'Boat 1' }
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-05',
                    status: 'completed',
                    user_id: userId,
                    Boat: { id: 2, name: 'Boat 2' }
                }
            ];

            db.Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);
            const result = await reservationService.getUserBookings(userId);

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                include: db.Boat
            });
            expect(result).toEqual(mockReservations);
        });

        it('should return empty array if no reservations found for user', async () => {
            const userId = 999;

            db.Reservation.findAll = jest.fn().mockResolvedValue([]);
            const result = await reservationService.getUserBookings(userId);

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                include: db.Boat
            });
            expect(result).toEqual([]);
        });
    });

    describe('getBoatReservations', () => {
        it('should return all reservations for a specific boat', async () => {
            const boatId = 1;
            const mockReservations = [
                {
                    id: 1,
                    start_date: '2024-01-01',
                    end_date: '2024-01-05',
                    status: 'confirmed',
                    boat_id: boatId,
                    User: { id: 1, name: 'User 1' }
                },
                {
                    id: 2,
                    start_date: '2024-02-01',
                    end_date: '2024-02-05',
                    status: 'completed',
                    boat_id: boatId,
                    User: { id: 2, name: 'User 2' }
                }
            ];

            db.Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);
            const result = await reservationService.getBoatReservations(boatId);

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.User
            });
            expect(result).toEqual(mockReservations);
        });

        it('should return empty array if no reservations found for boat', async () => {
            const boatId = 999;

            db.Reservation.findAll = jest.fn().mockResolvedValue([]);
            const result = await reservationService.getBoatReservations(boatId);

            expect(db.Reservation.findAll).toHaveBeenCalledWith({
                where: { boat_id: boatId },
                include: db.User
            });
            expect(result).toEqual([]);
        });
    });
});