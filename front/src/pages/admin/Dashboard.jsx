import { faCalendarCheck, faCheckCircle, faEnvelope, faFileContract, faHourglassHalf, faMoneyBillWave, faShip, faSpinner, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Card({ icon, value, label, color = "text-slate-blue", loading = false }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3">
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        {loading ? (
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#AD7C59]" />
            <span className="text-sm text-gray-500">Chargement...</span>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Données simulées
    setTimeout(() => {
      setStats({
        totalBoats: 25,
        totalReservations: 150,
        totalContracts: 120,
        totalRevenue: 15000,
        pendingReservations: 8,
        unreadMessages: 12,
        totalReviews: 45
      });
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          icon={faShip} 
          value={stats.totalBoats} 
          label="Bateaux actifs" 
          color="text-[#AD7C59]" 
          loading={loading}
        />
        <Card 
          icon={faCalendarCheck} 
          value={stats.totalReservations} 
          label="Réservations totales" 
          color="text-[#AD7C59]" 
          loading={loading}
        />
        <Card 
          icon={faFileContract} 
          value={stats.totalContracts} 
          label="Contrats actifs" 
          color="text-[#AD7C59]" 
          loading={loading}
        />
        <Card 
          icon={faMoneyBillWave} 
          value={`${stats.totalRevenue.toLocaleString()} €`} 
          label="Revenus totaux" 
          color="text-[#AD7C59]" 
          loading={loading}
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
                <p className="text-xs text-[#AD7C59] mt-1">🔄 En développement</p>
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
              <span className="font-bold text-green-600">{stats.totalReservations - stats.pendingReservations}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-600" />
                <span>En attente</span>
              </div>
              <span className="font-bold text-yellow-600">{stats.pendingReservations}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Messages non lus</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Support client</p>
                <p className="text-sm text-gray-600">{stats.unreadMessages} messages non lus</p>
              </div>
              <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59]" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Avis récents</p>
                <p className="text-sm text-gray-600">{stats.totalReviews} avis au total</p>
              </div>
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;