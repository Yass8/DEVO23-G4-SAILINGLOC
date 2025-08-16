import { request } from "./http.js"

export const fetchReservations = () => request('/reservations');
export const fetchReservationById = (id) => request(`/reservations/${id}/show`);
export const createReservation = (data) => request('/reservations/new', { method: 'POST', body: JSON.stringify(data) });
export const updateReservation = (id, data) => request(`/reservations/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteReservation = (id) => request(`/reservations/${id}/delete`, { method: 'DELETE' });
export const fetchUserReservations = (userId) => request(`/reservations/user/${userId}`);
export const fetchBoatReservations = (boatId) => request(`/reservations/boat/${boatId}`);