import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShip,
  faCalendarCheck,
  faQuestionCircle,
  faSignOutAlt,
  faChevronDown,
  faTimes,
  faMessage,
  faUser,
  faGear
} from "@fortawesome/free-solid-svg-icons";
import { logout, isOwner, isTenant, isAdmin } from "../../utils/auth";

export default function Sidebar({ sidebarOpen, setSidebarOpen, openDropdown, toggleDropdown }) {
  const location = useLocation();

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Fonction pour vérifier si un dropdown contient un lien actif
  const isDropdownActive = (paths) => {
    return paths.some(path => isActiveLink(path));
  };

  const handleLogout = () => {
    logout();
  };

  // Déterminer quels éléments afficher selon les rôles
  const userIsOwner = isOwner();
  const userIsTenant = isTenant();
  const userIsAdmin = isAdmin();
  
  // Déterminer l'affichage des sections Bateaux et Réservations
  const showBoats = (userIsOwner && !userIsTenant) || 
                    (userIsOwner && userIsTenant) || 
                    (userIsAdmin && userIsOwner);
                    
  const showReservations = (userIsTenant && !userIsOwner) || 
                          (userIsOwner && userIsTenant) || 
                          (userIsAdmin && userIsTenant);

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0 flex flex-col`}
      aria-label="Sidebar"
    >
      <div className="flex-1 px-3 py-2 overflow-y-auto">
        {/* Fermeture mobile */}
        <div className="flex justify-end sm:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 m-2 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-mocha" />
          </button>
        </div>

        <div className="pt-2 pb-2 mb-4 border-b border-gray-200">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="w-32 mx-auto" />
          </Link>
        </div>

        <ul className="space-y-2 font-medium text-sm">
          {/* Dashboard */}
          <li>
            <Link 
              to="/my-space/dashboard" 
              className={`flex items-center p-2 rounded-lg ${
                isActiveLink('/my-space/dashboard') 
                  ? 'bg-mocha text-sand' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </li>

          {/* Messages */}
          <li>
            <Link 
              to="/my-space/messages" 
              className={`flex items-center p-2 rounded-lg ${
                isActiveLink('/my-space/messages') 
                  ? 'bg-mocha text-sand' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faMessage} className="w-5 h-5 mr-2" />
              Messages
            </Link>
          </li>

          {/* Profil */}
          <li>
            <Link 
              to="/my-space/profil" 
              className={`flex items-center p-2 rounded-lg ${
                isActiveLink('/my-space/profil') 
                  ? 'bg-mocha text-sand' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2" />
              Mon Profil
            </Link>
          </li>

          {/* Bateaux (Uniquement si l'utilisateur a le droit de voir cette section) */}
          {showBoats && (
            <li>
              <button
                onClick={() => toggleDropdown("boats")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  isDropdownActive(['/my-space/boats', '/my-space/calendar', '/my-space/tarifs', '/my-space/documents-legaux', '/my-space/revenus'])
                    ? 'bg-mocha text-sand' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={faShip} className="w-5 h-5 mr-2" />
                Bateaux
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 ml-auto transition-transform ${openDropdown === "boats" ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`pl-6 ${openDropdown === "boats" ? "block" : "hidden"} space-y-1`}>
                <li>
                  <Link 
                    to="/my-space/boats" 
                    className={`block py-1 text-sm ${
                      isActiveLink('/my-space/boats') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                    }`}
                  >
                    Mes bateaux
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/my-space/boats/new" 
                    className={`block py-1 text-sm ${
                      isActiveLink('/my-space/boats/new') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                    }`}
                  >
                    Ajouter un bateau
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Réservations (Uniquement si l'utilisateur a le droit de voir cette section) */}
          {showReservations && (
            <li>
              <button
                onClick={() => toggleDropdown("reservations")}
                className={`flex items-center w-full p-2 rounded-lg ${
                  isDropdownActive(['/my-space/reservations', '/my-space/rechercher', '/my-space/documents-location', '/my-space/avis-laisse'])
                    ? 'bg-mocha text-sand' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5 mr-2" />
                Réservations
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-3 h-3 ml-auto transition-transform ${openDropdown === "reservations" ? "rotate-180" : ""}`}
                />
              </button>
              <ul className={`pl-6 ${openDropdown === "reservations" ? "block" : "hidden"} space-y-1`}>
                <li>
                  <Link 
                    to="/my-space/reservations" 
                    className={`block py-1 text-sm ${
                      isActiveLink('/my-space/reservations') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                    }`}
                  >
                    Mes réservations
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/boats" 
                    className={`block py-1 text-sm ${
                      isActiveLink('/my-space/rechercher') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                    }`}
                  >
                    Rechercher un bateau
                  </Link>
                </li>
                {userIsTenant && (
                  <>
                    {/* <li>
                      <Link 
                        to="/my-space/documents-location" 
                        className={`block py-1 text-sm ${
                          isActiveLink('/my-space/documents-location') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                        }`}
                      >
                        Documents de location
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/my-space/dashboard" 
                        className={`block py-1 text-sm ${
                          isActiveLink('/my-space/avis-laisse') ? 'text-mocha font-semibold' : 'text-gray-700 hover:underline'
                        }`}
                      >
                        Avis laissés
                      </Link>
                    </li> */}
                  </>
                )}
              </ul>
            </li>
          )}

          {/* Documents (Pour tous) */}
          <li>
            <Link 
              to="/my-space/documents" 
              className={`flex items-center p-2 rounded-lg ${
                isActiveLink('/my-space/documents') 
                  ? 'bg-mocha text-sand' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5 mr-2" />
              Documents
            </Link>
          </li>

          {/* Paramètres (Pour tous) */}
          <li>
            <Link 
              to="/my-space/parametres" 
              className={`flex items-center p-2 rounded-lg ${
                isActiveLink('/my-space/parametres') 
                  ? 'bg-mocha text-sand' 
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-2" />
              Paramètres
            </Link>
          </li>
        </ul>
      </div>

      {/* Déconnexion en bas */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-2 text-red-600" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}