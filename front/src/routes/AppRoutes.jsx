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
import Page404 from '../pages/public/Page404.jsx';

// Espace client
import Customer from "../pages/client/Customer.jsx";
import DashboardClient from "../components/client/DashboardClient.jsx";
import Messages from "../components/client/Message.jsx";

// Common
import Profile from "../pages/common/Profil.jsx";
import Documents from "../pages/common/Documents.jsx";
import Parameters from "../pages/common/Parameters.jsx";

// Propriétaire
import MesBateaux from "../components/client/proprietaire/MesBateaux.jsx";
import ViewBoat from "../components/client/proprietaire/ViewBoat.jsx";
import CreateBoat from "../components/client/proprietaire/CreatBoat.jsx";
import EditBoat from "../pages/client/proprietaire/EditBoat.jsx";
import AvailabilitiesManagement from "../pages/client/proprietaire/AvailabilitiesManagement.jsx";
import RevenusStats from "../pages/client/proprietaire/RevenusStats.jsx";

// Locataire
import MyReservations from "../pages/client/locataire/MyReservations.jsx";
import ReservationDetails from "../pages/client/locataire/ReservationDetails.jsx";
import ReservationChat from "../pages/client/locataire/ReservationChat.jsx";

// Espace administrateur
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import UsersAdmin from "../pages/admin/UsersAdmin.jsx";
import PortsAdmin from "../pages/admin/Ports.jsx";
import ReviewsAdmin from "../pages/admin/Review.jsx";
import PaymentsAdmin from "../pages/admin/PaymentsAdmin.jsx";
import DetailsUsers from "../pages/admin/DetailsUsers.jsx";
import BoatsAdmin from "../pages/admin/BoatsAdmin.jsx";
import ReservationsAdmin from "../pages/admin/Reservations.jsx";
import ContractsAdmin from "../pages/admin/Contracts.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Routes publiques */}
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

            {/* Espace client */}
            <Route path="/my-space" element={<Customer />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardClient />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profil" element={<Profile />} />
                <Route path="documents" element={<Documents />} />
                <Route path="parametres" element={<Parameters />} />
                
                {/* Propriétaire routes */}
                <Route path="boats" element={<MesBateaux />} />
                <Route path="boats/new" element={<CreateBoat />} />
                <Route path="boats/:id" element={<ViewBoat />} />
                <Route path="boats/:id/edit" element={<EditBoat />} />
                <Route path="boats/:id/availabilities" element={<AvailabilitiesManagement />} />
                <Route path="boats/:id/revenus-stats" element={<RevenusStats />} />

                {/* Locataire routes */}
                <Route path="reservations" element={<MyReservations />} />
                <Route path="reservations/:id/details" element={<ReservationDetails />} />
                <Route path="reservations/:id/chat" element={<ReservationChat />} />
            </Route>

            {/* Routes administrateur */}
            <Route path="/admin/sl" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersAdmin />} />
                <Route path="ports" element={<PortsAdmin />} />
                <Route path="reviews" element={<ReviewsAdmin />} />
                <Route path="payments" element={<PaymentsAdmin />} />
                <Route path="users/:id" element={<DetailsUsers />} />
                <Route path="boats" element={<BoatsAdmin />} />
                <Route path="reservations" element={<ReservationsAdmin />} />
                <Route path="contracts" element={<ContractsAdmin />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}