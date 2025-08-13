import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faPlus,
  faShip,
  faCalendar,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faTimes,
  faBan,
  faCheck,
  faFileAlt,
  faShieldAlt,
  faGavel,
  faUserCheck,
  faUserTimes,
  faUserCog,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import {
  ActivationConfirmation,
  SuccessAlert,
  ErrorAlert
} from '../../components/common/SweetAlertComponents';
import userDataService from '../../services/userDataService';

const UsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterActive, setFilterActive] = useState('true');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Charger les utilisateurs depuis le service
  useEffect(() => {
    const loadUsers = () => {
      console.log('🔄 Chargement des utilisateurs depuis le service...');
      const allUsers = userDataService.getAllUsers();
      console.log('📊 Utilisateurs récupérés:', allUsers.length, allUsers);
      setUsers(allUsers);
    };

    // Charger les utilisateurs au montage
    loadUsers();

    // Écouter les changements
    const unsubscribe = userDataService.addListener((updatedUsers) => {
      console.log('🔔 Notification reçue du service, mise à jour de la liste...');
      console.log('📊 Nouveaux utilisateurs:', updatedUsers.length, updatedUsers);
      setUsers(updatedUsers);
    });

    return unsubscribe;
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    const matchesActive = user.active === (filterActive === 'true');
    return matchesSearch && matchesRole && matchesActive;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Gestion de la sélection multiple
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(currentUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };



  const handleEditUser = (user) => {
    setEditingUser({ ...user, roles: [...user.roles] });
    setShowEditModal(true);
  };

  const handleRoleChange = (role, checked) => {
    if (!editingUser) return;
    
    setEditingUser(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  const handleActivateUser = async (user) => {
    try {
      console.log('🔄 Tentative d\'activation de l\'utilisateur:', user.id, user.firstName);
      const confirmed = await ActivationConfirmation('activate', 1, 'utilisateur');
      if (confirmed) {
        console.log('✅ Confirmation reçue, mise à jour du statut...');
        const success = userDataService.updateUserStatus(user.id, true);
        console.log('📊 Mise à jour du statut:', success ? 'réussie' : 'échouée');
        SuccessAlert(
          'Utilisateur activé !',
          'Le compte a été activé avec succès.'
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation:', error);
      ErrorAlert('Erreur !', 'Impossible d\'activer l\'utilisateur.');
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      console.log('🔄 Tentative de désactivation de l\'utilisateur:', user.id, user.firstName);
      const confirmed = await ActivationConfirmation('deactivate', 1, 'utilisateur');
      if (confirmed) {
        console.log('✅ Confirmation reçue, mise à jour du statut...');
        const success = userDataService.updateUserStatus(user.id, false);
        console.log('📊 Mise à jour du statut:', success ? 'réussie' : 'échouée');
        SuccessAlert(
          'Utilisateur désactivé !',
          'Le compte a été désactivé avec succès.'
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de la désactivation:', error);
      ErrorAlert('Erreur !', 'Impossible de désactiver l\'utilisateur.');
    }
  };



  // Actions en lot
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      ErrorAlert('Erreur !', 'Aucun utilisateur sélectionné.');
      return;
    }

    try {
      let confirmed = false;
      let actionText = '';

      switch (action) {
        case 'activate':
          confirmed = await ActivationConfirmation('activate', selectedUsers.length, 'utilisateurs');
          actionText = 'activés';
          break;
        case 'deactivate':
          confirmed = await ActivationConfirmation('deactivate', selectedUsers.length, 'utilisateurs');
          actionText = 'désactivés';
          break;
        default:
          return;
      }

      if (confirmed) {
        selectedUsers.forEach(userId => {
          userDataService.updateUserStatus(userId, action === 'activate');
        });
        setSelectedUsers([]);
        SuccessAlert(
          `Utilisateurs ${actionText} !`,
          `${selectedUsers.length} utilisateur(s) ont été ${actionText} avec succès.`
        );
      }
    } catch (error) {
      ErrorAlert('Erreur !', 'Impossible de traiter l\'action en lot.');
    }
  };



  // Navigation vers les détails
  const handleViewUserDetails = (userId) => {
    navigate(`/admin/sl/users/${userId}`);
  };

  // Composants de badges
  const RoleBadge = ({ roles }) => {
    const roleConfig = {
      Locataire: { color: 'bg-[#4B6A88] text-white', icon: faUsers },
      Propriétaire: { color: 'bg-[#C1D0C4] text-[#4B6A88]', icon: faShip },
      Administrateur: { color: 'bg-[#AD7C59] text-white', icon: faUserCog }
    };
    
    if (!Array.isArray(roles)) {
      roles = [roles]; // Fallback pour la compatibilité
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => {
          const config = roleConfig[role] || roleConfig.Locataire;
          return (
            <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
              {role}
            </span>
          );
        })}
      </div>
    );
  };

  const ActiveBadge = ({ active }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      active 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <FontAwesomeIcon 
        icon={active ? faCheck : faBan} 
        className="w-3 h-3 mr-1" 
      />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );

  // Calcul des statistiques
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active).length,
    inactiveUsers: users.filter(u => !u.active).length,
    locataires: users.filter(u => u.roles.includes('Locataire')).length,
    proprietaires: users.filter(u => u.roles.includes('Propriétaire')).length,
    administrateurs: users.filter(u => u.roles.includes('Administrateur')).length
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#4B6A88]">Gestion des Utilisateurs</h1>
            <p className="text-gray-600 mt-2">Gérez tous les utilisateurs de la plateforme</p>
          </div>
          <button
            onClick={() => {/* TODO: Ajouter un nouvel utilisateur */}}
            className="bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors mt-4 sm:mt-0"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.activeUsers}</div>
            <div className="text-sm text-gray-600">Actifs</div>
          </div>
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.inactiveUsers}</div>
            <div className="text-sm text-gray-600">Inactifs</div>
          </div>
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.locataires}</div>
            <div className="text-sm text-gray-600">Locataires</div>
          </div>
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.proprietaires}</div>
            <div className="text-sm text-gray-600">Propriétaires</div>
          </div>
          <div className="text-center p-4 bg-[#F5F1EB] rounded-lg">
            <div className="text-2xl font-bold text-[#AD7C59]">{stats.administrateurs}</div>
            <div className="text-sm text-gray-600">Administrateurs</div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
              />
            </div>

            {/* Filtre par rôle */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="Locataire">Locataire</option>
              <option value="Propriétaire">Propriétaire</option>
              <option value="Administrateur">Administrateur</option>
            </select>

            {/* Filtre par état actif */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
            >
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
          </div>

          {/* Actions en lot */}
          {selectedUsers.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <FontAwesomeIcon icon={faUserCheck} className="w-4 h-4" />
                <span>Activer ({selectedUsers.length})</span>
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <FontAwesomeIcon icon={faUserTimes} className="w-4 h-4" />
                <span>Désactiver ({selectedUsers.length})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge roles={user.roles} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActiveBadge active={user.active} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewUserDetails(user.id)}
                        className="text-[#4B6A88] hover:text-[#3A5A7A] transition-colors"
                        title="Voir les détails"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-[#C1D0C4] hover:text-[#A8C0B0] transition-colors"
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      {user.active ? (
                        <button
                          onClick={() => handleDeactivateUser(user)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Désactiver"
                        >
                          <FontAwesomeIcon icon={faBan} className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Activer"
                        >
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{indexOfFirstUser + 1}</span> à{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> sur{' '}
                  <span className="font-medium">{filteredUsers.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Précédent</span>
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5 transform rotate-45" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-[#AD7C59] border-[#AD7C59] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Suivant</span>
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5 transform -rotate-45" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Modal de visualisation */}
      {showModal && modalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#4B6A88]">
                Profil de {modalUser.firstName} {modalUser.lastName}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Informations de base */}
              <div className="flex items-start space-x-4">
                <img
                  src={modalUser.avatar}
                  alt={`${modalUser.firstName} ${modalUser.lastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {modalUser.firstName} {modalUser.lastName}
                  </h3>
                  <p className="text-gray-600">ID: {modalUser.id}</p>
                                     <div className="flex items-center space-x-4 mt-2">
                     <RoleBadge roles={modalUser.roles} />
                     <ActiveBadge active={modalUser.active} />
                   </div>
                </div>
              </div>

              {/* Détails de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59] w-4 h-4" />
                    <span className="text-sm text-gray-600">{modalUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faPhone} className="text-[#AD7C59] w-4 h-4" />
                    <span className="text-sm text-gray-600">{modalUser.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#AD7C59] w-4 h-4" />
                    <span className="text-sm text-gray-600">{modalUser.address}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#AD7C59] w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      Créé le {new Date(modalUser.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faClock} className="text-[#AD7C59] w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      Dernière connexion: {new Date(modalUser.lastLogin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-[#F5F1EB] rounded-lg">
                  <div className="text-lg font-bold text-[#AD7C59]">{modalUser.boats}</div>
                  <div className="text-xs text-gray-600">Bateaux</div>
                </div>
                <div className="text-center p-3 bg-[#F5F1EB] rounded-lg">
                  <div className="text-lg font-bold text-[#AD7C59]">{modalUser.reservations}</div>
                  <div className="text-xs text-gray-600">Réservations</div>
                </div>
                {modalUser.totalSpent && (
                  <div className="text-center p-3 bg-[#F5F1EB] rounded-lg">
                    <div className="text-lg font-bold text-[#AD7C59]">{modalUser.totalSpent}€</div>
                    <div className="text-xs text-gray-600">Total dépensé</div>
                  </div>
                )}
                {modalUser.totalEarned && (
                  <div className="text-center p-3 bg-[#F5F1EB] rounded-lg">
                    <div className="text-lg font-bold text-[#AD7C59]">{modalUser.totalEarned}€</div>
                    <div className="text-xs text-gray-600">Total gagné</div>
                  </div>
                )}
              </div>

              {/* Documents */}
              {modalUser.documents && modalUser.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {modalUser.documents.map((doc, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#87CEEB] text-[#4B6A88]"
                      >
                        <FontAwesomeIcon icon={faFileAlt} className="w-3 h-3 mr-1" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleEditUser(modalUser);
                }}
                className="bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#4B6A88]">
                Modifier {editingUser.firstName} {editingUser.lastName}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser.firstName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser.lastName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingUser.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôles
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingUser.roles.includes('Locataire')}
                        onChange={(e) => handleRoleChange('Locataire', e.target.checked)}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Locataire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingUser.roles.includes('Propriétaire')}
                        onChange={(e) => handleRoleChange('Propriétaire', e.target.checked)}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Propriétaire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingUser.roles.includes('Administrateur')}
                        onChange={(e) => handleRoleChange('Administrateur', e.target.checked)}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Administrateur
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        defaultChecked={editingUser.active}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59]"
                      />
                      Actif
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        defaultChecked={!editingUser.active}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59]"
                      />
                      Inactif
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  defaultValue={editingUser.address}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>
            </form>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
                              <button
                  onClick={() => {
                    try {
                      // Mettre à jour l'utilisateur avec les nouveaux rôles
                      userDataService.updateUser(editingUser);
                      setShowEditModal(false);
                      setEditingUser(null);
                      SuccessAlert(
                        'Utilisateur modifié !',
                        'Les informations ont été mises à jour avec succès.'
                      );
                    } catch (error) {
                      ErrorAlert('Erreur !', 'Impossible de sauvegarder les modifications.');
                    }
                  }}
                  className="bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sauvegarder
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin; 