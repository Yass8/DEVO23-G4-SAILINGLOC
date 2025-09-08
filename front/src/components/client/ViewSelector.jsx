import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faUser, faCrown } from "@fortawesome/free-solid-svg-icons";
import { isOwner, isTenant, isAdmin } from "../../utils/auth";

export default function ViewSelector({ activeView, setActiveView, showAdminOption = false }) {
  const canShowOwner = isOwner();
  const canShowTenant = isTenant();
  const canShowAdmin = isAdmin() && showAdminOption;

  if (!canShowOwner && !canShowTenant && !canShowAdmin) return null;

  return (
    <div className="flex gap-4 mb-6 p-4 bg-white rounded-lg shadow flex-wrap">
      {canShowOwner && (
        <button
          onClick={() => setActiveView('owner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeView === 'owner'
              ? 'bg-mocha text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={faUserTie} />
          Vue Propriétaire
        </button>
      )}
      
      {canShowTenant && (
        <button
          onClick={() => setActiveView('tenant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeView === 'tenant'
              ? 'bg-mocha text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={faUser} />
          Vue Locataire
        </button>
      )}
      
      {canShowAdmin && (
        <button
          onClick={() => setActiveView('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeView === 'admin'
              ? 'bg-purple-600 text-white border-2 border-purple-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={faCrown} className="text-slate-blue" />
          Accéder à l'admin
        </button>
      )}
    </div>
  );
}