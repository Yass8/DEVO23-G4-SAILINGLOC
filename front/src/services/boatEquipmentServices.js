import { request } from "./http.js"

export const fetchBoatEquipments = () => request('/boat-equipments');
export const fetchBoatEquipmentById = (id) => request(`/boat-equipments/${id}/show`);
export const createBoatEquipment = (data) => request('/boat-equipments/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatEquipment = (id, data) => request(`/boat-equipments/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoatEquipment = (id) => request(`/boat-equipments/${id}/delete`, { method: 'DELETE' });
export const fetchEquipmentsByBoatId = (boatId) => request(`/boat-equipments/boat/${boatId}`);

const equipments = async () => {
  return [
    { value: "wifi", label: "Wi-Fi" },
    { value: "kayak", label: "Kayak" },
    { value: "paddle", label: "Paddle" },
    { value: "snorkeling", label: "Snorkeling" },
    { value: "fishing", label: "Pêche" },
    { value: "skipper", label: "Skipper" },
    { value: "cooking", label: "Cuisine" },
  ];
};

export const getEquipments = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(equipments());
    }, 1000);
  });
};