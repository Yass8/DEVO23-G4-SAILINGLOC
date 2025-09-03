import { request } from "./http.js"

export const fetchBoatTypes = () => request('/boat-types');
export const fetchBoatTypeById = (id) => request(`/boat-types/${id}/show`);
export const createBoatType = (data) => request('/boat-types/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatType = (id, data) => request(`/boat-types/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoatType = (id) => request(`/boat-types/${id}/delete`, { method: 'DELETE' });
