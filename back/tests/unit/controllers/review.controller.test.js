import { describe, it, jest, expect, beforeEach } from '@jest/globals';

// Mock du service
jest.mock('../../../services/review.services.js');

// Import après le mock
import reviewController from '../../../controllers/review.controller.js';
import reviewService from '../../../services/review.services.js';

describe('Review Controller', () => {
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
    it('should return all reviews with status 200', async () => {
      const mockReviews = [
        { id: 1, rating: 5, comment: 'Excellent', userId: 1, boatId: 1 },
        { id: 2, rating: 4, comment: 'Very good', userId: 2, boatId: 2 }
      ];

      reviewService.getAllReviews = jest.fn().mockResolvedValue(mockReviews);

      await reviewController.index(mockReq, mockRes);

      expect(reviewService.getAllReviews).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      reviewService.getAllReviews = jest.fn().mockRejectedValue(error);

      await reviewController.index(mockReq, mockRes);

      expect(reviewService.getAllReviews).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('create', () => {
    it('should create review and return 201', async () => {
      const newReview = { rating: 5, comment: 'Excellent', userId: 1, boatId: 1 };
      const createdReview = { id: 1, ...newReview };

      mockReq.body = newReview;
      reviewService.createReview = jest.fn().mockResolvedValue(createdReview);

      await reviewController.create(mockReq, mockRes);

      expect(reviewService.createReview).toHaveBeenCalledWith(newReview);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(createdReview);
    });

    it('should return 500 on error', async () => {
      const error = new Error('Creation error');
      mockReq.body = { rating: 5, comment: 'Test' };
      reviewService.createReview = jest.fn().mockRejectedValue(error);

      await reviewController.create(mockReq, mockRes);

      expect(reviewService.createReview).toHaveBeenCalledWith({ rating: 5, comment: 'Test' });
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('show', () => {
    it('should return review by ID with status 200', async () => {
      const reviewId = 1;
      const mockReview = { id: reviewId, rating: 5, comment: 'Excellent', userId: 1, boatId: 1 };

      mockReq.params.id = reviewId;
      reviewService.getReviewById = jest.fn().mockResolvedValue(mockReview);

      await reviewController.show(mockReq, mockRes);

      expect(reviewService.getReviewById).toHaveBeenCalledWith(reviewId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReview);
    });

    it('should return 500 on error', async () => {
      const reviewId = 1;
      const error = new Error('Database error');
      mockReq.params.id = reviewId;
      reviewService.getReviewById = jest.fn().mockRejectedValue(error);

      await reviewController.show(mockReq, mockRes);

      expect(reviewService.getReviewById).toHaveBeenCalledWith(reviewId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('update', () => {
    it('should update review and return 200', async () => {
      const reviewId = 1;
      const updateData = { rating: 4, comment: 'Updated comment' };
      const updatedReview = { id: reviewId, ...updateData, userId: 1, boatId: 1 };

      mockReq.params.id = reviewId;
      mockReq.body = updateData;
      reviewService.updateReview = jest.fn().mockResolvedValue(updatedReview);

      await reviewController.update(mockReq, mockRes);

      expect(reviewService.updateReview).toHaveBeenCalledWith(reviewId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedReview);
    });

    it('should return 500 on error', async () => {
      const reviewId = 1;
      const updateData = { rating: 4 };
      const error = new Error('Update error');

      mockReq.params.id = reviewId;
      mockReq.body = updateData;
      reviewService.updateReview = jest.fn().mockRejectedValue(error);

      await reviewController.update(mockReq, mockRes);

      expect(reviewService.updateReview).toHaveBeenCalledWith(reviewId, updateData);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('remove', () => {
    it('should delete review and return 204', async () => {
      const reviewId = 1;
      mockReq.params.id = reviewId;
      reviewService.deleteReview = jest.fn().mockResolvedValue();

      await reviewController.remove(mockReq, mockRes);

      expect(reviewService.deleteReview).toHaveBeenCalledWith(reviewId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
      const reviewId = 1;
      const error = new Error('Delete error');
      mockReq.params.id = reviewId;
      reviewService.deleteReview = jest.fn().mockRejectedValue(error);

      await reviewController.remove(mockReq, mockRes);

      expect(reviewService.deleteReview).toHaveBeenCalledWith(reviewId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getBoatReviews', () => {
    it('should return boat reviews with status 200', async () => {
      const boatId = 1;
      const mockReviews = [
        { id: 1, rating: 5, comment: 'Excellent', boatId: 1 },
        { id: 2, rating: 4, comment: 'Very good', boatId: 1 }
      ];

      mockReq.params.id = boatId;
      reviewService.getBoatReviews = jest.fn().mockResolvedValue(mockReviews);

      await reviewController.getBoatReviews(mockReq, mockRes);

      expect(reviewService.getBoatReviews).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on error', async () => {
      const boatId = 1;
      const error = new Error('Database error');
      mockReq.params.id = boatId;
      reviewService.getBoatReviews = jest.fn().mockRejectedValue(error);

      await reviewController.getBoatReviews(mockReq, mockRes);

      expect(reviewService.getBoatReviews).toHaveBeenCalledWith(boatId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getUserReviews', () => {
    it('should return user reviews with status 200', async () => {
      const userId = 1;
      const mockReviews = [
        { id: 1, rating: 5, comment: 'Excellent', userId: 1 },
        { id: 2, rating: 4, comment: 'Very good', userId: 1 }
      ];

      mockReq.params.id = userId;
      reviewService.getUserReviews = jest.fn().mockResolvedValue(mockReviews);

      await reviewController.getUserReviews(mockReq, mockRes);

      expect(reviewService.getUserReviews).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should return 500 on error', async () => {
      const userId = 1;
      const error = new Error('Database error');
      mockReq.params.id = userId;
      reviewService.getUserReviews = jest.fn().mockRejectedValue(error);

      await reviewController.getUserReviews(mockReq, mockRes);

      expect(reviewService.getUserReviews).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});