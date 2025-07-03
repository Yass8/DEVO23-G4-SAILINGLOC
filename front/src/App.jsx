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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
