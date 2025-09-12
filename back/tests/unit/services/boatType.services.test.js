import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import boatTypeService from '../../../services/boatType.services.js';
import db from '../../../models/index.js';

describe('BoatType Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBoatTypes', () => {
    it('should return all boat types', async () => {
      const mockBoatTypes = [
        { 
          id: 1, 
          name: 'Sailboat', 
          description: 'A boat propelled by sails'
        },
        { 
          id: 2, 
          name: 'Motorboat', 
          description: 'A boat propelled by an engine'
        }
      ];

      db.BoatType.findAll = jest.fn().mockResolvedValue(mockBoatTypes);
      const result = await boatTypeService.getAllBoatTypes();

      expect(db.BoatType.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBoatTypes);
    });
  });

  describe('createBoatType', () => {
    it('should create and return a new boat type', async () => {
      const newBoatType = { 
        name: 'Yacht', 
        description: 'A medium-sized sailboat'
      };
      const createdBoatType = { id: 1, ...newBoatType };

      db.BoatType.create = jest.fn().mockResolvedValue(createdBoatType);
      const result = await boatTypeService.createBoatType(newBoatType);

      expect(db.BoatType.create).toHaveBeenCalledWith(newBoatType);
      expect(result).toEqual(createdBoatType);
    });
  });

  describe('getBoatTypeById', () => {
    it('should return a boat type by ID', async () => {
      const typeId = 1;
      const mockBoatType = { 
        id: typeId, 
        name: 'Sailboat', 
        description: 'A boat propelled by sails'
      };

      db.BoatType.findByPk = jest.fn().mockResolvedValue(mockBoatType);
      const result = await boatTypeService.getBoatTypeById(typeId);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(result).toEqual(mockBoatType);
    });

    it('should return null if boat type not found', async () => {
      const typeId = 999;

      db.BoatType.findByPk = jest.fn().mockResolvedValue(null);
      const result = await boatTypeService.getBoatTypeById(typeId);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(result).toBeNull();
    });
  });

  describe('updateBoatType', () => {
    it('should update and return the boat type', async () => {
      const typeId = 1;
      const updateData = { description: 'Updated description' };
      const mockBoatType = {
        id: typeId,
        name: 'Sailboat',
        description: 'A boat propelled by sails',
        update: jest.fn().mockResolvedValue({ id: typeId, ...updateData })
      };

      db.BoatType.findByPk = jest.fn().mockResolvedValue(mockBoatType);
      const result = await boatTypeService.updateBoatType(typeId, updateData);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(mockBoatType.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: typeId, ...updateData });
    });

    it('should return null if boat type not found', async () => {
      const typeId = 999;
      const updateData = { description: 'Updated description' };

      db.BoatType.findByPk = jest.fn().mockResolvedValue(null);
      const result = await boatTypeService.updateBoatType(typeId, updateData);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(result).toBeNull();
    });
  });

  describe('deleteBoatType', () => {
    it('should delete the boat type and return true', async () => {
      const typeId = 1;
      const mockBoatType = {
        id: typeId,
        name: 'Sailboat',
        description: 'A boat propelled by sails',
        destroy: jest.fn().mockResolvedValue()
      };

      db.BoatType.findByPk = jest.fn().mockResolvedValue(mockBoatType);
      const result = await boatTypeService.deleteBoatType(typeId);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(mockBoatType.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if boat type not found', async () => {
      const typeId = 999;

      db.BoatType.findByPk = jest.fn().mockResolvedValue(null);
      const result = await boatTypeService.deleteBoatType(typeId);

      expect(db.BoatType.findByPk).toHaveBeenCalledWith(typeId);
      expect(result).toBeNull();
    });
  });
});