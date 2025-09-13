import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/contact.services.js');

// Import après le mock
import contactController from '../../../controllers/contact.controller.js';
import contactServices from '../../../services/contact.services.js';

describe('Contact Controller', () => {
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

  describe('sendContactForm', () => {
    it('should send contact form and return success message with status 200', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question about service',
        message: 'I have a question about your services.'
      };

      mockReq.body = contactData;
      contactServices.sendContact = jest.fn().mockResolvedValue();

      await contactController.sendContactForm(mockReq, mockRes);

      expect(contactServices.sendContact).toHaveBeenCalledWith(contactData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Votre message a été envoyé avec succès."
      });
    });

    it('should return 500 on error', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question about service',
        message: 'I have a question about your services.'
      };
      const error = new Error('Email sending failed');

      mockReq.body = contactData;
      contactServices.sendContact = jest.fn().mockRejectedValue(error);

      await contactController.sendContactForm(mockReq, mockRes);

      expect(contactServices.sendContact).toHaveBeenCalledWith(contactData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle empty request body', async () => {
      const contactData = {};
      const error = new Error('Validation error');

      mockReq.body = contactData;
      contactServices.sendContact = jest.fn().mockRejectedValue(error);

      await contactController.sendContactForm(mockReq, mockRes);

      expect(contactServices.sendContact).toHaveBeenCalledWith(contactData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle partial contact data', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com'
        // Missing subject and message
      };
      const error = new Error('Missing required fields');

      mockReq.body = contactData;
      contactServices.sendContact = jest.fn().mockRejectedValue(error);

      await contactController.sendContactForm(mockReq, mockRes);

      expect(contactServices.sendContact).toHaveBeenCalledWith(contactData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});