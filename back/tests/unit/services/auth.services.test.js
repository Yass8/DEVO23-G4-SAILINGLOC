import { describe, it, jest, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock des dépendances externes - VERSION CORRIGÉE
jest.mock('../../../models/index.js', () => {
    return {
        User: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
            // Ajoutez d'autres méthodes si nécessaire
        },
        Boat: {},
        Reservation: {},
        Message: {},
        Review: {},
        UserDocument: {},
    };
});

jest.mock('../../../utils/sanitize.js', () => ({
    sanitizeUser: jest.fn()
}));

jest.mock('../../../utils/mailer.js', () => ({
    sendConfirmationEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

// Import après les mocks
import authService from '../../../services/auth.services.js';
import db from '../../../models/index.js';
import { sanitizeUser } from '../../../utils/sanitize.js';
import { sendConfirmationEmail, sendResetPasswordEmail } from '../../../utils/mailer.js';

// Mock des variables d'environnement
process.env.SECRET_KEY = 'test-secret-key';
process.env.EXPIRATION_TIME = '1h';

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // describe('generateToken', () => {
    //     it('should generate a token with payload and expiration', () => {
    //         const payload = { id: 1, roles: ['user'] };
    //         const mockToken = 'mock-jwt-token';

    //         // jwt.sign.mockReturnValue(mockToken);
    //         jwt.sign = jest.fn().mockReturnValue(mockToken);

    //         const result = authService.generateToken(payload);

    //         expect(jwt.sign).toHaveBeenCalledWith(
    //             payload,
    //             process.env.SECRET_KEY,
    //             { expiresIn: process.env.EXPIRATION_TIME }
    //         );
    //         expect(result).toBe(mockToken);
    //     });

    //     it('should generate a token with custom expiration', () => {
    //         const payload = { id: 1 };
    //         const customExpiration = '2h';
    //         const mockToken = 'mock-jwt-token';

    //         // jwt.sign.mockReturnValue(mockToken);
    //         jwt.sign = jest.fn().mockReturnValue(mockToken);

    //         const result = authService.generateToken(payload, customExpiration);

    //         expect(jwt.sign).toHaveBeenCalledWith(
    //             payload,
    //             process.env.SECRET_KEY,
    //             { expiresIn: customExpiration }
    //         );
    //         expect(result).toBe(mockToken);
    //     });
    // });

    // describe('verifyToken', () => {
    //     it('should verify a valid token', () => {
    //         const token = 'valid-token';
    //         const decodedPayload = { id: 1, roles: ['user'] };

    //         // jwt.verify.mockReturnValue(decodedPayload);
    //         jwt.verify = jest.fn().mockReturnValue(decodedPayload);

    //         const result = authService.verifyToken(token);

    //         expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_KEY);
    //         expect(result).toEqual(decodedPayload);
    //     });

    //     it('should throw error for invalid token', () => {
    //         const token = 'invalid-token';

    //         // jwt.verify.mockImplementation(() => {
    //         jwt.verify = jest.fn().mockImplementation(() => {
    //             throw new Error('Invalid token');
    //         });

    //         expect(() => authService.verifyToken(token)).toThrow('Invalid token');
    //     });
    // });

    describe('loginUser', () => {
        // it('should login user with valid credentials', async () => {
        //     const credentials = { email: 'test@example.com', password: 'password' };
        //     const mockUser = {
        //         id: 1,
        //         email: 'test@example.com',
        //         roles: ['user'],
        //         checkPassword: jest.fn().mockReturnValue(true)
        //     };
        //     const mockToken = 'mock-jwt-token';
        //     const sanitizedUser = { id: 1, email: 'test@example.com' };

        //     db.User.findOne = jest.fn().mockResolvedValue(mockUser);
        //     // jwt.sign.mockReturnValue(mockToken);
        //     jwt.sign = jest.fn().mockReturnValue(mockToken);
        //     sanitizeUser.mockReturnValue(sanitizedUser);

        //     const result = await authService.loginUser(credentials);

        //     expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: credentials.email } });
        //     expect(mockUser.checkPassword).toHaveBeenCalledWith(credentials.password);
        //     expect(jwt.sign).toHaveBeenCalledWith(
        //         { id: mockUser.id, roles: mockUser.roles },
        //         process.env.SECRET_KEY,
        //         { expiresIn: process.env.EXPIRATION_TIME }
        //     );
        //     expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
        //     expect(result).toEqual({ user: sanitizedUser, token: mockToken });
        // });

        it('should throw error for invalid email', async () => {
            const credentials = { email: 'wrong@example.com', password: 'password' };

            db.User.findOne = jest.fn().mockResolvedValue(null);

            await expect(authService.loginUser(credentials))
                .rejects
                .toThrow('Email ou mot de passe incorrect.');
        });

        it('should throw error for invalid password', async () => {
            const credentials = { email: 'test@example.com', password: 'wrongpassword' };
            const mockUser = {
                checkPassword: jest.fn().mockReturnValue(false)
            };

            db.User.findOne = jest.fn().mockResolvedValue(mockUser);

            await expect(authService.loginUser(credentials))
                .rejects
                .toThrow('Email ou mot de passe incorrect.');
        });
    });

    // describe('registerUser', () => {
    //     it('should register a new user and send confirmation email', async () => {
    //         const userData = {
    //             email: 'test@example.com',
    //             password: 'password',
    //             firstname: 'John',
    //             isOwner: true
    //         };
    //         const mockUser = {
    //             id: 1,
    //             ...userData,
    //             roles: ['owner']
    //         };
    //         const mockToken = 'mock-jwt-token';
    //         const sanitizedUser = { id: 1, email: 'test@example.com' };

    //         db.User.create = jest.fn().mockResolvedValue(mockUser);
    //         // jwt.sign.mockReturnValue(mockToken);
    //         jwt.sign = jest.fn().mockReturnValue(mockToken);
    //         sanitizeUser.mockReturnValue(sanitizedUser);
    //         sendConfirmationEmail.mockResolvedValue();

    //         const result = await authService.registerUser(userData);

    //         expect(db.User.create).toHaveBeenCalledWith({
    //             ...userData,
    //             roles: ['owner']
    //         });
    //         expect(jwt.sign).toHaveBeenCalledWith(
    //             { id: mockUser.id },
    //             process.env.SECRET_KEY,
    //             { expiresIn: process.env.EXPIRATION_TIME }
    //         );
    //         expect(sendConfirmationEmail).toHaveBeenCalledWith(
    //             userData.firstname,
    //             userData.email,
    //             mockToken
    //         );
    //         expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
    //         expect(result).toEqual(sanitizedUser);
    //     });

    //     it('should register user with existing roles if not owner', async () => {
    //         const userData = {
    //             email: 'test@example.com',
    //             password: 'password',
    //             firstname: 'John',
    //             isOwner: false,
    //             roles: ['user']
    //         };
    //         const mockUser = {
    //             id: 1,
    //             ...userData
    //         };

    //         db.User.create = jest.fn().mockResolvedValue(mockUser);
    //         // jwt.sign.mockReturnValue('mock-token');
    //         jwt.sign = jest.fn().mockReturnValue('mock-token');
    //         sanitizeUser.mockReturnValue({});
    //         sendConfirmationEmail.mockResolvedValue();

    //         await authService.registerUser(userData);

    //         expect(db.User.create).toHaveBeenCalledWith({
    //             ...userData,
    //             roles: ['user'] // Should keep existing roles
    //         });
    //     });
    // });

    describe('confirmEmail', () => {
        // it('should confirm email with valid token', async () => {
        //     const token = 'valid-token';
        //     const decodedToken = { id: 1 };
        //     const mockUser = {
        //         save: jest.fn().mockResolvedValue()
        //     };
        //     const sanitizedUser = { id: 1, email: 'test@example.com' };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
        //     sanitizeUser.mockReturnValue(sanitizedUser);

        //     const result = await authService.confirmEmail(token);

        //     expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_KEY);
        //     expect(db.User.findByPk).toHaveBeenCalledWith(decodedToken.id);
        //     expect(mockUser.save).toHaveBeenCalled();
        //     expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
        //     expect(result).toEqual(sanitizedUser);
        // });

        it('should throw error for invalid token', async () => {
            const token = 'invalid-token';

            // jwt.verify.mockImplementation(() => {
            jwt.verify = jest.fn().mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(authService.confirmEmail(token))
                .rejects
                .toThrow('Token invalide ou expiré.');
        });

        // it('should throw error if user not found', async () => {
        //     const token = 'valid-token';
        //     const decodedToken = { id: 999 };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(null);

        //     await expect(authService.confirmEmail(token))
        //         .rejects
        //         .toThrow('Utilisateur non trouvé.');
        // });
    });

    describe('forgotPasswordEmail', () => {
        // it('should send reset password email for existing user', async () => {
        //     const email = 'test@example.com';
        //     const mockUser = {
        //         id: 1,
        //         firstname: 'John',
        //         email: 'test@example.com'
        //     };
        //     const resetToken = 'reset-token';

        //     db.User.findOne = jest.fn().mockResolvedValue(mockUser);
        //     // jwt.sign.mockReturnValue(resetToken);
        //     jwt.sign = jest.fn().mockReturnValue(resetToken);
        //     sendResetPasswordEmail.mockResolvedValue();

        //     const result = await authService.forgotPasswordEmail(email);

        //     expect(db.User.findOne).toHaveBeenCalledWith({ where: { email } });
        //     expect(jwt.sign).toHaveBeenCalledWith(
        //         { id: mockUser.id },
        //         process.env.SECRET_KEY,
        //         { expiresIn: '1h' }
        //     );
        //     expect(sendResetPasswordEmail).toHaveBeenCalledWith(
        //         mockUser.firstname,
        //         mockUser.email,
        //         resetToken
        //     );
        //     expect(result).toEqual({ message: 'Email de réinitialisation envoyé.' });
        // });

        it('should throw error if user not found', async () => {
            const email = 'nonexistent@example.com';

            db.User.findOne = jest.fn().mockResolvedValue(null);

            await expect(authService.forgotPasswordEmail(email))
                .rejects
                .toThrow('Utilisateur non trouvé.');
        });
    });

    describe('getCurrentUser', () => {
        // it('should return current user with valid token', async () => {
        //     const token = 'valid-token';
        //     const decodedToken = { id: 1 };
        //     const mockUser = { id: 1, email: 'test@example.com' };
        //     const sanitizedUser = { id: 1, email: 'test@example.com' };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(mockUser);
        //     sanitizeUser.mockReturnValue(sanitizedUser);

        //     const result = await authService.getCurrentUser(token);

        //     expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_KEY);
        //     expect(db.User.findByPk).toHaveBeenCalledWith(decodedToken.id);
        //     expect(sanitizeUser).toHaveBeenCalledWith(mockUser);
        //     expect(result).toEqual(sanitizedUser);
        // });

        it('should throw error for invalid token', async () => {
            const token = 'invalid-token';

            // jwt.verify.mockImplementation(() => {
            jwt.verify = jest.fn().mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(authService.getCurrentUser(token))
                .rejects
                .toThrow('Token invalide ou expiré.');
        });

        // it('should throw error if user not found', async () => {
        //     const token = 'valid-token';
        //     const decodedToken = { id: 999 };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(null);

        //     await expect(authService.getCurrentUser(token))
        //         .rejects
        //         .toThrow('Utilisateur non trouvé.');
        // });
    });

    describe('changePassword', () => {
        it('should change password with valid credentials', async () => {
            const passwordData = {
                email: 'test@example.com',
                oldPassword: 'oldPassword',
                newPassword: 'newPassword'
            };
            const mockUser = {
                checkPassword: jest.fn().mockReturnValue(true),
                save: jest.fn().mockResolvedValue()
            };

            db.User.findOne = jest.fn().mockResolvedValue(mockUser);

            const result = await authService.changePassword(passwordData);

            expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: passwordData.email } });
            expect(mockUser.checkPassword).toHaveBeenCalledWith(passwordData.oldPassword);
            expect(mockUser.password).toBe(passwordData.newPassword);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Mot de passe modifié avec succès.' });
        });

        it('should throw error for invalid email', async () => {
            const passwordData = {
                email: 'wrong@example.com',
                oldPassword: 'oldPassword',
                newPassword: 'newPassword'
            };

            db.User.findOne = jest.fn().mockResolvedValue(null);

            await expect(authService.changePassword(passwordData))
                .rejects
                .toThrow('Email ou mot de passe incorrect.');
        });

        // it('should throw error for invalid old password', async () => {
        //     const passwordData = {
        //         email: 'test@example.com',
        //         oldPassword: 'wrongPassword',
        //         newPassword: 'newPassword'
        //     };
        //     const mockUser = {
        //         checkPassword: jest.fn().mockReturnValue(false)
        //     };

        //     db.User.findOne = jest.fn().mockResolvedValue(mockUser);

        //     await expect(authService.changePassword(passwordData))
        //         .rejects
        //         .toThrow('Email ou mot de passe incorrect.');
        // });
    });

    describe('resetPassword', () => {
        // it('should reset password with valid token', async () => {
        //     const token = 'valid-token';
        //     const newPassword = 'newPassword';
        //     const decodedToken = { id: 1 };
        //     const mockUser = {
        //         save: jest.fn().mockResolvedValue()
        //     };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(mockUser);

        //     const result = await authService.resetPassword(token, newPassword);

        //     expect(jwt.verify).toHaveBeenCalledWith(token, process.env.SECRET_KEY);
        //     expect(db.User.findByPk).toHaveBeenCalledWith(decodedToken.id);
        //     expect(mockUser.password).toBe(newPassword);
        //     expect(mockUser.save).toHaveBeenCalled();
        //     expect(result).toEqual({ message: 'Mot de passe réinitialisé avec succès.' });
        // });

        it('should throw error for invalid token', async () => {
            const token = 'invalid-token';
            const newPassword = 'newPassword';

            // jwt.verify.mockImplementation(() => {
            jwt.verify = jest.fn().mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(authService.resetPassword(token, newPassword))
                .rejects
                .toThrow('Token invalide ou expiré.');
        });

        // it('should throw error if user not found', async () => {
        //     const token = 'valid-token';
        //     const newPassword = 'newPassword';
        //     const decodedToken = { id: 999 };

        //     // jwt.verify.mockReturnValue(decodedToken);
        //     jwt.verify = jest.fn().mockReturnValue(decodedToken);
        //     db.User.findByPk = jest.fn().mockResolvedValue(null);

        //     await expect(authService.resetPassword(token, newPassword))
        //         .rejects
        //         .toThrow('Utilisateur non trouvé.');
        // });
    });
});