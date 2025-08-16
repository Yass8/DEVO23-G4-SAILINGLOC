import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faSignOutAlt,
  faTrash,
  faUserShield,
  faUserTie,
  faUser,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Parameters = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    newsletter: true,
    darkMode: false,
    language: 'fr',
    emailVisibility: 'private'
  });

  const [userRoles, setUserRoles] = useState(['locataire']); // Rôles initiaux
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  // Simuler la récupération des rôles depuis l'API
  useEffect(() => {
    // Ici vous feriez un appel API pour récupérer les rôles actuels
    setTimeout(() => {
      // Exemple : l'utilisateur est à la fois locataire et propriétaire
      setUserRoles(['locataire', 'propriétaire']);
    }, 500);
  }, []);

  const handleSettingChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    // Ici vous enverriez la mise à jour au serveur
  };

  const handleAddRole = () => {
    if (newRole && !userRoles.includes(newRole)) {
      const updatedRoles = [...userRoles, newRole];
      setUserRoles(updatedRoles);
      setNewRole('');
      setShowRoleModal(false);
      // Ici vous enverriez la mise à jour des rôles au serveur
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    const updatedRoles = userRoles.filter(role => role !== roleToRemove);
    setUserRoles(updatedRoles);
    // Ici vous enverriez la mise à jour des rôles au serveur
  };

  const confirmDeleteAccount = () => {
    console.log('Compte supprimé');
    setShowDeleteModal(false);
  };

  const confirmLogout = () => {
    console.log('Déconnexion');
    setShowLogoutModal(false);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'propriétaire':
        return faUserTie;
      case 'admin':
        return faUserShield;
      default:
        return faUser;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'propriétaire':
        return 'bg-mocha text-white';
      case 'admin':
        return 'bg-slate-blue text-white';
      default:
        return 'bg-sage-green text-white';
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Paramètres du compte</h2>

      <div className="space-y-6">
        {/* Section Rôles */}
        <div className="border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-mocha" />
              Mes Rôles
            </h3>
            <button
              onClick={() => setShowRoleModal(true)}
              className="text-sm bg-mocha text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faPlus} size="xs" />
              Ajouter un rôle
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {userRoles.map(role => (
              <div 
                key={role} 
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getRoleColor(role)}`}
              >
                <FontAwesomeIcon icon={getRoleIcon(role)} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
                {role !== 'locataire' && (
                  <button 
                    onClick={() => handleRemoveRole(role)}
                    className="text-white hover:text-gray-200"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Votre compte peut avoir plusieurs rôles (ex: locataire et propriétaire).
            Certains rôles nécessitent une vérification.
          </p>
        </div>

        {/* Section Notifications */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} className="text-mocha" />
            Notifications
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notifications par email</p>
                <p className="text-sm text-gray-600">Recevoir des notifications importantes par email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mocha"></div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Newsletter</p>
                <p className="text-sm text-gray-600">Recevoir notre newsletter mensuelle</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.newsletter}
                  onChange={(e) => handleSettingChange('newsletter', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mocha"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section Confidentialité */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faUserShield} className="text-mocha" />
            Confidentialité
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Visibilité de l'email</label>
              <select
                value={settings.emailVisibility}
                onChange={(e) => handleSettingChange('emailVisibility', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-mocha focus:border-transparent"
              >
                <option value="private">Privé (seul vous pouvez voir votre email)</option>
                <option value="partners">Visible par les partenaires</option>
                <option value="public">Public (visible par tous)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Actions */}
        <div className="space-y-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-left p-3 rounded border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Déconnexion
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full text-left p-3 rounded border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            Supprimer mon compte
          </button>
        </div>
      </div>

      {/* Modal d'ajout de rôle */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un rôle</h3>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Nouveau rôle</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-mocha focus:border-transparent"
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="propriétaire">Propriétaire</option>
                <option value="locataire">Locataire</option>
                {/* Ajoutez d'autres rôles si nécessaire */}
              </select>
              
              {newRole === 'propriétaire' && (
                <p className="text-sm text-gray-600 mt-2">
                  Le rôle de propriétaire nécessite de vérifier votre identité et d'enregistrer un bateau.
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleAddRole}
                disabled={!newRole}
                className="bg-mocha text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Ajouter le rôle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression de compte */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Supprimer votre compte</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.</p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Déconnexion</h3>
            <p className="mb-4">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parameters;