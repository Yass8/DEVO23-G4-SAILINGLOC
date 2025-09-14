import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock complet de Sequelize
jest.mock('../../../models/index.js', () => {
  const mockSequelize = {
    transaction: jest.fn().mockResolvedValue({
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    })
  };

  return {
    sequelize: mockSequelize,
    BoatPhoto: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn()
    },
    Boat: {}
  };
});

// Mock explicite de uploadFile
const saveFileMock = jest.fn();
jest.mock('../../../utils/uploadFile.js', () => ({
  saveFile: saveFileMock
}));

// Import après le mock
import boatPhotoService from '../../../services/boatPhoto.services.js';
import db from '../../../models/index.js';

describe('BoatPhoto Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    saveFileMock.mockReset();
    
    // Reset des mocks spécifiques
    db.sequelize.transaction.mockResolvedValue({
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    });
  });

  describe('getAllBoatPhotos', () => {
    it('should return all boat photos with boats included', async () => {
      const mockPhotos = [
        {
          id: 1,
          photo_url: 'photo1.jpg',
          is_main: true,
          Boat: { id: 1, name: 'Boat 1' }
        },
        {
          id: 2,
          photo_url: 'photo2.jpg',
          is_main: false,
          Boat: { id: 2, name: 'Boat 2' }
        }
      ];

      db.BoatPhoto.findAll.mockResolvedValue(mockPhotos);
      const result = await boatPhotoService.getAllBoatPhotos();

      expect(db.BoatPhoto.findAll).toHaveBeenCalledWith({
        include: db.Boat
      });
      expect(result).toEqual(mockPhotos);
    });
  });

  describe('createBoatPhotos', () => {
    it('should create multiple boat photos with transaction and set main photo', async () => {
      const boatId = 1;
      const files = [
        { data: 'file-data-1', name: 'photo1.jpg' },
        { data: 'file-data-2', name: 'photo2.jpg' },
        { data: 'file-data-3', name: 'photo3.jpg' }
      ];
      const mainIndex = 1;

      const mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
      };

      const mockPhotos = [
        { id: 1, photo_url: 'boats/1/photos/photo1.jpg', is_main: false },
        { id: 2, photo_url: 'boats/1/photos/photo2.jpg', is_main: true },
        { id: 3, photo_url: 'boats/1/photos/photo3.jpg', is_main: false }
      ];

      // Mock de la transaction
      db.sequelize.transaction.mockResolvedValue(mockTransaction);

      // Mock de uploadFile.saveFile
      saveFileMock
        .mockResolvedValueOnce('boats/1/photos/photo1.jpg')
        .mockResolvedValueOnce('boats/1/photos/photo2.jpg')
        .mockResolvedValueOnce('boats/1/photos/photo3.jpg');

      // Mock de BoatPhoto.create avec transaction
      db.BoatPhoto.create
        .mockResolvedValueOnce(mockPhotos[0])
        .mockResolvedValueOnce(mockPhotos[1])
        .mockResolvedValueOnce(mockPhotos[2]);

      const result = await boatPhotoService.createBoatPhotos(boatId, files, mainIndex);

      // Vérifications
      expect(db.sequelize.transaction).toHaveBeenCalled();

      // Vérifie que saveFile a été appelé 3 fois avec les bons paramètres
      expect(saveFileMock).toHaveBeenCalledTimes(3);
      expect(saveFileMock).toHaveBeenCalledWith(
        'boat',
        files[0].data,
        files[0].name,
        `boats/${boatId}/photos`,
        ['.jpg', '.jpeg', '.png', '.gif'],
        2
      );

      // Vérifie que BoatPhoto.create a été appelé 3 fois avec transaction
      expect(db.BoatPhoto.create).toHaveBeenCalledTimes(3);
      expect(db.BoatPhoto.create).toHaveBeenCalledWith(
        {
          boat_id: boatId,
          photo_url: 'boats/1/photos/photo1.jpg',
          is_main: false
        },
        { transaction: mockTransaction }
      );

      expect(db.BoatPhoto.create).toHaveBeenCalledWith(
        {
          boat_id: boatId,
          photo_url: 'boats/1/photos/photo2.jpg',
          is_main: true
        },
        { transaction: mockTransaction }
      );

      // Vérifie que la transaction est commitée
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();

      expect(result).toEqual(mockPhotos);
    });

    it('should throw error if no files provided', async () => {
      await expect(boatPhotoService.createBoatPhotos(1, []))
        .rejects
        .toThrow('Aucune photo fournie');
    });

    it('should throw error if mainIndex is invalid', async () => {
      const files = [
        { data: 'file-data-1', name: 'photo1.jpg' },
        { data: 'file-data-2', name: 'photo2.jpg' }
      ];

      await expect(boatPhotoService.createBoatPhotos(1, files, 5))
        .rejects
        .toThrow('mainIndex (5) invalide : doit être entre 0 et 1');
    });

    it('should rollback transaction if error occurs', async () => {
      const boatId = 1;
      const files = [
        { data: 'file-data-1', name: 'photo1.jpg' }
      ];

      const mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
      };

      db.sequelize.transaction.mockResolvedValue(mockTransaction);
      saveFileMock.mockRejectedValue(new Error('Upload failed'));

      await expect(boatPhotoService.createBoatPhotos(boatId, files))
        .rejects
        .toThrow('Upload failed');

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });
  });

  // ... (le reste des tests reste le même)
  describe('getBoatPhotoById', () => {
    it('should return a boat photo by ID with boat included', async () => {
      const photoId = 1;
      const mockPhoto = {
        id: photoId,
        photo_url: 'photo1.jpg',
        is_main: true,
        Boat: { id: 1, name: 'Boat 1' }
      };

      db.BoatPhoto.findByPk.mockResolvedValue(mockPhoto);
      const result = await boatPhotoService.getBoatPhotoById(photoId);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId, {
        include: db.Boat
      });
      expect(result).toEqual(mockPhoto);
    });

    it('should return null if photo not found', async () => {
      const photoId = 999;

      db.BoatPhoto.findByPk.mockResolvedValue(null);
      const result = await boatPhotoService.getBoatPhotoById(photoId);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId, {
        include: db.Boat
      });
      expect(result).toBeNull();
    });
  });

  describe('updateBoatPhoto', () => {
    it('should update and return the boat photo', async () => {
      const photoId = 1;
      const updateData = { is_main: false };
      const mockPhoto = {
        id: photoId,
        photo_url: 'photo1.jpg',
        is_main: true,
        update: jest.fn().mockResolvedValue({ id: photoId, ...updateData })
      };

      db.BoatPhoto.findByPk.mockResolvedValue(mockPhoto);
      const result = await boatPhotoService.updateBoatPhoto(photoId, updateData);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId);
      expect(mockPhoto.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: photoId, ...updateData });
    });

    it('should return null if photo not found', async () => {
      const photoId = 999;
      const updateData = { is_main: false };

      db.BoatPhoto.findByPk.mockResolvedValue(null);
      const result = await boatPhotoService.updateBoatPhoto(photoId, updateData);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId);
      expect(result).toBeNull();
    });
  });

  describe('deleteBoatPhoto', () => {
    it('should delete the boat photo and return true', async () => {
      const photoId = 1;
      const mockPhoto = {
        id: photoId,
        photo_url: 'photo1.jpg',
        is_main: true,
        destroy: jest.fn().mockResolvedValue()
      };

      db.BoatPhoto.findByPk.mockResolvedValue(mockPhoto);
      const result = await boatPhotoService.deleteBoatPhoto(photoId);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId);
      expect(mockPhoto.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if photo not found', async () => {
      const photoId = 999;

      db.BoatPhoto.findByPk.mockResolvedValue(null);
      const result = await boatPhotoService.deleteBoatPhoto(photoId);

      expect(db.BoatPhoto.findByPk).toHaveBeenCalledWith(photoId);
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

      db.BoatPhoto.findAll.mockResolvedValue(mockPhotos);
      const result = await boatPhotoService.getBoatPhotos(boatId);

      expect(db.BoatPhoto.findAll).toHaveBeenCalledWith({
        where: { boat_id: boatId }
      });
      expect(result).toEqual(mockPhotos);
    });

    it('should return empty array if no photos found for boat', async () => {
      const boatId = 999;

      db.BoatPhoto.findAll.mockResolvedValue([]);
      const result = await boatPhotoService.getBoatPhotos(boatId);

      expect(db.BoatPhoto.findAll).toHaveBeenCalledWith({
        where: { boat_id: boatId }
      });
      expect(result).toEqual([]);
    });
  });
});