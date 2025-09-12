import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import messageService from '../../../services/message.services.js';
import db from '../../../models/index.js';

describe('Message Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllMessages', () => {
        it('should return all messages with senders, receivers and reservations included', async () => {
            const mockMessages = [
                {
                    id: 1,
                    content: 'Hello',
                    is_read: false,
                    Sender: { id: 1, name: 'Sender 1' },
                    Receiver: { id: 2, name: 'Receiver 1' },
                    Reservation: { id: 1, start_date: '2024-01-01' }
                },
                {
                    id: 2,
                    content: 'Hi there',
                    is_read: true,
                    Sender: { id: 2, name: 'Sender 2' },
                    Receiver: { id: 1, name: 'Receiver 2' },
                    Reservation: { id: 2, start_date: '2024-01-02' }
                }
            ];

            db.Message.findAll = jest.fn().mockResolvedValue(mockMessages);
            const result = await messageService.getAllMessages();

            expect(db.Message.findAll).toHaveBeenCalledWith({
                include: [
                    { model: db.User, as: 'Sender' },
                    { model: db.User, as: 'Receiver' },
                    { model: db.Reservation }
                ]
            });
            expect(result).toEqual(mockMessages);
        });
    });

    describe('createMessage', () => {
        it('should create and return a new message', async () => {
            const newMessage = {
                content: 'Test message',
                sender_id: 1,
                receiver_id: 2,
                reservation_id: 1,
                is_read: false
            };
            const createdMessage = { id: 1, ...newMessage };

            db.Message.create = jest.fn().mockResolvedValue(createdMessage);
            const result = await messageService.createMessage(newMessage);

            expect(db.Message.create).toHaveBeenCalledWith(newMessage);
            expect(result).toEqual(createdMessage);
        });
    });

    describe('getMessageById', () => {
        it('should return a message by ID with user and reservation included', async () => {
            const messageId = 1;
            const mockMessage = {
                id: messageId,
                content: 'Test message',
                is_read: false,
                User: { id: 1, name: 'User 1' },
                Reservation: { id: 1, start_date: '2024-01-01' }
            };

            db.Message.findByPk = jest.fn().mockResolvedValue(mockMessage);
            const result = await messageService.getMessageById(messageId);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId, {
                include: [db.User, db.Reservation]
            });
            expect(result).toEqual(mockMessage);
        });

        it('should return null if message not found', async () => {
            const messageId = 999;

            db.Message.findByPk = jest.fn().mockResolvedValue(null);
            const result = await messageService.getMessageById(messageId);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId, {
                include: [db.User, db.Reservation]
            });
            expect(result).toBeNull();
        });
    });

    describe('updateMessage', () => {
        it('should update and return the message', async () => {
            const messageId = 1;
            const updateData = { is_read: true };
            const mockMessage = {
                id: messageId,
                content: 'Test message',
                is_read: false,
                update: jest.fn().mockResolvedValue({ id: messageId, ...updateData })
            };

            db.Message.findByPk = jest.fn().mockResolvedValue(mockMessage);
            const result = await messageService.updateMessage(messageId, updateData);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId);
            expect(mockMessage.update).toHaveBeenCalledWith(updateData);
            expect(result).toEqual({ id: messageId, ...updateData });
        });

        it('should return null if message not found', async () => {
            const messageId = 999;
            const updateData = { is_read: true };

            db.Message.findByPk = jest.fn().mockResolvedValue(null);
            const result = await messageService.updateMessage(messageId, updateData);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId);
            expect(result).toBeNull();
        });
    });

    describe('deleteMessage', () => {
        it('should delete the message and return true', async () => {
            const messageId = 1;
            const mockMessage = {
                id: messageId,
                content: 'Test message',
                is_read: false,
                destroy: jest.fn().mockResolvedValue()
            };

            db.Message.findByPk = jest.fn().mockResolvedValue(mockMessage);
            const result = await messageService.deleteMessage(messageId);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId);
            expect(mockMessage.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should return null if message not found', async () => {
            const messageId = 999;

            db.Message.findByPk = jest.fn().mockResolvedValue(null);
            const result = await messageService.deleteMessage(messageId);

            expect(db.Message.findByPk).toHaveBeenCalledWith(messageId);
            expect(result).toBeNull();
        });
    });

    describe('getUserMessages', () => {
        it('should return all messages for a specific user', async () => {
            const userId = 1;
            const mockMessages = [
                {
                    id: 1,
                    content: 'Message 1',
                    sender_id: userId,
                    is_read: false,
                    User: { id: 1, name: 'User 1' },
                    Reservation: { id: 1, start_date: '2024-01-01' }
                },
                {
                    id: 2,
                    content: 'Message 2',
                    sender_id: userId,
                    is_read: true,
                    User: { id: 1, name: 'User 1' },
                    Reservation: { id: 2, start_date: '2024-01-02' }
                }
            ];

            db.Message.findAll = jest.fn().mockResolvedValue(mockMessages);
            const result = await messageService.getUserMessages(userId);

            expect(db.Message.findAll).toHaveBeenCalledWith({
                where: { sender_id: userId },
                include: [db.User, db.Reservation]
            });
            expect(result).toEqual(mockMessages);
        });

        it('should return empty array if no messages found for user', async () => {
            const userId = 999;

            db.Message.findAll = jest.fn().mockResolvedValue([]);
            const result = await messageService.getUserMessages(userId);

            expect(db.Message.findAll).toHaveBeenCalledWith({
                where: { sender_id: userId },
                include: [db.User, db.Reservation]
            });
            expect(result).toEqual([]);
        });
    });

    describe('getReservationMessages', () => {
        it('should return all messages for a specific reservation', async () => {
            const reservationId = 1;
            const mockMessages = [
                {
                    id: 1,
                    content: 'Reservation message 1',
                    reservation_id: reservationId,
                    is_read: false,
                    User: { id: 1, name: 'User 1' }
                },
                {
                    id: 2,
                    content: 'Reservation message 2',
                    reservation_id: reservationId,
                    is_read: true,
                    User: { id: 2, name: 'User 2' }
                }
            ];

            db.Message.findAll = jest.fn().mockResolvedValue(mockMessages);
            const result = await messageService.getReservationMessages(reservationId);

            expect(db.Message.findAll).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.User
            });
            expect(result).toEqual(mockMessages);
        });

        it('should return empty array if no messages found for reservation', async () => {
            const reservationId = 999;

            db.Message.findAll = jest.fn().mockResolvedValue([]);
            const result = await messageService.getReservationMessages(reservationId);

            expect(db.Message.findAll).toHaveBeenCalledWith({
                where: { reservation_id: reservationId },
                include: db.User
            });
            expect(result).toEqual([]);
        });
    });
});