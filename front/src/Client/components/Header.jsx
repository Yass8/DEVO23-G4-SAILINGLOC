import React from 'react';
import { Link } from 'react-router-dom';
import logo from "/images/logo.png";
import banner from "/images/hero.jpeg"; 

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
<div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
  <img
    src={banner}
    alt="Bannière"
    className="w-full h-full object-cover"
  />
  <div className="absolute top-1/2 left-4 sm:left-10 -translate-y-1/2 text-black space-y-2">
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">
      Trouvez le bateau parfait<br />
      pour votre prochaine<br />
      aventure
    </h2>
    <button className="mt-1 bg-[#c58e6a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium">
      Commencez votre aventure
    </button>
  </div>
</div>

</header>
  );
};

export default Header;
