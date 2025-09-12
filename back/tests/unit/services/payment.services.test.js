import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import paymentService from '../../../services/payment.services.js';
import db from '../../../models/index.js';

describe('Payment Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPayments', () => {
        it('should return all payments with reservations included', async () => {
            const mockPayments = [
                {
                    id: 1,
                    amount: 100,
                    status: 'completed',
                    Reservation: { id: 1, start_date: '2024-01-01' }
                },
                {
                    id: 2,
                    amount: 200,
                    status: 'pending',
                    Reservation: { id: 2, start_date: '2024-01-02' }
                }
            ];

            db.Payment.findAll = jest.fn().mockResolvedValue(mockPayments);
            const result = await paymentService.getAllPayments();

            expect(db.Payment.findAll).toHaveBeenCalledWith({
                include: db.Reservation
            });
            expect(result).toEqual(mockPayments);
        });
    });

    describe('createPayment', () => {
        it('should create and return a new payment', async () => {
            const newPayment = {
                amount: 150,
                status: 'pending',
                reservation_id: 1
            };
            const createdPayment = { id: 1, ...newPayment };

            db.Payment.create = jest.fn().mockResolvedValue(createdPayment);
            const result = await paymentService.createPayment(newPayment);

            expect(db.Payment.create).toHaveBeenCalledWith(newPayment);
            expect(result).toEqual(createdPayment);
        });
    });

    describe('getPaymentById', () => {
        it('should return a payment by ID with reservation included', async () => {
            const paymentId = 1;
            const mockPayment = {
                id: paymentId,
                amount: 100,
                status: 'completed',
                Reservation: { id: 1, start_date: '2024-01-01' }
            };

            db.Payment.findByPk = jest.fn().mockResolvedValue(mockPayment);
            const result = await paymentService.getPaymentById(paymentId);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId, {
                include: db.Reservation
            });
            expect(result).toEqual(mockPayment);
        });

        it('should return null if payment not found', async () => {
            const paymentId = 999;

            db.Payment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await paymentService.getPaymentById(paymentId);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId, {
                include: db.Reservation
            });
            expect(result).toBeNull();
        });
    });

    describe('updatePayment', () => {
        it('should update and return the payment', async () => {
            const paymentId = 1;
            const updateData = { status: 'completed', amount: 120 };
            const mockPayment = {
                id: paymentId,
                amount: 100,
                status: 'pending',
                update: jest.fn().mockResolvedValue({ id: paymentId, ...updateData })
            };

            db.Payment.findByPk = jest.fn().mockResolvedValue(mockPayment);
            const result = await paymentService.updatePayment(paymentId, updateData);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId);
            expect(mockPayment.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: paymentId, ...updateData });
        });

        it('should return null if payment not found', async () => {
            const paymentId = 999;
            const updateData = { status: 'completed' };

            db.Payment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await paymentService.updatePayment(paymentId, updateData);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId);
            expect(result).toBeNull();
        });
    });

    describe('deletePayment', () => {
        it('should delete the payment and return true', async () => {
            const paymentId = 1;
            const mockPayment = {
                id: paymentId,
                amount: 100,
                status: 'completed',
                destroy: jest.fn().mockResolvedValue()
            };

            db.Payment.findByPk = jest.fn().mockResolvedValue(mockPayment);
            const result = await paymentService.deletePayment(paymentId);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId);
            expect(mockPayment.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if payment not found', async () => {
            const paymentId = 999;

            db.Payment.findByPk = jest.fn().mockResolvedValue(null);
            const result = await paymentService.deletePayment(paymentId);

            expect(db.Payment.findByPk).toHaveBeenCalledWith(paymentId);
            expect(result).toBeNull();
        });
    });

    describe('getReservationPayments', () => {
        it('should return all payments for a specific reservation', async () => {
            const reservationId = 1;
            const mockPayments = [
                {
                    id: 1,
                    amount: 100,
                    status: 'completed',
                    reservation_id: reservationId,
                    Reservation: { id: reservationId, start_date: '2024-01-01' }
                },
                {
                    id: 2,
                    amount: 50,
                    status: 'refunded',
                    reservation_id: reservationId,
                    Reservation: { id: reservationId, start_date: '2024-01-01' }
                }
            ];

            db.Payment.findAll = jest.fn().mockResolvedValue(mockPayments);
            const result = await paymentService.getReservationPayments(reservationId);

            expect(db.Payment.findAll).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.Reservation
            });
            expect(result).toEqual(mockPayments);
        });

        it('should return empty array if no payments found for reservation', async () => {
            const reservationId = 999;

            db.Payment.findAll = jest.fn().mockResolvedValue([]);
            const result = await paymentService.getReservationPayments(reservationId);

            expect(db.Payment.findAll).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.Reservation
            });
            expect(result).toEqual([]);
        });
    });
});