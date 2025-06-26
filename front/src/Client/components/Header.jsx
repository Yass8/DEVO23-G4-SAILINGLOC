import React from 'react';
import { Link } from 'react-router-dom';
import logo from "/images/logo.png";
 

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center">
          <img src={logo} alt="SailingLoc" className="h-10 mr-3" />
        </div>

        <nav className="hidden md:flex text-sm font-medium text-gray-700">
          <ul className="flex space-x-6">
            <li><Link to="/home">Accueil</Link></li>
            <li><Link to="/details">Destinations</Link></li>
            <li><Link to="/category">Catégories</Link></li>
            <li><Link to="/boats">Nos Bateaux</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="flex items-center space-x-3">
          <select className="border text-sm px-2 py-1 rounded">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>

          <Link to="/enregistrer" className="border-none px-3 py-1 rounded text-sm text-gray-700 hover:bg-gray-100">
            Enregistrer votre bateau
          </Link>

  <Link
  to="/login"
  style={{ backgroundColor: '#AD7C59' }}
  className="text-white px-3 py-1 rounded text-sm hover:opacity-90"
>
  Se connecter
</Link>


        </div>
      </div>
</header>
  );
};

export default Header;
