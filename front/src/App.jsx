import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Home from './Client/pages/Home.jsx';
import About from './Client/pages/About.jsx';
import Category from './Client/pages/Category.jsx';
import Boats from './Client/pages/Boats.jsx';
import Details from './Client/pages/Details.jsx';
import Contact from './Client/pages/Contact.jsx';

function App() {

  return (
   <Router>
      <Routes>
        {/* Clients page */}
        { <Route path="/" element={<Navigate to="/home" replace />} /> }
        <Route path="/home" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/category" element={<Category />} />
        <Route path="/boats" element={<Boats />} />
        <Route path="/details" element={<Details />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>   
      </Router>
  );
}

export default App
