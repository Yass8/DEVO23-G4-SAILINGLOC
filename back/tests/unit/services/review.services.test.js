import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock direct et simple
jest.mock('../../../models/index.js');

// Import après le mock
import reviewService from '../../../services/review.services.js';
import db from '../../../models/index.js';

describe('Review Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReviews', () => {
    it('should return all reviews with specific attributes', async () => {
      const mockReviews = [
        { 
          id: 1, 
          reservation_id: 1, 
          rating: 5, 
          comment: 'Excellent service',
          response: 'Thank you!',
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        { 
          id: 2, 
          reservation_id: 2, 
          rating: 4, 
          comment: 'Very good',
          response: null,
          created_at: '2024-01-02',
          updated_at: '2024-01-02'
        }
      ];

      db.Review.findAll = jest.fn().mockResolvedValue(mockReviews);
      const result = await reviewService.getAllReviews();

      expect(db.Review.findAll).toHaveBeenCalledWith({
        attributes: ["id", "reservation_id", "rating", "comment", "response", "created_at", "updated_at"]
      });
      expect(result).toEqual(mockReviews);
    });
  });

  describe('createReview', () => {
    it('should create and return a new review', async () => {
      const newReview = { 
        reservation_id: 1,
        user_id: 1,
        boat_id: 1,
        rating: 5,
        comment: 'Excellent experience'
      };
      const createdReview = { id: 1, ...newReview };

      db.Review.create = jest.fn().mockResolvedValue(createdReview);
      const result = await reviewService.createReview(newReview);

      expect(db.Review.create).toHaveBeenCalledWith(newReview);
      expect(result).toEqual(createdReview);
    });
  });

  describe('getReviewById', () => {
    it('should return a review by ID with user, boat and reservation included', async () => {
      const reviewId = 1;
      const mockReview = { 
        id: reviewId, 
        rating: 5,
        comment: 'Excellent service',
        User: { id: 1, name: 'User 1' },
        Boat: { id: 1, name: 'Boat 1' },
        Reservation: { id: 1, start_date: '2024-01-01' }
      };

      db.Review.findByPk = jest.fn().mockResolvedValue(mockReview);
      const result = await reviewService.getReviewById(reviewId);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId, {
        include: [db.User, db.Boat, db.Reservation]
      });
      expect(result).toEqual(mockReview);
    });

    it('should return null if review not found', async () => {
      const reviewId = 999;

      db.Review.findByPk = jest.fn().mockResolvedValue(null);
      const result = await reviewService.getReviewById(reviewId);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId, {
        include: [db.User, db.Boat, db.Reservation]
      });
      expect(result).toBeNull();
    });
  });

  describe('updateReview', () => {
    it('should update and return the review', async () => {
      const reviewId = 1;
      const updateData = { rating: 4, comment: 'Very good experience' };
      const mockReview = {
        id: reviewId,
        rating: 5,
        comment: 'Excellent service',
        update: jest.fn().mockResolvedValue({ id: reviewId, ...updateData })
      };

      db.Review.findByPk = jest.fn().mockResolvedValue(mockReview);
      const result = await reviewService.updateReview(reviewId, updateData);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId);
      expect(mockReview.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({ id: reviewId, ...updateData });
    });

    it('should return null if review not found', async () => {
      const reviewId = 999;
      const updateData = { rating: 4 };

      db.Review.findByPk = jest.fn().mockResolvedValue(null);
      const result = await reviewService.updateReview(reviewId, updateData);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId);
      expect(result).toBeNull();
    });
  });

  describe('deleteReview', () => {
    it('should delete the review and return true', async () => {
      const reviewId = 1;
      const mockReview = {
        id: reviewId,
        rating: 5,
        comment: 'Excellent service',
        destroy: jest.fn().mockResolvedValue()
      };

      db.Review.findByPk = jest.fn().mockResolvedValue(mockReview);
      const result = await reviewService.deleteReview(reviewId);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId);
      expect(mockReview.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if review not found', async () => {
      const reviewId = 999;

      db.Review.findByPk = jest.fn().mockResolvedValue(null);
      const result = await reviewService.deleteReview(reviewId);

      expect(db.Review.findByPk).toHaveBeenCalledWith(reviewId);
      expect(result).toBeNull();
    });
  });

  describe('getBoatReviews', () => {
    it('should return all reviews for a specific boat with user included', async () => {
      const boatId = 1;
      const mockReviews = [
        { 
          id: 1, 
          rating: 5, 
          comment: 'Excellent boat',
          boat_id: boatId,
          User: { id: 1, name: 'User 1' }
        },
        { 
          id: 2, 
          rating: 4, 
          comment: 'Very good condition',
          boat_id: boatId,
          User: { id: 2, name: 'User 2' }
        }
      ];

      db.Review.findAll = jest.fn().mockResolvedValue(mockReviews);
      const result = await reviewService.getBoatReviews(boatId);

      expect(db.Review.findAll).toHaveBeenCalledWith({
        where: { boat_id: boatId },
        include: db.User
      });
      expect(result).toEqual(mockReviews);
    });

    it('should return empty array if no reviews found for boat', async () => {
      const boatId = 999;

      db.Review.findAll = jest.fn().mockResolvedValue([]);
      const result = await reviewService.getBoatReviews(boatId);

      expect(db.Review.findAll).toHaveBeenCalledWith({
        where: { boat_id: boatId },
        include: db.User
      });
      expect(result).toEqual([]);
    });
  });

  describe('getUserReviews', () => {
    it('should return all reviews by a specific user with boat included', async () => {
      const userId = 1;
      const mockReviews = [
        { 
          id: 1, 
          rating: 5, 
          comment: 'Excellent experience',
          user_id: userId,
          Boat: { id: 1, name: 'Boat 1' }
        },
        { 
          id: 2, 
          rating: 4, 
          comment: 'Very good service',
          user_id: userId,
          Boat: { id: 2, name: 'Boat 2' }
        }
      ];

      db.Review.findAll = jest.fn().mockResolvedValue(mockReviews);
      const result = await reviewService.getUserReviews(userId);

      expect(db.Review.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: db.Boat
      });
      expect(result).toEqual(mockReviews);
    });

    it('should return empty array if no reviews found for user', async () => {
      const userId = 999;

      db.Review.findAll = jest.fn().mockResolvedValue([]);
      const result = await reviewService.getUserReviews(userId);

      expect(db.Review.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: db.Boat
      });
      expect(result).toEqual([]);
    });
  });
});