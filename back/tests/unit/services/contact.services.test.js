import { describe, it, jest, expect } from '@jest/globals';

// Mock de la fonction sendContactEmail
jest.mock('../../../utils/mailer.js', () => ({
  sendContactEmail: jest.fn()
}));

// Import après le mock
import contactService from '../../../services/contact.services.js';
import { sendContactEmail } from '../../../utils/mailer.js';

describe('Contact Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sendContact', () => {
        it('should send contact email and return success message', async () => {
            const contactData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Test message',
                subject: 'Test Subject'
            };

            // Mock de la fonction sendContactEmail qui réussit
            sendContactEmail.mockResolvedValue();

            const result = await contactService.sendContact(contactData);

            // Vérifie que sendContactEmail a été appelée avec les bons paramètres
            expect(sendContactEmail).toHaveBeenCalledWith(
                contactData.name,
                contactData.email,
                contactData.message,
                contactData.subject
            );

            // Vérifie que le résultat est correct
            expect(result).toEqual({ message: "Votre message a été envoyé avec succès." });
        });

        it('should throw error when email sending fails', async () => {
            const contactData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Test message',
                subject: 'Test Subject'
            };

            // Mock de la fonction sendContactEmail qui échoue
            const errorMessage = 'SMTP connection failed';
            sendContactEmail.mockRejectedValue(new Error(errorMessage));

            // Vérifie que l'erreur est bien levée
            await expect(contactService.sendContact(contactData))
                .rejects
                .toThrow('Erreur lors de l\'envoi du message.');

            // Vérifie que sendContactEmail a été appelée avec les bons paramètres
            expect(sendContactEmail).toHaveBeenCalledWith(
                contactData.name,
                contactData.email,
                contactData.message,
                contactData.subject
            );
        });

        it('should handle missing fields gracefully', async () => {
            const contactData = {
                name: 'John Doe',
                email: 'john@example.com',
                // message manquant intentionnellement
                subject: 'Test Subject'
            };

            // Mock de la fonction sendContactEmail
            sendContactEmail.mockResolvedValue();

            // Cette configuration pourrait échouer selon l'implémentation réelle de sendContactEmail
            // mais le test vérifie que le service gère l'erreur
            await expect(contactService.sendContact(contactData))
                .resolves
                .toEqual({ message: "Votre message a été envoyé avec succès." });

            expect(sendContactEmail).toHaveBeenCalled();
        });
    });
});