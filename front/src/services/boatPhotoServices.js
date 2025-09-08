import { request } from "./http.js"

export const fetchBoatPhotos = () => request('/boat-photos');
export const fetchBoatPhotoById = (id) => request(`/boat-photos/${id}/show`);
// export const createBoatPhoto = (data) => request('/boat-photos/new', { method: 'POST', body: JSON.stringify(data) });
export const updateBoatPhoto = (id, data) => request(`/boat-photos/${id}/edit`, { method: 'PUT', body: data });
export const updateBoatPhotoSync = (id, fd) => request(`/boat-photos/${id}/photos/sync`, { method: 'POST', body: fd });
export const deleteBoatPhoto = (id) => request(`/boat-photos/${id}/delete`, { method: 'DELETE' });
export const fetchPhotosByBoatId = (boatId) => request(`/boat-photos/boat/${boatId}`);

export const createBoatPhoto = (boatId, files, mainIndex = 0) => {
  const formData = new FormData();

  formData.append('boat_id', boatId);
  formData.append('mainIndex', mainIndex);

  files.forEach((file) => {
    formData.append('photos', file); // clé unique "photos"
  });

  return request('/boat-photos/new', {
    method: 'POST',
    body: formData,
    headers: {}
  });
};


// export const updateBoatPhoto = (id, data, file) => {
//   const fd = new FormData();
//   if (file) fd.append("file", file);
//   Object.entries(data).forEach(([k, v]) => fd.append(k, v));
//   return request(`/boat-photos/${id}/edit`, { method: "PUT", body: fd });
// };