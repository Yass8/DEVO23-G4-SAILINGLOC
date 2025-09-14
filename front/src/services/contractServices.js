import { request } from "./http.js"

export const fetchContracts = () => request('/contracts');
export const fetchContractById = (id) => request(`/contracts/${id}/show`);
export const createContract = (formData) => request('/contracts/new', { method: 'POST', body: formData, headers: {} });
export const updateContract = (id, data) => request(`/contracts/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteContract = (id) => request(`/contracts/${id}/delete`, { method: 'DELETE' });
export const fetchReservationContract = (reservationId) => request(`/contracts/reservation/${reservationId}`);