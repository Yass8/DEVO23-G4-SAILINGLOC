import { request } from "./http.js";

export const login = (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const register = (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) });
// export const getCurrentUser = () => request('/auth/me');
export const confirmEmail = (token) => request(`/auth/confirmation/${token}`);
export const changePassword = (data) => request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
});

export const forgotPasswordEmail = (email) =>
  request("/auth/forgot-password-email", {
    method: "POST",
    body: JSON.stringify({ email }),
});

export const resetPassword = (token, password) =>
  request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
  

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthencated = () => {
  return !!getCurrentUser();
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Décoder le payload du JWT (partie centrale)
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Vérifier l'expiration (exp en secondes)
    if (payload.exp && Date.now() / 1000 < payload.exp) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token invalide ou mal formé", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  return Promise.resolve();
};
