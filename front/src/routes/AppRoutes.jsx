import { Routes, Route, Navigate } from "react-router-dom";

// Pages publiques
import Home from '../pages/public/Home.jsx';
import About from '../pages/public/About.jsx';
import Category from '../pages/public/Category.jsx';
import Boats from '../pages/public/Boats.jsx';
import Details from '../pages/public/Details.jsx';
import Contact from '../pages/public/Contact.jsx';
import Login from '../pages/public/Login.jsx';
import Register from '../pages/public/Register.jsx';
import ForgotPasswordEmail from "../pages/public/ForgotPassword.jsx";
import ResetPassword from "../pages/public/ResetPassword.jsx";
import Page404 from '../pages/public/Page404.jsx';
import Destinations from "../pages/public/Destinations.jsx";
import CGU from '../pages/public/cgu.jsx';
import MentionsLegales from '../pages/public/Mentions-legales.jsx';
import PolitiqueCookies from '../pages/public/politique-cookies.jsx';
import PolitiqueConfidentialite from '../pages/public/politique-confidentialite.jsx';
import PlanDuSite from '../pages/public/plan-site.jsx';
// Espace client
import Customer from "../pages/client/Customer.jsx";
import DashboardClient from "../components/client/DashboardClient.jsx";
import Messages from "../components/client/Message.jsx";

// Common
import Profile from "../pages/common/Profil.jsx";
import Documents from "../pages/common/Documents.jsx";
import Booking from "../pages/public/Booking.jsx";
import Parameters from "../pages/common/Parameters.jsx";

// Propriétaire
import MesBateaux from "../components/client/proprietaire/MesBateaux.jsx";
import ViewBoat from "../components/client/proprietaire/ViewBoat.jsx";
import CreateBoat from "../components/client/proprietaire/CreatBoat.jsx";
import EditBoat from "../pages/client/proprietaire/EditBoat.jsx";
import AvailabilitiesManagement from "../pages/client/proprietaire/AvailabilitiesManagement.jsx";
import TenantReservationDetail from "../components/client/locataire/TenantReservationDetail.jsx";
import RevenusStats from "../pages/client/proprietaire/RevenusStats.jsx";

// Locataire
import MyReservations from "../pages/client/locataire/MyReservations.jsx";
import ReservationDetails from "../pages/client/locataire/ReservationDetails.jsx";
import ReservationOwnerDetail from "../pages/client/proprietaire/ReservationOwnerDetail.jsx";
import ReservationChat from "../pages/client/locataire/ReservationChat.jsx";

// Espace administrateur
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import UsersAdmin from "../pages/admin/UsersAdmin.jsx";
import PortsAdmin from "../pages/admin/Ports.jsx";
import ReviewsAdmin from "../pages/admin/ReviewsAdmin.jsx";
import PaymentsAdmin from "../pages/admin/PaymentsAdmin.jsx";
import MessagesAdmin from "../pages/admin/MessagesAdmin.jsx";
import DetailsUsers from "../pages/admin/DetailsUsers.jsx";
import BoatsAdmin from "../pages/admin/BoatsAdmin.jsx";
import AddBoatAdmin from "../pages/admin/AddBoatAdmin.jsx";
import EditBoatAdmin from "../pages/admin/EditBoatAdmin.jsx";
import BoatTypesAdmin from "../pages/admin/BoatTypesAdmin.jsx";
import ReservationsAdmin from "../pages/admin/Reservations.jsx";
import ContractsAdmin from "../pages/admin/Contracts.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import LoginAdmin from "../pages/admin/LoginAdmin.jsx";
import PublicOnly from "../guards/PublicOnly.jsx";
import AdminLoginGate from "../guards/AdminLoginGate.jsx";
import RoleGuard from "../guards/RoleGuard.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/destination" element={<Destinations />} />
            <Route path="/category" element={<Category />} />
            <Route path="/boats" element={<Boats />} />
            <Route path="/boat/:slug" element={<Details />} />
            <Route path="/booking/:slug" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
            <Route path="/forgot-password-email" element={<PublicOnly><ForgotPasswordEmail /></PublicOnly>} />
            <Route path="/reset-password/:token" element={<PublicOnly><ResetPassword /></PublicOnly>} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-cookies" element={<PolitiqueCookies />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/plan-site" element={<PlanDuSite />} />      
            <Route path="/404" element={<Page404 />} />
            {/* Espace client */}
            <Route path="/my-space" element={<Customer />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardClient />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profil" element={<Profile />} />
                <Route path="documents" element={<Documents />} />
                <Route path="parametres" element={<Parameters />} />
                
                {/* Propriétaire routes */}
                <Route path="boats" element={<RoleGuard allowedRoles={['owner']}><MesBateaux /></RoleGuard>} />
                <Route path="boats/new" element={<RoleGuard allowedRoles={['owner']}><CreateBoat /></RoleGuard>} />
                <Route path="boats/:slug" element={<RoleGuard allowedRoles={['owner']}><ViewBoat /></RoleGuard>} />
                <Route path="boats/:slug/edit" element={<RoleGuard allowedRoles={['owner']}><EditBoat /></RoleGuard>} />
                <Route path="boats/:slug/availabilities" element={<RoleGuard allowedRoles={['owner']}><AvailabilitiesManagement /></RoleGuard>} />
                <Route path="boats/:slug/revenus-stats" element={<RoleGuard allowedRoles={['owner']}><RevenusStats /></RoleGuard>} />
                <Route path="reservations/:reference" element={<RoleGuard allowedRoles={['owner']}><ReservationOwnerDetail /></RoleGuard>} />
                
                {/* Locataire routes */}
                <Route path="reservations" element={<RoleGuard allowedRoles={['tenant']}><MyReservations /></RoleGuard>} />
                <Route path="reservations/:id/detail" element={<RoleGuard allowedRoles={['tenant']}><ReservationDetails /></RoleGuard>} />
                <Route path="reservations/:id/chat" element={<RoleGuard allowedRoles={['tenant']}><ReservationChat /></RoleGuard>} />
                <Route path="reservations/:reference/details" element={<RoleGuard allowedRoles={['tenant']}><TenantReservationDetail /></RoleGuard>} />

            </Route>
            <Route path="/admin/sl/login" element={<AdminLoginGate><LoginAdmin/></AdminLoginGate>} />

            {/* Routes administrateur */}
            <Route path="/admin/sl" element={<RoleGuard allowedRoles={['admin']} redirectTo="/admin/sl/login"><AdminLayout /></RoleGuard>}>
                <Route index element={<Navigate to="/admin/sl/login" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="ports" element={<PortsAdmin />} />
                <Route path="reviews" element={<ReviewsAdmin />} />
    
                <Route path="payments" element={<PaymentsAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                <Route path="users/:id" element={<DetailsUsers />} />
                <Route path="boats" element={<BoatsAdmin />} />
                <Route path="boats/add" element={<AddBoatAdmin />} />
                <Route path="boats/:id/edit" element={<EditBoatAdmin />} />
                <Route path="boats/types" element={<BoatTypesAdmin />} />
                <Route path="reservations" element={<ReservationsAdmin />} />
                <Route path="contracts" element={<ContractsAdmin />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}