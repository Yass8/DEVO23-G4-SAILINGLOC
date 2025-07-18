import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/images/logo.png";

const Header = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false); // Fermer le menu après clic
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

        {/* Menu desktop */}
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

        {/* Actions desktop */}
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
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-4 shadow">
          <ul className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  to={href}
                  onClick={() => handleClick(href)}
                  className={`block ${
                    activeLink === href ? "text-[#AD7C59] font-bold" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex flex-col space-y-2">
            <select className="border text-sm px-2 py-1 rounded">
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 text-sm hover:underline"
            >
              Enregistrer votre bateau
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-[#AD7C59] text-sm font-medium hover:underline"
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
