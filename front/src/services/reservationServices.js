import { request } from "./http.js"

export const fetchReservations = () => request('/reservations');
export const fetchReservationById = (id) => request(`/reservations/${id}/show`);
export const fetchReservationByReference = (reference) => request(`/reservations/${reference}`);
export const createReservation = (data) => request('/reservations/new', { method: 'POST', body: JSON.stringify(data) });
export const updateReservation = (id, data) => request(`/reservations/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteReservation = (id) => request(`/reservations/${id}/delete`, { method: 'DELETE' });
export const fetchUserReservations = (boat_id) => request(`/reservations/user/${boat_id}`);
export const fetchBoatReservations = (boat_id) => request(`/reservations/boat/${boat_id}`);
