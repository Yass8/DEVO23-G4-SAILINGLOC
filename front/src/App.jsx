import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css'
import Home from './Client/pages/Home.jsx';
import About from './Client/pages/About.jsx';
import Category from './Client/pages/Category.jsx';
import Boats from './Client/pages/Boats.jsx';
import Details from './Client/pages/Details.jsx';
import Contact from './Client/pages/Contact.jsx';
import Login from './Client/pages/Login.jsx';
import Footer from './Client/components/Footer'; 

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
        {/* Routes principales */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/boats" element={<Boats />} />
        <Route path="/details" element={<Details />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Routes d'authentification */}
        <Route path="/login" element={<Login />} />
        
        {/* Page 404 */}
        <Route path="/404" element={<div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#AD7C59] mb-4">Page non trouvée</h1>
            <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas.</p>
            <a href="/home" className="bg-[#AD7C59] text-white px-6 py-3 rounded-lg hover:bg-[#9B6B47] transition-colors">
              Retour à l'accueil
            </a>
          </div>
        </div>} />
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
