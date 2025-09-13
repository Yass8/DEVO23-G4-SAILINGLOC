import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faShip, 
  faCalendarCheck, 
  faFileContract, 
  faCreditCard, 
  faAnchor, 
  faEnvelope, 
  faStar, 
  faCog,
  faTachometerAlt,
  faSignOutAlt,
  faPlus,
  faTags,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [boatsExpanded, setBoatsExpanded] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/admin/sl', icon: faTachometerAlt },
    { name: 'Utilisateurs', href: '/admin/sl/users', icon: faUsers },
    { name: 'Réservations', href: '/admin/sl/reservations', icon: faCalendarCheck },
    { name: 'Contrats', href: '/admin/sl/contracts', icon: faFileContract },
    { name: 'Paiements', href: '/admin/sl/payments', icon: faCreditCard },
    { name: 'Ports', href: '/admin/sl/ports', icon: faAnchor },
    { name: 'Messages', href: '/admin/sl/messages', icon: faEnvelope },
    { name: 'Avis', href: '/admin/sl/reviews', icon: faStar },
  ];

  const boatsSubmenu = [
    { name: 'Tous les bateaux', href: '/admin/sl/boats', icon: faShip },
    { name: 'Type de bateau', href: '/admin/sl/boats/types', icon: faTags },
  ];

  const toggleBoatsMenu = () => {
    setBoatsExpanded(!boatsExpanded);
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
            <span className="text-lg font-semibold text-[#AD7C59]">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sm:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center p-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--color-mocha)] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-mocha)]'
                    }`
                  }
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-5 h-5 mr-3"
                  />
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* Menu Bateaux avec sous-sections */}
            <li>
              <button
                onClick={toggleBoatsMenu}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[var(--color-mocha)] transition-all duration-200"
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShip} className="w-5 h-5 mr-3" />
                  Bateaux
                </div>
                <FontAwesomeIcon 
                  icon={boatsExpanded ? faChevronDown : faChevronRight} 
                  className="w-4 h-4 transition-transform duration-200" 
                />
              </button>
              
              {boatsExpanded && (
                <ul className="ml-6 space-y-1">
                  {boatsSubmenu.map((subItem) => (
                    <li key={subItem.name}>
                      <NavLink
                        to={subItem.href}
                        className="flex items-center p-2 text-sm font-medium transition-all duration-200 rounded-md text-gray-600"
                      >
                        <FontAwesomeIcon
                          icon={subItem.icon}
                          className="w-4 h-4 mr-3"
                        />
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <NavLink
            to="/"
            className="flex items-center p-3 text-sm font-medium text-[var(--color-mocha)] hover:bg-[var(--color-mocha)] hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
            Déconnexion
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
