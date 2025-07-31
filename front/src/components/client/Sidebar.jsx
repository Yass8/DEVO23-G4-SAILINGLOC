// pages/client/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShip,
  faCalendarCheck,
  faInbox,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faChevronDown,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ sidebarOpen, setSidebarOpen, openDropdown, toggleDropdown }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-2 overflow-y-auto">
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
          <h2 className="text-xl font-semibold text-gray-800 px-3">SailingLoc</h2>
        </div>

        <ul className="space-y-2 font-medium text-sm">
          {/* Communs */}
          <li>
            <Link to="/my-space" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-2 text-mocha" />
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/my-space/messages" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <FontAwesomeIcon icon={faInbox} className="w-5 h-5 mr-2 text-mocha" />
              Messages
            </Link>
          </li>

          <li>
            <Link to="/my-space/parametres" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <FontAwesomeIcon icon={faCog} className="w-5 h-5 mr-2 text-mocha" />
              Paramètres
            </Link>
          </li>

          <li>
            <Link to="/my-space/aide" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
              <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5 mr-2 text-mocha" />
              Aide & Support
            </Link>
          </li>

          {/* Bateaux (Propriétaires) */}
          <li>
            <button
              onClick={() => toggleDropdown("boats")}
              className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faShip} className="w-5 h-5 mr-2 text-mocha" />
              Bateaux
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3 h-3 ml-auto transition-transform ${openDropdown === "boats" ? "rotate-180" : ""}`}
              />
            </button>
            <ul className={`pl-6 ${openDropdown === "boats" ? "block" : "hidden"} space-y-1`}>
              <li><Link to="/my-space/boats" className="block py-1 text-sm text-gray-700 hover:underline">Mes bateaux</Link></li>
              <li><Link to="/my-space/boats/new" className="block py-1 text-sm text-gray-700 hover:underline">Ajouter un bateau</Link></li>
              <li><Link to="/my-space/calendar" className="block py-1 text-sm text-gray-700 hover:underline">Calendrier</Link></li>
              <li><Link to="/my-space/tarifs" className="block py-1 text-sm text-gray-700 hover:underline">Tarifs & Options</Link></li>
              <li><Link to="/my-space/documents-legaux" className="block py-1 text-sm text-gray-700 hover:underline">Documents légaux</Link></li>
              <li><Link to="/my-space/avis-recus" className="block py-1 text-sm text-gray-700 hover:underline">Avis reçus</Link></li>
              <li><Link to="/my-space/revenus" className="block py-1 text-sm text-gray-700 hover:underline">Revenus & Stats</Link></li>
            </ul>
          </li>

          {/* Réservations (Locataires + Propriétaires) */}
          <li>
            <button
              onClick={() => toggleDropdown("reservations")}
              className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5 mr-2 text-mocha" />
              Réservations
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3 h-3 ml-auto transition-transform ${openDropdown === "reservations" ? "rotate-180" : ""}`}
              />
            </button>
            <ul className={`pl-6 ${openDropdown === "reservations" ? "block" : "hidden"} space-y-1`}>
              <li><Link to="/my-space/reservations" className="block py-1 text-sm text-gray-700 hover:underline">Mes réservations</Link></li>
              <li><Link to="/my-space/rechercher" className="block py-1 text-sm text-gray-700 hover:underline">Rechercher un bateau</Link></li>
              <li><Link to="/my-space/favoris" className="block py-1 text-sm text-gray-700 hover:underline">Favoris</Link></li>
              <li><Link to="/my-space/paiements" className="block py-1 text-sm text-gray-700 hover:underline">Mes paiements</Link></li>
              <li><Link to="/my-space/documents-location" className="block py-1 text-sm text-gray-700 hover:underline">Documents de location</Link></li>
              <li><Link to="/my-space/avis-laisse" className="block py-1 text-sm text-gray-700 hover:underline">Avis laissés</Link></li>
              <li><Link to="/my-space/assurance" className="block py-1 text-sm text-gray-700 hover:underline">Assurance voyage</Link></li>
            </ul>
          </li>

          {/* Déconnexion */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/logout" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-2 text-mocha" />
                  Déconnexion
                </Link>
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </aside>
  );
}