import { request } from "./http.js"

export const fetchBoatTypes = () => request('/boat-types');
export const fetchBoatTypeById = (id) => request(`/boat-types/${id}/show`);
export const createBoatType = (data, file) => {
    const formData = new FormData();
    
    // Ajouter les données du type de bateau
    formData.append('name', data.name);
    
    // Ajouter le fichier photo s'il existe
    if (file) {
      formData.append('photo', file);
    }
    
    return request('/boat-types/new', { 
      method: 'POST', 
      body: formData 
    });
  };
  
// export const createBoatType = (data) => request('/boat-types/new', { method: 'POST', body: data });


// export const updateBoatType = (id, data) => request(`/boat-types/${id}/edit`, { method: 'PUT', body: data });

export const updateBoatType = (id, data, file) => {
    const formData = new FormData();
    
    // Ajouter les données du type de bateau
    formData.append('name', data.name);
    
    // Ajouter le fichier photo s'il existe
    if (file) {
      formData.append('photo', file);
    }
    
    return request(`/boat-types/${id}/edit`, { 
      method: 'PUT', 
      body: formData 
    });
  };
export const deleteBoatType = (id) => request(`/boat-types/${id}/delete`, { method: 'DELETE' });
