import axios from 'axios';

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getToken = () => localStorage.getItem('token');

let csrfToken = null;

const getCsrfToken = async () => {
  try {
    const res = await axios.get(`${api_url}/csrf-token`, { withCredentials: true });
    csrfToken = res.data.csrfToken;
  } catch (err) {
    console.error("Erreur lors de la récupération du token CSRF :", err);
  }
};

export const request = async (endpoint, options = {}) => {
  const token = getToken();
    const method = options.method || 'GET';

  // Récupération du token CSRF
  if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase()) && !csrfToken) {
    await getCsrfToken();
  }


  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...options.headers,
  };

  try {
    const response = await axios({
      url: `${api_url}${endpoint}`,
      method,
      headers,
      data: options.body || undefined,
      withCredentials: true, // Envoyer les cookies
    });

    return response.data;

  } catch (err) {
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