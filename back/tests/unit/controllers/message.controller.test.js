import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/message.services.js');

// Import après le mock
import messageController from '../../../controllers/message.controller.js';
import messageService from '../../../services/message.services.js';

describe('Message Controller', () => {
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
    it('should return all messages with status 200', async () => {
      const mockMessages = [
        { id: 1, content: 'Hello!', senderId: 1, receiverId: 2, reservationId: 1 },
        { id: 2, content: 'Hi there!', senderId: 2, receiverId: 1, reservationId: 1 }
      ];

      messageService.getAllMessages = jest.fn().mockResolvedValue(mockMessages);

      await messageController.index(mockReq, mockRes);

      expect(messageService.getAllMessages).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      messageService.getAllMessages = jest.fn().mockRejectedValue(error);

      await messageController.index(mockReq, mockRes);

      expect(messageService.getAllMessages).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create message and return 201', async () => {
      const newMessage = { 
        content: 'Hello, how are you?', 
        senderId: 1, 
        receiverId: 2,
        reservationId: 1
      };
      const createdMessage = { id: 1, ...newMessage };

      mockReq.body = newMessage;
      messageService.createMessage = jest.fn().mockResolvedValue(createdMessage);

      await messageController.create(mockReq, mockRes);

      expect(messageService.createMessage).toHaveBeenCalledWith(newMessage);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdMessage);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { content: 'Test message', senderId: 1 };
      messageService.createMessage = jest.fn().mockRejectedValue(error);

      await messageController.create(mockReq, mockRes);

      expect(messageService.createMessage).toHaveBeenCalledWith({ 
        content: 'Test message', 
        senderId: 1 
      });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return message by ID with status 200', async () => {
      const messageId = 1;
      const mockMessage = { 
        id: messageId, 
        content: 'Hello!', 
        senderId: 1, 
        receiverId: 2,
        reservationId: 1 
      };

      mockReq.params.id = messageId;
      messageService.getMessageById = jest.fn().mockResolvedValue(mockMessage);

      await messageController.show(mockReq, mockRes);

      expect(messageService.getMessageById).toHaveBeenCalledWith(messageId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMessage);
    });

    it('should return 500 on error', async () => {
      const messageId = 1;
      const error = new Error('Database error');
      mockReq.params.id = messageId;
      messageService.getMessageById = jest.fn().mockRejectedValue(error);

      await messageController.show(mockReq, mockRes);

      expect(messageService.getMessageById).toHaveBeenCalledWith(messageId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update message and return 200', async () => {
      const messageId = 1;
      const updateData = { content: 'Updated message content' };
      const updatedMessage = { 
        id: messageId, 
        ...updateData, 
        senderId: 1, 
        receiverId: 2,
        reservationId: 1 
      };

      mockReq.params.id = messageId;
      mockReq.body = updateData;
      messageService.updateMessage = jest.fn().mockResolvedValue(updatedMessage);

      await messageController.update(mockReq, mockRes);

      expect(messageService.updateMessage).toHaveBeenCalledWith(messageId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedMessage);
    });

    it('should return 500 on error', async () => {
      const messageId = 1;
      const updateData = { content: 'Updated content' };
      const error = new Error('Update error');

      mockReq.params.id = messageId;
      mockReq.body = updateData;
      messageService.updateMessage = jest.fn().mockRejectedValue(error);

      await messageController.update(mockReq, mockRes);

      expect(messageService.updateMessage).toHaveBeenCalledWith(messageId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete message and return 204', async () => {
      const messageId = 1;
      mockReq.params.id = messageId;
      messageService.deleteMessage = jest.fn().mockResolvedValue();

      await messageController.remove(mockReq, mockRes);

      expect(messageService.deleteMessage).toHaveBeenCalledWith(messageId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const messageId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = messageId;
      messageService.deleteMessage = jest.fn().mockRejectedValue(error);

      await messageController.remove(mockReq, mockRes);

      expect(messageService.deleteMessage).toHaveBeenCalledWith(messageId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getUserMessages', () => {
    it('should return user messages with status 200', async () => {
      const userId = 1;
      const mockMessages = [
        { id: 1, content: 'Hello!', senderId: 1, receiverId: 2 },
        { id: 2, content: 'Hi!', senderId: 2, receiverId: 1 }
      ];

      mockReq.params.id = userId;
      messageService.getUserMessages = jest.fn().mockResolvedValue(mockMessages);

      await messageController.getUserMessages(mockReq, mockRes);

      expect(messageService.getUserMessages).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      messageService.getUserMessages = jest.fn().mockRejectedValue(error);

      await messageController.getUserMessages(mockReq, mockRes);

      expect(messageService.getUserMessages).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getReservationMessages', () => {
    it('should return reservation messages with status 200', async () => {
      const reservationId = 1;
      const mockMessages = [
        { id: 1, content: 'Hello!', senderId: 1, receiverId: 2, reservationId: 1 },
        { id: 2, content: 'Hi!', senderId: 2, receiverId: 1, reservationId: 1 }
      ];

      mockReq.params.id = reservationId;
      messageService.getReservationMessages = jest.fn().mockResolvedValue(mockMessages);

      await messageController.getReservationMessages(mockReq, mockRes);

      expect(messageService.getReservationMessages).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 500 on error', async () => {
      const reservationId = 1;
      const error = new Error('Database error');
      mockReq.params.id = reservationId;
      messageService.getReservationMessages = jest.fn().mockRejectedValue(error);

      await messageController.getReservationMessages(mockReq, mockRes);

      expect(messageService.getReservationMessages).toHaveBeenCalledWith(reservationId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});