// Vérifie si l'utilisateur a un rôle spécifique
export const hasRole = (role) => {
  const storedRoles = localStorage.getItem('userRoles');
  if (!storedRoles) return false;
  
  try {
    const roles = JSON.parse(storedRoles);
    const userRoles = Array.isArray(roles) ? roles : [roles];
    return userRoles.includes(role);
  } catch (error) {
    console.error('Error parsing user roles:', error);
    return false;
  }
};


export const isAdmin = () => hasRole('admin');
export const isOwner = () => hasRole('owner');
export const isTenant = () => hasRole('tenant');

// Récupère tous les rôles de l'utilisateur
export const getUserRoles = () => {
  const storedRoles = localStorage.getItem('userRoles');
  if (!storedRoles) return [];
  
  try {
    const roles = JSON.parse(storedRoles);
    return Array.isArray(roles) ? roles : [roles];
  } catch (error) {
    console.error('Error parsing user roles:', error);
    return [];
  }
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