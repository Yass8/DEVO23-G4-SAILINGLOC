import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, isOwner, isTenant, getUserRoles } from "../../utils/auth";
import OwnerDashboard from "./proprietaire/OwnerDashboard";
import TenantDashboard from "./locataire/TenantDashboard";
import ViewSelector from "./ViewSelector";
import Preloader from "../common/Preloader";

export default function DashboardClient() {
  const [userRoles, setUserRoles] = useState([]);
  const [activeView, setActiveView] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const roles = getUserRoles();
        setUserRoles(roles);
        
        // Déterminer la vue active par défaut
        if (roles.includes('admin') && roles.length === 1) {
          // Admin seul - rediriger après le chargement
          return;
        } else if (hasAllThreeRoles(roles)) {
          setActiveView('owner'); // Par défaut owner pour triple rôle
        } else if (roles.includes('owner') && roles.includes('tenant')) {
          setActiveView('owner');
        } else if (roles.includes('owner')) {
          setActiveView('owner');
        } else if (roles.includes('tenant')) {
          setActiveView('tenant');
        }

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  // Vérifie si l'utilisateur a les trois rôles
  const hasAllThreeRoles = (roles) => {
    return isAdmin() && isOwner() && isTenant();
  };

  if (loading) {
    return <Preloader />;
  }

  // Redirection pour admin seul (APRÈS le loading)
  if (userRoles.includes('admin') && userRoles.length === 1) {
    navigate('/admin/sl');
    return null;
  }

  // Redirection si vue admin selectionnée (pour multi-rôles)
  if (activeView === 'admin') {
    navigate('/admin/sl');
    return null;
  }

  return (
    <div className="p-6">
      {/* Sélecteur de vue pour les multi-rôles */}
      {(hasAllThreeRoles(userRoles) || (isOwner() && isTenant())) && (
        <ViewSelector 
          activeView={activeView} 
          setActiveView={setActiveView}
          showAdminOption={hasAllThreeRoles(userRoles)}
        />
      )}
      
      {activeView === 'owner' ? (
        <OwnerDashboard />
      ) : (
        <TenantDashboard />
      )}
    </div>
  );
}