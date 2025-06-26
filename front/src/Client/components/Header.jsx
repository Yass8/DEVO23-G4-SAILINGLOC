import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/images/logo.png";

const Header = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleClick = (href) => {
    setActiveLink(href);
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

        <div className="flex items-center space-x-3">
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
      </div>
    </header>
  );
};

export default Header;
