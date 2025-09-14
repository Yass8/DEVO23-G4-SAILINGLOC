// src/guards/AdminLoginGate.jsx
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../services/authService";
import { isAdmin } from "../utils/auth";

export default function AdminLoginGate({ children }) {
  if (!isTokenValid()) return children;               // pas connecté → on affiche LoginAdmin
  return isAdmin()
    ? <Navigate to="/admin/sl/dashboard" replace />   // admin déjà logué
    : <Navigate to="/" replace />;                   // simple client → home
}