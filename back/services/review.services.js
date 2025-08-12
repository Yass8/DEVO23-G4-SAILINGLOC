import db from "../models/index.js";
const { Review, User, Boat, Reservation } = db;

const getAllReviews = async () => {
    return await Review.findAll({
        attributes:["id", "reservation_id", "rating", "comment", "response", "createdAt", "updatedAt"]
    });
};

const createReview = async (data) => {
    return await Review.create(data);
};

const getReviewById = async (id) => {
    return await Review.findByPk(id, {
        include: [User, Boat, Reservation]
    });
};

const updateReview = async (id, data) => {
    const review = await Review.findByPk(id);
    if (!review) return null;
    return await review.update(data);
};

const deleteReview = async (id) => {
    const review = await Review.findByPk(id);
    if (!review) return null;
    await review.destroy();
    return true;
};

const getBoatReviews = async (boatId) => {
    return await Review.findAll({
        where: { boat_id: boatId },
        include: User
    });
};

const getUserReviews = async (userId) => {
    return await Review.findAll({
        where: { user_id: userId },
        include: Boat
    });
};

export default {
    getAllReviews,
    createReview,
    getReviewById,
    updateReview,
    deleteReview,
    getBoatReviews,
    getUserReviews
};