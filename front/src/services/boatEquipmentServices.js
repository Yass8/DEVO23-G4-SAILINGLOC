import { request } from "./http.js"

export const fetchBoatEquipments = () => request('/boat-equipments');
export const fetchBoatEquipmentById = (id) => request(`/boat-equipments/${id}/show`);
export const createBoatEquipment = (data) => request('/boat-equipments/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatEquipment = (id, data) => request(`/boat-equipments/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoatEquipment = (id) => request(`/boat-equipments/${id}/delete`, { method: 'DELETE' });
export const fetchEquipmentsByBoatId = (boatId) => request(`/boat-equipments/boat/${boatId}`);
export const syncBoatEquipments = (boatId, equipment) => request(`/boat-equipments/boat/${boatId}/sync`, { method: 'POST', body: JSON.stringify({ equipment }) });
export const EQUIPMENTS_CATALOG = {
  Navigation: [
    "GPS / traceur",
    "VHF",
    "Compas",
    "Pilote automatique",
    "Sondeur",
    "Cartes papier",
  ],
  Sécurité: [
    "Gilets de sauvetage",
    "Radeau de survie",
    "Extincteurs",
    "Pompe de cale",
    "Trousse de secours",
  ],
  Technique: [
    "Batteries de service",
    "Chargeur",
    "Panneaux solaires",
    "Guindeau électrique",
    "Ancre principale",
  ],
  "Confort à bord": [
    "Cuisinière",
    "Réfrigérateur",
    "WC marins",
    "Douche intérieure",
    "Ventilateurs",
    "Literie",
  ],
  "Loisirs & extérieur": [
    "Annexe",
    "Paddle",
    "Kayak",
    "Snorkeling",
    "Pêche",
    "Barbecue",
    "Douche de pont",
  ],
};
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