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
    try {
      setLoading(true);
      
      // Données simulées pour le moment
      const mockStats = {
        totalBoats: 25,
        totalReservations: 150,
        totalContracts: 120,
        totalRevenue: 15000,
        pendingReservations: 8,
        unreadMessages: 25,
        totalReviews: 42
      };
      
      setStats(mockStats);
      
      // Simuler les données récentes
      setPendingReservations([
        { id: 1, boat: 'Voilier Élégance', user: 'Jean Dupont', date: '2024-01-15', status: 'pending' },
        { id: 2, boat: 'Catamaran Horizon', user: 'Marie Martin', date: '2024-01-16', status: 'pending' }
      ]);
      
      setUnreadMessages([
        { id: 1, from: 'Pierre Durand', subject: 'Question sur la réservation', time: 'Il y a 2h' },
        { id: 2, from: 'Sophie Bernard', subject: 'Problème technique', time: 'Il y a 4h' }
      ]);
      
      setRecentReviews([
        { id: 1, boat: 'Voilier Élégance', user: 'Jean Dupont', rating: 5, comment: 'Excellent service !' },
        { id: 2, boat: 'Catamaran Horizon', user: 'Marie Martin', rating: 4, comment: 'Très satisfait' }
      ]);
      
      setRecentContracts([
        { id: 1, boat: 'Voilier Élégance', user: 'Jean Dupont', amount: 800, status: 'signed' },
        { id: 2, boat: 'Catamaran Horizon', user: 'Marie Martin', amount: 1200, status: 'pending' }
      ]);
      
      setRecentPayments([
        { id: 1, user: 'Jean Dupont', amount: 800, status: 'completed', date: '2024-01-14' },
        { id: 2, user: 'Marie Martin', amount: 1200, status: 'pending', date: '2024-01-15' }
      ]);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, id) => {
    setActionLoading(prev => ({ ...prev, [action + id]: true }));
    
    try {
      // Simuler une action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les données selon l'action
      if (action === 'approve') {
        setPendingReservations(prev => prev.filter(r => r.id !== id));
        setStats(prev => ({ ...prev, pendingReservations: prev.pendingReservations - 1 }));
      } else if (action === 'reject') {
        setPendingReservations(prev => prev.filter(r => r.id !== id));
        setStats(prev => ({ ...prev, pendingReservations: prev.pendingReservations - 1 }));
      } else if (action === 'markRead') {
        setUnreadMessages(prev => prev.filter(m => m.id !== id));
        setStats(prev => ({ ...prev, unreadMessages: prev.unreadMessages - 1 }));
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [action + id]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-[#AD7C59] mb-2">Dashboard Administrateur</h1>
        <p className="text-gray-600">Bienvenue dans votre espace d'administration SailingLoc</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          icon={faShip} 
          value={stats.totalBoats} 
          label="Total Bateaux" 
          color="text-blue-600"
          loading={loading}
        />
        <Card 
          icon={faCalendarCheck} 
          value={stats.totalReservations} 
          label="Total Réservations" 
          color="text-green-600"
          loading={loading}
        />
        <Card 
          icon={faFileContract} 
          value={stats.totalContracts} 
          label="Total Contrats" 
          color="text-purple-600"
          loading={loading}
        />
        <Card 
          icon={faMoneyBillWave} 
          value={formatCurrency(stats.totalRevenue)} 
          label="Revenus Totaux" 
          color="text-[#AD7C59]"
          loading={loading}
        />
      </div>

      {/* Actions rapides */}
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
          
          <Link to="/admin/sl/settings" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCog} className="text-2xl text-[#AD7C59]" />
              <div>
                <p className="font-semibold">Configuration</p>
                <p className="text-sm text-gray-600">Paramètres système</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Réservations en attente */}
      {pendingReservations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Réservations en attente</h2>
          <div className="space-y-3">
            {pendingReservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{reservation.boat}</p>
                  <p className="text-sm text-gray-600">{reservation.user} - {reservation.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction('approve', reservation.id)}
                    disabled={actionLoading['approve' + reservation.id]}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {actionLoading['approve' + reservation.id] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      'Approuver'
                    )}
                  </button>
                  <button
                    onClick={() => handleAction('reject', reservation.id)}
                    disabled={actionLoading['reject' + reservation.id]}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading['reject' + reservation.id] ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      'Rejeter'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages non lus */}
      {unreadMessages.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Messages non lus</h2>
          <div className="space-y-3">
            {unreadMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{message.from}</p>
                  <p className="text-sm text-gray-600">{message.subject} - {message.time}</p>
                </div>
                <button
                  onClick={() => handleAction('markRead', message.id)}
                  disabled={actionLoading['markRead' + message.id]}
                  className="px-3 py-1 bg-[#AD7C59] text-white rounded hover:bg-[#9B6B47] disabled:opacity-50"
                >
                  {actionLoading['markRead' + message.id] ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    'Marquer comme lu'
                  )}
                </button>
              </div>
            ))}
          </div>
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
    <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } sm:translate-x-0`}>
      <div className="h-full px-3 py-2 overflow-y-auto bg-white border-r border-gray-200">
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

      {/* Contenu principal avec routes */}
      <main className="p-4 sm:ml-64 mt-16">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersAdminPage />} />
          <Route path="boats" element={<BoatsAdminPage />} />
          <Route path="reservations" element={<ReservationsAdminPage />} />
          <Route path="contracts" element={<ContractsAdminPage />} />
          <Route path="payments" element={<PaymentsAdminPage />} />
          <Route path="messages" element={<MessagesAdminPage />} />
          <Route path="reviews" element={<ReviewsAdminPage />} />
          <Route path="settings" element={<SettingsAdminPage />} />
        </Routes>
      </main>
    </div>
  );
} 