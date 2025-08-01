import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Client/components/Header";  // adapte le chemin si besoin
import Home from './Client/pages/Home.jsx';
import About from './Client/pages/About.jsx';
import Category from './Client/pages/Category.jsx';
import Boats from './Client/pages/Boats.jsx';
import Details from './Client/pages/Details.jsx';
import Contact from './Client/pages/Contact.jsx';
import Page404 from './Client/pages/Page404.jsx';
// import Footer from './Client/components/Footer'; 
import './App.css';
import Customer from "./pages/client/Customer.jsx";
import MesReservations from "./pages/client/locataire/MesReservations.jsx.jsx";
import Dashboard from "./components/client/Dashboard.jsx";
import Messages from "./components/client/Message.jsx";
import MesBateaux from "./components/client/proprietaire/MesBateaux.jsx";
import VoirBateau from "./components/client/proprietaire/ViewBoat.jsx";
import CreateBoat from "./components/client/proprietaire/CreatBoat.jsx";
import EditBoat from "./pages/client/proprietaire/EditBoat.jsx";
import AvailabilitiesManagement from "./pages/client/proprietaire/AvailabilitiesManagement.jsx";
import RevenusStats from "./pages/client/proprietaire/RevenusStats.jsx";

function App() {
  return (
    <Router>
      {/* <Header /> Ton header sera visible partout */}

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/boats" element={<Boats />} />
        <Route path="/details" element={<Details />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/404" element={<Page404 />} />
        
        <Route path="/my-space" element={<Customer />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="boats" element={<MesBateaux />} />
          <Route path="boats/new" element={<CreateBoat />} />
          <Route path="boats/:id" element={<VoirBateau />} />
          <Route path="boats/:id/edit" element={<EditBoat />} />
          <Route path="reservations" element={<MesReservations />} />
          <Route path="boats/:id/availabilities" element={<AvailabilitiesManagement />} />
          <Route path="revenus" element={<RevenusStats />} />
          {/* <Route path="boats" element={<MesBateaux />} />
          <Route path="profil" element={<MonProfil />} /> */}
          {/* Ajoute ici toutes les autres sous-pages */}
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
