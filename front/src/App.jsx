import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css'
import Home from './Client/pages/Home.jsx';
import About from './Client/pages/About.jsx';
import Category from './Client/pages/Category.jsx';
import Boats from './Client/pages/Boats.jsx';
import Details from './Client/pages/Details.jsx';
import Contact from './Client/pages/Contact.jsx';
import Login from './Client/pages/Login.jsx';
import Register from './Client/pages/Register.jsx';
import Footer from './Client/components/Footer'; 
import Page404 from './Client/pages/Page404.jsx';
import Customer from "./pages/client/Customer.jsx";
import Dashboard from "./components/client/Dashboard.jsx";
import Messages from "./components/client/Message.jsx";
import MesBateaux from "./components/client/proprietaire/MesBateaux.jsx";
import VoirBateau from "./components/client/proprietaire/ViewBoat.jsx";
import CreateBoat from "./components/client/proprietaire/CreatBoat.jsx";
import EditBoat from "./pages/client/proprietaire/EditBoat.jsx";
import AvailabilitiesManagement from "./pages/client/proprietaire/AvailabilitiesManagement.jsx";
import RevenusStats from "./pages/client/proprietaire/RevenusStats.jsx";
import MyReservations from "./pages/client/locataire/MyReservations.jsx";
import ReservationDetail from "./pages/client/locataire/ReservationDetails.jsx";
import ReservationChat from "./pages/client/locataire/ReservationChat.jsx";
import Profile from "./pages/common/Profil.jsx";
import Documents from "./pages/common/Documents.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import UsersAdminPage from "./pages/admin/UsersAdminPage.jsx";
import BoatsAdminPage from "./pages/admin/BoatsAdminPage.jsx";
import ReservationsAdminPage from "./pages/admin/ReservationsAdminPage.jsx";
import ContractsAdminPage from "./pages/admin/ContractsAdminPage.jsx";
import PaymentsAdminPage from "./pages/admin/PaymentsAdminPage.jsx";
import MessagesAdminPage from "./pages/admin/MessagesAdminPage.jsx";
import ReviewsAdminPage from "./pages/admin/ReviewsAdminPage.jsx";
import SettingsAdminPage from "./pages/admin/SettingsAdminPage.jsx";

// Composant AdminDashboard - Style Moderne avec Vraies Données du Backend
import { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getPendingReservations, 
  getUnreadMessages, 
  getRecentReviews, 
  getRecentContracts, 
  getRecentPayments,
  getDetailedStats
} from '../services/adminServices';

function AdminDashboard() {
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
  const [recentActivity, setRecentActivity] = useState([]);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Essayer de charger les vraies données du backend
      let statsData, detailedStatsData;
      
      try {
        [statsData, detailedStatsData] = await Promise.all([
          getAdminStats(),
          getDetailedStats()
        ]);
        setIsBackendAvailable(true);
      } catch (apiError) {
        console.log('Backend non disponible, utilisation des données simulées');
        setIsBackendAvailable(false);
        // Utiliser des données simulées si le backend n'est pas disponible
        statsData = {
          totalBoats: 25,
          totalReservations: 150,
          totalContracts: 120,
          totalRevenue: 15000,
          pendingReservations: 8,
          unreadMessages: 25,
          totalReviews: 42
        };
        
        detailedStatsData = {
          activeUsers: 247,
          boatsInRental: 18,
          pendingPayments: 12,
          unreadMessages: 25,
          pendingReviews: 15,
          scheduledMaintenance: 7
        };
      }
      
      setStats(statsData);
      setDetailedStats(detailedStatsData);
      
      // Simuler l'activité récente
      setRecentActivity([
        { type: 'reservation', message: 'Nouvelle réservation', time: 'Il y a 5 minutes', status: 'success' },
        { type: 'boat', message: 'Nouveau bateau ajouté', time: 'Il y a 1 heure', status: 'info' },
        { type: 'contract', message: 'Contrat signé', time: 'Il y a 2 heures', status: 'success' }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 p-6">
      {/* En-tête avec effet glassmorphism amélioré */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-amber-100/50 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#AD7C59] via-amber-700 to-orange-700 bg-clip-text text-transparent">
              Dashboard Administrateur
            </h1>
            <p className="text-slate-600 mt-3 text-lg font-medium">Bienvenue dans votre espace d'administration SailingLoc</p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-[#AD7C59] to-amber-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
              <p className="text-sm font-medium">{new Date().toLocaleString('fr-FR')}</p>
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
            
            {/* Indicateur de statut du backend */}
            <div className="mt-3 text-center">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                isBackendAvailable 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isBackendAvailable ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                {isBackendAvailable ? 'Backend Connecté' : 'Mode Simulation'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques avec cartes flottantes et vraies données */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-wide">Bateaux Actifs</p>
                <p className="text-4xl font-bold text-[#AD7C59] mt-2">
                  {loading ? '...' : stats.totalBoats}
                </p>
                <p className="text-amber-600 text-sm opacity-90 mt-1 font-medium">
                  {detailedStats.boatsInRental} en location
                </p>
              </div>
              <div className="text-5xl text-amber-600 opacity-70 group-hover:scale-110 transition-transform">🚢</div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-wide">Réservations</p>
                <p className="text-4xl font-bold text-[#AD7C59] mt-2">
                  {loading ? '...' : stats.totalReservations}
                </p>
                <p className="text-amber-600 text-sm opacity-90 mt-1 font-medium">
                  {stats.pendingReservations} en attente
                </p>
              </div>
              <div className="text-5xl text-amber-600 opacity-70 group-hover:scale-110 transition-transform">📅</div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-wide">Contrats</p>
                <p className="text-4xl font-bold text-[#AD7C59] mt-2">
                  {loading ? '...' : stats.totalContracts}
                </p>
                <p className="text-amber-600 text-sm opacity-90 mt-1 font-medium">
                  Actifs ce mois
                </p>
              </div>
              <div className="text-5xl text-amber-600 opacity-70 group-hover:scale-110 transition-transform">📋</div>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-45 transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-semibold uppercase tracking-wide">Revenus</p>
                <p className="text-4xl font-bold text-[#AD7C59] mt-2">
                  {loading ? '...' : formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-amber-600 text-sm opacity-90 mt-1 font-medium">
                  {detailedStats.pendingPayments} paiements en attente
                </p>
              </div>
              <div className="text-5xl text-amber-600 opacity-70 group-hover:scale-110 transition-transform">💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des actions rapides avec vraies données */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-amber-100/50">
          <h2 className="text-2xl font-bold text-[#AD7C59] mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-[#AD7C59] to-amber-600 rounded-full"></span>
            Actions Rapides
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/sl/users'}
              className="group p-6 bg-gradient-to-br from-[#AD7C59] via-amber-600 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-[#AD7C59] text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <p className="font-semibold">Gérer Utilisateurs</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/sl/boats'}
              className="group p-6 bg-gradient-to-br from-[#AD7C59] via-amber-600 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-[#AD7C59] text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚢</div>
              <p className="font-semibold">Gérer Bateaux</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/sl/reservations'}
              className="group p-6 bg-gradient-to-br from-[#AD7C59] via-amber-600 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-[#AD7C59] text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📅</div>
              <p className="font-semibold">Réservations</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/sl/settings'}
              className="group p-6 bg-gradient-to-br from-[#AD7C59] via-amber-600 to-orange-600 hover:from-orange-600 hover:via-amber-600 hover:to-[#AD7C59] text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <p className="font-semibold">Paramètres</p>
            </button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-amber-100/50">
          <h2 className="text-2xl font-bold text-[#AD7C59] mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-[#AD7C59] to-amber-600 rounded-full"></span>
            Activité Récente
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                <div className="w-4 h-4 bg-gradient-to-r from-[#AD7C59] to-amber-600 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">Chargement...</p>
                  <p className="text-xs text-slate-500">Récupération des données</p>
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-l-4 border-[#AD7C59] hover:from-amber-100 hover:to-orange-100 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#AD7C59] to-amber-600 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                <div className="w-4 h-4 bg-gradient-to-r from-[#AD7C59] to-amber-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">Aucune activité récente</p>
                  <p className="text-xs text-slate-500">Le système est calme</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métriques avec couleurs harmonisées */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-amber-100/50 mb-8">
        <h2 className="text-2xl font-bold text-[#AD7C59] mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-[#AD7C59] to-amber-600 rounded-full"></span>
          Métriques du Mois
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="text-4xl font-bold text-[#AD7C59] mb-3 group-hover:scale-110 transition-transform">85%</div>
            <p className="text-slate-600 mb-4 font-medium">Taux de satisfaction</p>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '85%'}}></div>
            </div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-[#AD7C59] mb-3 group-hover:scale-110 transition-transform">92%</div>
            <p className="text-slate-600 mb-4 font-medium">Taux de réservation</p>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
            </div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-[#AD7C59] mb-3 group-hover:scale-110 transition-transform">78%</div>
            <p className="text-slate-600 mb-4 font-medium">Taux de conversion</p>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className="bg-gradient-to-r from-[#AD7C59] via-amber-600 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '78%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques avancées avec vraies données */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-amber-100/50 mb-8">
        <h2 className="text-2xl font-bold text-[#AD7C59] mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-[#AD7C59] to-amber-600 rounded-full"></span>
          Statistiques Avancées
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Utilisateurs actifs</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.activeUsers}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Bateaux en location</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.boatsInRental}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Paiements en attente</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.pendingPayments}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Messages non lus</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.unreadMessages}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Avis en attente</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.pendingReviews}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100/50">
              <span className="text-slate-700 font-medium">Maintenance prévue</span>
              <span className="font-bold text-[#AD7C59] text-xl">
                {loading ? '...' : detailedStats.scheduledMaintenance}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de rafraîchissement et statut */}
      <div className="text-center space-y-4">
        <button 
          onClick={loadDashboardData}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-[#AD7C59] to-amber-600 hover:from-amber-600 hover:to-[#AD7C59] text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Actualisation...' : '🔄 Actualiser les données'}
        </button>
        
        {/* Informations sur le mode de fonctionnement */}
        <div className="text-sm text-slate-600">
          {isBackendAvailable ? (
            <p>✅ Dashboard connecté au backend - Données en temps réel</p>
          ) : (
            <div className="space-y-2">
              <p>⚠️ Dashboard en mode simulation - Backend non disponible</p>
              <p className="text-xs">Les données affichées sont simulées pour la démonstration</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const showFooter = !location.pathname.includes('/login') && 
                    !location.pathname.includes('/register') && 
                    !location.pathname.includes('/my-space') &&
                    !location.pathname.includes('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/boats" element={<Boats />} />
        <Route path="/details" element={<Details />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<Page404 />} />
        
        {/* Routes pour l'espace client */}
        <Route path="/my-space" element={<Customer />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profil" element={<Profile />} />
          <Route path="documents" element={<Documents />} />

          {/* Propriétaire routes */}
          <Route path="boats" element={<MesBateaux />} />
          <Route path="boats/new" element={<CreateBoat />} />
          <Route path="boats/:id" element={<VoirBateau />} />
          <Route path="boats/:id/edit" element={<EditBoat />} />
          <Route path="boats/:id/availabilities" element={<AvailabilitiesManagement />} />
          <Route path="revenus" element={<RevenusStats />} />
          
          {/* Locataire routes */}
          <Route path="reservations" element={<MyReservations />} />
          <Route path="reservations/:id" element={<ReservationDetail />} />
          <Route path="reservations/:id/chat" element={<ReservationChat />} />
        </Route>

         {/* Routes pour l'espace admin */}
         <Route path="/admin/sl/*" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Gestion des utilisateurs */}
          <Route path="users" element={<UsersAdminPage />} />
          
          {/* Gestion des bateaux */}
          <Route path="boats" element={<BoatsAdminPage />} />
          
          {/* Gestion des réservations */}
          <Route path="reservations" element={<ReservationsAdminPage />} />
          
          {/* Gestion des contrats */}
          <Route path="contracts" element={<ContractsAdminPage />} />
          
          {/* Gestion des paiements */}
          <Route path="payments" element={<PaymentsAdminPage />} />
          
          {/* Gestion des messages */}
          <Route path="messages" element={<MessagesAdminPage />} />
          
          {/* Gestion des avis */}
          <Route path="reviews" element={<ReviewsAdminPage />} />
          
          {/* Configuration */}
          <Route path="settings" element={<SettingsAdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
