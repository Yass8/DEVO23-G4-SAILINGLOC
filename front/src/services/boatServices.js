import { request } from "./http.js"

export const fetchBoats = (query = '') => request(`/boats/filters${query}`);
export const fetchBoatById = (id) => request(`/boats/${id}/show`);
export const fetchBoatBySlug = (slug) => request(`/boats/${slug}/details`);
// export const createBoat = (data) => request('/boats/new', { method: 'POST', body: data });
export const updateBoat = (id, data) => request(`/boats/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoat = (id) => request(`/boats/${id}/delete`, { method: 'DELETE' });

// Related data
export const fetchBoatPhotos = (id) => request(`/boats/${id}/photos`);
export const fetchBoatEquipments = (id) => request(`/boats/${id}/equipments`);
export const fetchBoatAvailabilities = (id) => request(`/boats/${id}/availabilities`);
export const fetchBoatReviews = (id) => request(`/boats/${id}/reviews`);
export const fetchBoatReservations = (id) => request(`/boats/${id}/reservations`);

export const createBoat = async (boatData, files) => {
  const formData = new FormData();

  formData.append('data', JSON.stringify(boatData));

  if (files.insurance_file) {
    formData.append('insurance_url', files.insurance_file);
  }
  if (files.registration_file) {
    formData.append('registration_url', files.registration_file);
  }

  if (files.photos && files.photos.length > 0) {
    files.photos.forEach((file) => {
      formData.append('photos', file);
    });
  }

  return request("/boats/new", {
    method: "POST",
    body: formData
  });
};
