import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/boatPhoto.services.js');

// Import après le mock
import boatPhotoController from '../../../controllers/boatPhoto.controller.js';
import boatPhotoService from '../../../services/boatPhoto.services.js';

describe('BoatPhoto Controller', () => {
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
    it('should return all boat photos with status 200', async () => {
      const mockPhotos = [
        { id: 1, url: 'photo1.jpg', boat_id: 1, main: true },
        { id: 2, url: 'photo2.jpg', boat_id: 1, main: false }
      ];

      boatPhotoService.getAllBoatPhotos = jest.fn().mockResolvedValue(mockPhotos);

      await boatPhotoController.index(mockReq, mockRes);

      expect(boatPhotoService.getAllBoatPhotos).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPhotos);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      boatPhotoService.getAllBoatPhotos = jest.fn().mockRejectedValue(error);

      await boatPhotoController.index(mockReq, mockRes);

      expect(boatPhotoService.getAllBoatPhotos).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create boat photos with single file and return 201', async () => {
      const boatId = 1;
      const mainIndex = 0;
      const mockFile = { name: 'photo.jpg', data: 'file-data' };
      const mockResult = [{ id: 1, url: 'photo.jpg', boat_id: boatId, main: true }];

      mockReq.body = { boat_id: boatId, mainIndex };
      mockReq.files = { photos: mockFile };
      boatPhotoService.createBoatPhotos = jest.fn().mockResolvedValue(mockResult);

      await boatPhotoController.create(mockReq, mockRes);

      expect(boatPhotoService.createBoatPhotos).toHaveBeenCalledWith(
        boatId,
        [mockFile],
        mainIndex
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should create boat photos with multiple files and return 201', async () => {
      const boatId = 1;
      const mainIndex = 1;
      const mockFiles = [
        { name: 'photo1.jpg', data: 'file-data1' },
        { name: 'photo2.jpg', data: 'file-data2' }
      ];
      const mockResult = [
        { id: 1, url: 'photo1.jpg', boat_id: boatId, main: false },
        { id: 2, url: 'photo2.jpg', boat_id: boatId, main: true }
      ];

      mockReq.body = { boat_id: boatId, mainIndex };
      mockReq.files = { photos: mockFiles };
      boatPhotoService.createBoatPhotos = jest.fn().mockResolvedValue(mockResult);

      await boatPhotoController.create(mockReq, mockRes);

      expect(boatPhotoService.createBoatPhotos).toHaveBeenCalledWith(
        boatId,
        mockFiles,
        mainIndex
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const mainIndex = 0;
      const mockFile = { name: 'photo.jpg', data: 'file-data' };
      const error = new Error('Creation error');

      mockReq.body = { boat_id: boatId, mainIndex };
      mockReq.files = { photos: mockFile };
      boatPhotoService.createBoatPhotos = jest.fn().mockRejectedValue(error);

      await boatPhotoController.create(mockReq, mockRes);

      expect(boatPhotoService.createBoatPhotos).toHaveBeenCalledWith(
        boatId,
        [mockFile],
        mainIndex
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should handle missing files gracefully', async () => {
      const boatId = 1;
      const mainIndex = 0;
      const error = new Error('No files provided');

      mockReq.body = { boat_id: boatId, mainIndex };
      mockReq.files = {}; // No photos property
      boatPhotoService.createBoatPhotos = jest.fn().mockRejectedValue(error);

      await boatPhotoController.create(mockReq, mockRes);

      // Should still call the service with empty array
      expect(boatPhotoService.createBoatPhotos).toHaveBeenCalledWith(
        boatId,
        [],
        mainIndex
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return boat photo by ID with status 200', async () => {
      const photoId = 1;
      const mockPhoto = { 
        id: photoId, 
        url: 'photo.jpg', 
        boat_id: 1, 
        main: true 
      };

      mockReq.params.id = photoId;
      boatPhotoService.getBoatPhotoById = jest.fn().mockResolvedValue(mockPhoto);

      await boatPhotoController.show(mockReq, mockRes);

      expect(boatPhotoService.getBoatPhotoById).toHaveBeenCalledWith(photoId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPhoto);
    });

    it('should return 500 on error', async () => {
      const photoId = 1;
      const error = new Error('Database error');
      mockReq.params.id = photoId;
      boatPhotoService.getBoatPhotoById = jest.fn().mockRejectedValue(error);

      await boatPhotoController.show(mockReq, mockRes);

      expect(boatPhotoService.getBoatPhotoById).toHaveBeenCalledWith(photoId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update boat photo and return 200', async () => {
      const photoId = 1;
      const updateData = { main: false };
      const updatedPhoto = { 
        id: photoId, 
        ...updateData, 
        url: 'photo.jpg', 
        boat_id: 1 
      };

      mockReq.params.id = photoId;
      mockReq.body = updateData;
      boatPhotoService.updateBoatPhoto = jest.fn().mockResolvedValue(updatedPhoto);

      await boatPhotoController.update(mockReq, mockRes);

      expect(boatPhotoService.updateBoatPhoto).toHaveBeenCalledWith(photoId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedPhoto);
    });

    it('should return 500 on error', async () => {
      const photoId = 1;
      const updateData = { main: false };
      const error = new Error('Update error');

      mockReq.params.id = photoId;
      mockReq.body = updateData;
      boatPhotoService.updateBoatPhoto = jest.fn().mockRejectedValue(error);

      await boatPhotoController.update(mockReq, mockRes);

      expect(boatPhotoService.updateBoatPhoto).toHaveBeenCalledWith(photoId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete boat photo and return 204', async () => {
      const photoId = 1;
      mockReq.params.id = photoId;
      boatPhotoService.deleteBoatPhoto = jest.fn().mockResolvedValue();

      await boatPhotoController.remove(mockReq, mockRes);

      expect(boatPhotoService.deleteBoatPhoto).toHaveBeenCalledWith(photoId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const photoId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = photoId;
      boatPhotoService.deleteBoatPhoto = jest.fn().mockRejectedValue(error);

      await boatPhotoController.remove(mockReq, mockRes);

      expect(boatPhotoService.deleteBoatPhoto).toHaveBeenCalledWith(photoId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatPhotos', () => {
    it('should return boat photos for specific boat with status 200', async () => {
      const boatId = 1;
      const mockPhotos = [
        { id: 1, url: 'photo1.jpg', boat_id: boatId, main: true },
        { id: 2, url: 'photo2.jpg', boat_id: boatId, main: false }
      ];

      mockReq.params.id = boatId;
      boatPhotoService.getBoatPhotos = jest.fn().mockResolvedValue(mockPhotos);

      await boatPhotoController.getBoatPhotos(mockReq, mockRes);

      expect(boatPhotoService.getBoatPhotos).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPhotos);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      boatPhotoService.getBoatPhotos = jest.fn().mockRejectedValue(error);

      await boatPhotoController.getBoatPhotos(mockReq, mockRes);

      expect(boatPhotoService.getBoatPhotos).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});