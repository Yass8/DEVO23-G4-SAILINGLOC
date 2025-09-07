// Vérifie si l'utilisateur a un rôle spécifique
export const hasRole = (role) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const roles = user.roles || [];
  return roles.includes(role);
};

export const isAdmin = () => hasRole('admin');
export const isOwner = () => hasRole('owner');
export const isTenant = () => hasRole('tenant');

// Récupère tous les rôles de l'utilisateur
export const getUserRoles = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.roles || [];
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const logoutAdmin = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/admin/sl/login';
};

// Vérifie si l'utilisateur est connecté et admin
export const isAuthenticatedAdmin = () => {
  const token = localStorage.getItem('adminToken');
  return token && isAdmin();
};