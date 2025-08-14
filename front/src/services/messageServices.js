import { request } from "./http.js"

export const fetchMessages = () => request('/messages');
export const fetchMessageById = (id) => request(`/messages/${id}/show`);
export const createMessage = (data) => request('/messages/new', { method: 'POST', body: JSON.stringify(data) });
export const updateMessage = (id, data) => request(`/messages/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMessage = (id) => request(`/messages/${id}/delete`, { method: 'DELETE' });
export const fetchUserMessages = (userId) => request(`/messages/user/${userId}`);
export const fetchReservationMessages = (reservationId) => request(`/messages/reservation/${reservationId}`);