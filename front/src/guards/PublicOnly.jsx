// src/guards/PublicOnly.jsx
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../services/authService";

export default function PublicOnly({ children }) {
  return isTokenValid() ? <Navigate to="/" replace /> : children;
}