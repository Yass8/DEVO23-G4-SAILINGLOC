import axios from 'axios';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getToken = () => localStorage.getItem('token');

export const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await axios({
      url: `${api_url}${endpoint}`,
      method: options.method || 'GET',
      headers,
      data: options.body || undefined, // axios utilise "data" pour envoyer le corps
    });

    return response.data; // avec axios, c'est ici qu'on récupère la réponse
  } catch (err) {
    // Gestion d'erreur plus claire
    if (err.response) {
      // Erreur HTTP avec code
      throw new Error(err.response.data?.message || `Erreur ${err.response.status}`);
    } else if (err.request) {
      // Pas de réponse du serveur
      throw new Error("Impossible de contacter le serveur");
    } else {
      // Autre erreur
      throw new Error(err.message);
    }
  }
};
