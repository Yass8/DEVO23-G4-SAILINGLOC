import { request } from "./http.js"

export const fetchReviews = () => request('/reviews');
export const fetchReviewById = (id) => request(`/reviews/${id}/show`);
export const createReview = (data) => request('/reviews/new', { method: 'POST', body: JSON.stringify(data) });
export const updateReview = (id, data) => request(`/reviews/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteReview = (id) => request(`/reviews/${id}/delete`, { method: 'DELETE' });
export const fetchBoatReviews = (boatId) => request(`/reviews/boat/${boatId}`);
export const fetchUserReviews = (userId) => request(`/reviews/user/${userId}`);