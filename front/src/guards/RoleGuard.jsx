// src/guards/RoleGuard.js
import { Navigate } from 'react-router-dom';
import { getUserRoles } from '../utils/auth';
import { isTokenValid } from '../services/authService';

export default function RoleGuard({
  allowedRoles = [],
  children,
  redirectTo = '/login'
}) {
  
  if (!isTokenValid()) return <Navigate to={redirectTo} replace />;

  const userRoles = getUserRoles() || [];

  if (!allowedRoles.length) return children;

  
  const hasAccess = allowedRoles.some(r => userRoles.includes(r));
  if (!hasAccess) return <Navigate to={redirectTo} replace />;

  return children;
}