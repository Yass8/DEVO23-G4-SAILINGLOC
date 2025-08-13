import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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
import Preloader from "../../Client/components/Preloader";
import ScrollToTop from "../../Client/components/ScrollToTop";
import PaymentsAdmin from "./PaymentsAdmin";


// Composant Card réutilisable
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













// Dashboard Admin Component
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

// Composant Sidebar Admin
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

// Composant Navbar Admin
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

// Composant principal AdminLayout
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Fonction pour déterminer quel composant afficher selon la route
  const renderContent = () => {
    const path = location.pathname;

    // Vérifier d'abord les routes avec paramètres
    const userDetailsMatch = path.match(/^\/admin\/sl\/users\/(\d+)$/);
    if (userDetailsMatch) {
      return <DetailsUsers />;
    }

    // Ensuite les routes exactes
    switch (path) {
      case '/admin/sl':
      case '/admin/sl/dashboard':
        return <AdminDashboard />;
      case '/admin/sl/users':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/boats':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Bateaux</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/reservations':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Réservations</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/contracts':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Contrats</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/payments':
        return <PaymentsAdmin />;
      case '/admin/sl/ports':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Ports</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/messages':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Messages</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/reviews':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Gestion des Avis</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      case '/admin/sl/settings':
        return <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Configuration</h1>
            <p className="text-gray-600 mb-6">Cette page est en cours de développement</p>
          </div>
        </div>;
      default:
        return <AdminDashboard />;
    }
  };

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
        {renderContent()}
      </main>
    </div>
  );
}
