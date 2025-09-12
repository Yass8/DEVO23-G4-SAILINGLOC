import { faCalendarCheck, faCheckCircle, faEnvelope, faFileContract, faHourglassHalf, faMoneyBillWave, faShip, faSpinner, faStar, faUsers, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getDetailedStats } from "../../services/adminServices";

function Card({ icon, value, label, color = "text-slate-blue", loading = false, error = false }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3">
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        {loading ? (
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#AD7C59]" />
            <span className="text-sm text-gray-500">Chargement...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
            <span className="text-sm text-red-500">Erreur de chargement</span>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBoats: 0,
    totalReservations: 0,
    totalContracts: 0,
    totalRevenue: 0,
    pendingReservations: 0,
    unreadMessages: 0,
    totalReviews: 0
  });
  const [detailedStats, setDetailedStats] = useState({
    activeUsers: 0,
    boatsInRental: 0,
    pendingPayments: 0,
    unreadMessages: 0,
    pendingReviews: 0,
    scheduledMaintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Charger les statistiques principales
        const mainStats = await getAdminStats();
        setStats(mainStats);
        
        // Charger les statistiques détaillées
        const detailed = await getDetailedStats();
        setDetailedStats(detailed);
        
      } catch (err) {
        console.error('Erreur lors du chargement du dashboard:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité de la plateforme SailingLoc</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          icon={faShip} 
          value={stats.totalBoats} 
          label="Bateaux actifs" 
          color="text-[#AD7C59]" 
          loading={loading}
          error={error}
        />
        <Card 
          icon={faCalendarCheck} 
          value={stats.totalReservations} 
          label="Réservations totales" 
          color="text-[#AD7C59]" 
          loading={loading}
          error={error}
        />
        <Card 
          icon={faFileContract} 
          value={stats.totalContracts} 
          label="Contrats actifs" 
          color="text-[#AD7C59]" 
          loading={loading}
          error={error}
        />
        <Card 
          icon={faMoneyBillWave} 
          value={`${stats.totalRevenue.toLocaleString()} €`} 
          label="Revenus totaux" 
          color="text-[#AD7C59]" 
          loading={loading}
          error={error}
        />
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/sl/users" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left w-full">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faUsers} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Utilisateurs</p>
                <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
                <p className="text-xs text-green-600 mt-1">✅ Disponible</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/boats" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left w-full">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faShip} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Bateaux</p>
                <p className="text-sm text-gray-600">Gérer les bateaux</p>
                <p className="text-xs text-green-600 mt-1">✅ Disponible</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/reservations" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left w-full">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Réservations</p>
                <p className="text-sm text-gray-600">Gérer les réservations</p>
                <p className="text-xs text-green-600 mt-1">✅ Disponible</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/contracts" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left w-full">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFileContract} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Contrats</p>
                <p className="text-sm text-gray-600">Gérer les contrats</p>
                <p className="text-xs text-green-600 mt-1">✅ Disponible</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Réservations par statut</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                <span>Confirmées</span>
              </div>
              <span className="font-bold text-green-600">
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  stats.totalReservations - stats.pendingReservations
                )}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-600" />
                <span>En attente</span>
              </div>
              <span className="font-bold text-yellow-600">
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  stats.pendingReservations
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Messages et avis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Support client</p>
                <p className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Chargement...</span>
                    </span>
                  ) : (
                    `${detailedStats.unreadMessages} messages non lus`
                  )}
                </p>
              </div>
              <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59]" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Avis en attente</p>
                <p className="text-sm text-gray-600">
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Chargement...</span>
                    </span>
                  ) : (
                    `${detailedStats.pendingReviews} avis en attente`
                  )}
                </p>
              </div>
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Utilisateurs actifs</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#AD7C59]">
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  detailedStats.activeUsers
                )}
              </p>
              <p className="text-sm text-gray-600">Utilisateurs connectés</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-[#AD7C59] opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Bateaux en location</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#AD7C59]">
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  detailedStats.boatsInRental
                )}
              </p>
              <p className="text-sm text-gray-600">Actuellement loués</p>
            </div>
            <FontAwesomeIcon icon={faShip} className="text-4xl text-[#AD7C59] opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4">Paiements en attente</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#AD7C59]">
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                ) : (
                  detailedStats.pendingPayments
                )}
              </p>
              <p className="text-sm text-gray-600">En attente de validation</p>
            </div>
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-4xl text-[#AD7C59] opacity-20" />
          </div>
        </div>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-semibold">Erreur de chargement</h3>
              <p className="text-red-700 text-sm">
                Impossible de charger les données du tableau de bord. Veuillez vérifier votre connexion et réessayer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;