import { request } from "./http.js"

export const fetchUsers = () => request('/users');
export const fetchUserById = (id) => request(`/users/${id}/show`);
export const createUser = (data) => request('/users/new', { method: 'POST', body: JSON.stringify(data) });
export const updateUser = (id, data) => request(`/users/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id) => request(`/users/${id}/delete`, { method: 'DELETE' });
export const uploadUserPhoto = (id, data) => request(`/users/${id}/photo`, { method: 'PUT', body: JSON.stringify(data) });

// Related data
export const fetchUserBoats = (id) => request(`/users/${id}/boats`);
export const fetchUserReservations = (id) => request(`/users/${id}/reservations`);
export const fetchUserMessages = (id) => request(`/users/${id}/messages`);
export const fetchUserReviews = (id) => request(`/users/${id}/reviews`);
export const fetchUserDocuments = (id) => request(`/users/${id}/documents`);