import { request } from "./http.js"

export const fetchContracts = () => request('/contracts');
export const fetchContractById = (id) => request(`/contracts/${id}/show`);
export const createContract = (data) => request('/contracts/new', { method: 'POST', body: data });
export const updateContract = (id, data) => request(`/contracts/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteContract = (id) => request(`/contracts/${id}/delete`, { method: 'DELETE' });
export const fetchReservationContract = (reservationId) => request(`/contracts/reservation/${reservationId}`);