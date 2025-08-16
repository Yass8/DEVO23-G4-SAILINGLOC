import { request } from "./http.js"

export const fetchPayments = () => request('/payments');
export const fetchPaymentById = (id) => request(`/payments/${id}/show`);
export const createPayment = (data) => request('/payments/new', { method: 'POST', body: JSON.stringify(data) });
export const updatePayment = (id, data) => request(`/payments/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePayment = (id) => request(`/payments/${id}/delete`, { method: 'DELETE' });
export const fetchReservationPayments = (reservationId) => request(`/payments/reservation/${reservationId}`);