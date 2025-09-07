import { request } from "./http.js"

export const fetchBoatPhotos = () => request('/boat-photos');
export const fetchBoatPhotoById = (id) => request(`/boat-photos/${id}/show`);
// export const createBoatPhoto = (data) => request('/boat-photos/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatPhoto = (id, data) => request(`/boat-photos/${id}/edit`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBoatPhoto = (id) => request(`/boat-photos/${id}/delete`, { method: 'DELETE' });
export const fetchPhotosByBoatId = (boatId) => request(`/boat-photos/boat/${boatId}`);

export const createBoatPhoto = (boatId, files, mainIndex = 0) => {
  const formData = new FormData();
  
  // Ajouter les paramètres de base
  formData.append('boat_id', boatId);
  formData.append('mainIndex', mainIndex);
  
  // Ajouter chaque fichier
  files.forEach((file, index) => {
    formData.append(`photos[${index}]`, file.data, file.name);
  });
  
  return request('/boat-photos/new', {
    method: 'POST',
    body: formData,
    headers: {}
  });
};