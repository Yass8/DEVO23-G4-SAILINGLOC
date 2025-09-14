
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { getInitials } from "../../utils/initials";
import { getCurrentUser, isTokenValid } from "../../services/authService";
import { logout } from "../../utils/auth";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm sm:left-64">
      <div className="flex items-center justify-between">
        {/* Burger */}
        <div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="w-5 h-5" />
          </button>
        </div>

        {/* Droite */}
        <div className="flex items-center space-x-4">

          {/* Profil */}
          {(user && isTokenValid()) ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-blue flex items-center justify-center text-white font-medium">
                  {getInitials(user.firstname || "", user.lastname || "")}
                </div>
                <span className="hidden md:inline-block text-sm font-medium">
                  {user.firstname} {user.lastname}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li><a href="/my-space/profil" className="block px-4 py-2 hover:bg-gray-100">Mon Profil</a></li>
                    {/* <li><a href="/my-space/documents" className="block px-4 py-2 hover:bg-gray-100">Mes Documents</a></li> */}
                    {/* <li><a href="/my-space/parametres" className="block px-4 py-2 hover:bg-gray-100">Paramètres</a></li> */}
                    <li><a onClick={logout} className="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Déconnexion</a></li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="text-sm font-medium text-slate-blue hover:underline">
              Se connecter
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}