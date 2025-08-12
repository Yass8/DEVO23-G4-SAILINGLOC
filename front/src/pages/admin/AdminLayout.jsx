import { useState, useEffect } from "react";
import { Outlet, useLocation, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faShip,
  faCalendarCheck,
  faFileContract,
  faCreditCard,
  faEnvelope,
  faStar,
  faAnchor,
  faChartLine,
  faCog,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faBars,
  faTimes,
  faSignOutAlt,
  faHome,
  faSearch,
  faBell,
  faUser,
  faMoneyBillWave,
  faEye,
  faEdit,
  faTrash,
  faSpinner,
  faRefresh
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Preloader from "../../Client/components/Preloader";
import ScrollToTop from "../../Client/components/ScrollToTop";
// Services temporairement commentés car le fichier n'existe pas
// import {
//   getAdminStats,
//   getPendingReservations,
//   getUnreadMessages,
//   getRecentReviews,
//   getRecentContracts,
//   getRecentPayments,
//   approveReservation,
//   rejectReservation,
//   markMessageAsRead,
//   deleteReview,
//   deleteBoat,
//   deletePort
// } from "../../services/adminServices";
// Imports pour toutes les pages du dashboard admin
import UsersAdminPage from "./UsersAdminPage";
import BoatsAdminPage from "./BoatsAdminPage";
import ReservationsAdminPage from "./ReservationsAdminPage";
import ContractsAdminPage from "./ContractsAdminPage";
import PaymentsAdminPage from "./PaymentsAdminPage";
import MessagesAdminPage from "./MessagesAdminPage";
import ReviewsAdminPage from "./ReviewsAdminPage";
import SettingsAdminPage from "./SettingsAdminPage";

// Composant Card réutilisable (même style que le client)
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

// Dashboard Admin Component (style client + données backend)
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
  const [pendingReservations, setPendingReservations] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentContracts, setRecentContracts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Fonction temporairement commentée car les services n'existent pas
    console.log('Chargement des données du dashboard...');
    setLoading(false);
    
    // Données simulées pour le moment
    setStats({
      totalBoats: 25,
      totalReservations: 150,
      totalContracts: 120,
      totalRevenue: 15000,
      pendingReservations: 8,
      unreadMessages: 12,
      totalReviews: 45
    });
    setPendingReservations([]);
    setUnreadMessages([]);
    setRecentReviews([]);
    setRecentContracts([]);
    setRecentPayments([]);
  };

  // Actions admin - temporairement commentées car les services n'existent pas
  const handleApproveReservation = async (reservationId) => {
    console.log('Approbation de la réservation:', reservationId);
    alert('Fonctionnalité temporairement désactivée');
  };

  const handleRejectReservation = async (reservationId) => {
    console.log('Rejet de la réservation:', reservationId);
    alert('Fonctionnalité temporairement désactivée');
  };

  const handleMarkMessageAsRead = async (messageId) => {
    console.log('Marquage du message comme lu:', messageId);
    alert('Fonctionnalité temporairement désactivée');
  };

  const handleDeleteReview = async (reviewId) => {
    console.log('Suppression de l\'avis:', reviewId);
    alert('Fonctionnalité temporairement désactivée');
  };

  return (
    <div className="space-y-6">
      {/* Stats Admin - même structure que le client */}
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

      {/* Demandes en attente - données réelles du backend */}
      {pendingReservations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Réservations en attente de validation</h2>
          <ul className="space-y-4">
            {pendingReservations.map((reservation) => (
              <li key={reservation.id} className="border rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Bateau :</strong> {reservation.boat?.name || 'N/A'}</p>
                    <p><strong>Propriétaire :</strong> {reservation.boat?.owner?.name || 'N/A'}</p>
                    <p><strong>Locataire :</strong> {reservation.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p><strong>Dates :</strong> {reservation.startDate} → {reservation.endDate}</p>
                    <p><strong>Prix :</strong> {reservation.totalPrice} €</p>
                    <p><strong>Statut :</strong> <span className="text-yellow-600">En attente</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-[#AD7C59] text-white px-3 py-1 rounded hover:bg-[#9B6B47] transition-colors disabled:opacity-50"
                    onClick={() => handleApproveReservation(reservation.id)}
                    disabled={actionLoading[`approve_${reservation.id}`]}
                  >
                    {actionLoading[`approve_${reservation.id}`] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4 mr-1" />
                    ) : (
                      <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 mr-1" />
                    )}
                    Approuver
                  </button>
                  <button 
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    onClick={() => handleRejectReservation(reservation.id)}
                    disabled={actionLoading[`reject_${reservation.id}`]}
                  >
                    {actionLoading[`reject_${reservation.id}`] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4 mr-1" />
                    ) : (
                      <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4 mr-1" />
                    )}
                    Refuser
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Messages non lus - données réelles */}
      {unreadMessages.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Messages non lus</h2>
          <ul className="space-y-4">
            {unreadMessages.map((message) => (
              <li key={message.id} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">De: {message.sender?.name || 'Utilisateur'}</p>
                    <p className="text-sm text-gray-600">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(message.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="text-[#AD7C59] hover:text-[#9B6B47] transition-colors disabled:opacity-50"
                    onClick={() => handleMarkMessageAsRead(message.id)}
                    disabled={actionLoading[`read_${message.id}`]}
                  >
                    {actionLoading[`read_${message.id}`] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions rapides - style client */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/sl/users" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faUsers} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Utilisateurs</p>
                <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/boats" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faShip} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Bateaux</p>
                <p className="text-sm text-gray-600">Gérer les bateaux</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/reservations" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Réservations</p>
                <p className="text-sm text-gray-600">Gérer les réservations</p>
              </div>
            </div>
          </Link>
          
          <Link to="/admin/sl/contracts" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFileContract} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Contrats</p>
                <p className="text-sm text-gray-600">Gérer les contrats</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistiques détaillées - données réelles */}
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
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                <span>Refusées</span>
              </div>
              <span className="font-bold text-red-600">0</span>
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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">Contrats actifs</p>
                <p className="text-sm text-gray-600">{stats.totalContracts} contrats</p>
              </div>
              <FontAwesomeIcon icon={faFileContract} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Avis récents - données réelles */}
      {recentReviews.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Avis récents</h2>
          <ul className="space-y-4">
            {recentReviews.map((review) => (
              <li key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">{review.user?.name || 'Utilisateur'}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon 
                            key={i} 
                            icon={faStar} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">
                      Bateau: {review.boat?.name || 'N/A'} | 
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={actionLoading[`delete_review_${review.id}`]}
                  >
                    {actionLoading[`delete_review_${review.id}`] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
                    ) : (
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bouton de rafraîchissement */}
      <div className="flex justify-center">
        <button 
          onClick={loadDashboardData}
          disabled={loading}
          className="bg-[#AD7C59] text-white px-6 py-3 rounded-lg hover:bg-[#9B6B47] transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin w-4 h-4" />
          ) : (
            <FontAwesomeIcon icon={faRefresh} className="w-4 h-4" />
          )}
          <span>Rafraîchir les données</span>
        </button>
      </div>
    </div>
  );
};

// Composant Sidebar Admin (style client)
const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin/sl/dashboard", label: "Dashboard", icon: faChartLine },
    { path: "/admin/sl/users", label: "Utilisateurs", icon: faUsers },
    { path: "/admin/sl/boats", label: "Bateaux", icon: faShip },
    { path: "/admin/sl/reservations", label: "Réservations", icon: faCalendarCheck },
    { path: "/admin/sl/contracts", label: "Contrats", icon: faFileContract },
    { path: "/admin/sl/payments", label: "Paiements", icon: faCreditCard },
    { path: "/admin/sl/ports", label: "Ports", icon: faAnchor },
    { path: "/admin/sl/messages", label: "Messages", icon: faEnvelope },
    { path: "/admin/sl/reviews", label: "Avis", icon: faStar },
    { path: "/admin/sl/settings", label: "Configuration", icon: faCog }
  ];

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } sm:translate-x-0`}>
      <div className="h-full px-3 py-2 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
            <span className="text-lg font-semibold text-[#AD7C59]">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-[#AD7C59] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-[#AD7C59]'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="flex items-center p-3 text-sm font-medium text-[#AD7C59] rounded-xl hover:bg-[#AD7C59] hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  );
};
// Composant Navbar Admin (style client)
const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => (
  <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 sm:left-64">
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 sm:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-[#AD7C59]">Administration SailingLoc</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">Admin</span>
        </div>
      </div>
    </div>
  </nav>
);

 export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <Preloader />
      <ScrollToTop />

      {/* Sidebar Admin */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Navbar Admin */}
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Contenu principal */}
      <main className="p-4 sm:ml-64 mt-16">
        <Outlet />
      </main>
    </div>
  );
}