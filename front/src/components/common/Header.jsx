import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/images/logo.png";

const Header = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  // Met à jour activeLink quand l'url change
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false); // Fermer le menu mobile après clic
  };

  const navLinks = [
    { href: "/home", label: "Accueil" },
    { href: "/details", label: "Destinations" },
    { href: "/category", label: "Catégories" },
    { href: "/boats", label: "Nos Bateaux" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="SailingLoc" className="h-10 mr-3" />
        </div>


        <nav className="hidden md:flex text-sm font-medium text-gray-700">
          <ul className="flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  to={href}
                  onClick={() => handleClick(href)}
                  className={`nav-link ${
                    activeLink === href ? "text-[#AD7C59] font-bold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

   
        <div className="hidden md:flex items-center space-x-3">
          <select className="border text-sm px-2 py-1 rounded">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <Link
            to="/register"
            className="border-none px-3 py-1 rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Enregistrer votre bateau
          </Link>
          <Link
            to="/login"
            className="border border-[#AD7C59] text-[#AD7C59] px-3 py-1 rounded text-sm hover:bg-[#AD7C59] hover:text-white transition"
          >
            Se connecter
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 shadow-lg border-t border-gray-200">
          <ul className="flex flex-col space-y-4 text-base font-medium text-gray-700">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  to={href}
                  onClick={() => handleClick(href)}
                  className={`block py-1 ${
                    activeLink === href ? "text-[#AD7C59] font-bold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-6 flex flex-col space-y-4">
         <select className="border text-base px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#AD7C59] w-20 sm:w-24 md:w-32">
  <option value="fr">FR</option>
  <option value="en">EN</option>
</select>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 text-base hover:underline px-2 py-1 rounded"
            >
              Enregistrer votre bateau
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[#AD7C59] text-base font-semibold hover:underline px-2 py-1 rounded"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;