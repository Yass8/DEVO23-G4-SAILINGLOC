import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 sm:left-64">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Bouton menu mobile */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 sm:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="ml-4 flex items-center">
              <img
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="SailingLoc Logo"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">SailingLoc Admin</span>
            </div>
          </div>

          {/* Actions de droite */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mocha">
              <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
              <span className="sr-only">Voir les notifications</span>
            </button>

            {/* Paramètres */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mocha">
              <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
              <span className="sr-only">Paramètres</span>
            </button>

            {/* Profil utilisateur */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mocha">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </button>
            </div>

            {/* Déconnexion */}
            <button className="p-2 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
              <span className="sr-only">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
