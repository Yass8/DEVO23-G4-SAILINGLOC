import { request } from "./http.js"

export const fetchBoatTypes = () => request('/boat-types');
export const fetchBoatTypeById = (id) => request(`/boat-types/${id}/show`);
export const createBoatType = (data) => request('/boat-types/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatType = (id, data) => request(`/boat-types/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoatType = (id) => request(`/boat-types/${id}/delete`, { method: 'DELETE' });

const typeOptions = [
  { value: 1, label: "Voilier" },
  { value: 2, label: "Catamaran" },
  { value: 3, label: "Bateau à moteur" },
  { value: 4, label: "Yacht" },
  { value: 5, label: "Péniche" },
  { value: 6, label: "Bateau de pêche" },
  { value: 7, label: "Bateau de plaisance" },
  { value: 8, label: "Bateau à voile" },
  { value: 9, label: "Bateau de croisière" },
  { value: 10, label: "Bateau de course" },
];

export const getTypes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(typeOptions);
    }, 1000); // Simulate a network delay
  });
};