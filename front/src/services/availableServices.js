import { request } from "./http.js"

export const fetchAvailabilities = () => request('/availabilities');
export const fetchAvailabilityById = (id) => request(`/availabilities/${id}/show`);
export const createAvailability = (data) => request('/availabilities/new', { method: 'POST', body: JSON.stringify(data) });
export const updateAvailability = (id, data) => request(`/availabilities/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAvailability = (id) => request(`/availabilities/${id}/delete`, { method: 'DELETE' });
export const fetchBoatAvailabilities = (boat_id) => request(`/availabilities/boat/${boat_id}`);