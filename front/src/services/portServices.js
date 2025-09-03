import { request } from "./http.js"

export const fetchPorts = () => request('/ports');
export const fetchPortById = (id) => request(`/ports/${id}/show`);
export const createPort = (data) => request('/ports/new', { method: 'POST', body: JSON.stringify(data) }); 
export const updatePort = (id, data) => request(`/ports/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePort = (id) => request(`/ports/${id}/delete`, { method: 'DELETE' });
