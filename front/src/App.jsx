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
import ForgotPassword from './Client/pages/ForgotPassword.jsx';
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
import AdminLayout from './pages/admin/AdminLayout.jsx';

function AppContent() {
  const location = useLocation();
  const showFooter = !location.pathname.includes('/login') && 
                    !location.pathname.includes('/register') && 
                    !location.pathname.includes('/forgot-password') &&
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
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

        {/* Routes pour l'administration */}
        <Route path="/admin/sl/*" element={<AdminLayout />} />
        
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
