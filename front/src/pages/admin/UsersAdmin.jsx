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
  faIdCard,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {
  ActivationConfirmation,
  SuccessAlert,
  ErrorAlert
} from '../../components/common/SweetAlertComponents';
import { 
  fetchUsers, 
  fetchUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  fetchUserBoats,
  fetchUserReservations,
  fetchUserDocuments
} from '../../services/userServices';
import Preloader from '../../components/common/Preloader';

const UsersAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterActive, setFilterActive] = useState('true');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fonction pour transformer les données de l'API vers le format attendu par le composant
  const transformUserData = (apiUser) => {
    return {
      id: apiUser.id.toString(),
      firstName: apiUser.firstname,
      lastName: apiUser.lastname,
      email: apiUser.email,
      phone: apiUser.phone || '',
      avatar: apiUser.photo || `https://ui-avatars.com/api/?name=${apiUser.firstname}+${apiUser.lastname}&background=4B6A88&color=fff`,
      roles: apiUser.roles || [],
      active: apiUser.is_active,
      createdAt: apiUser.created_at,
      lastLogin: apiUser.updated_at,
      address: apiUser.address || '',
      boats: 0,
      reservations: 0,
      totalSpent: 0,
      totalEarned: 0,
      documents: []
    };
  };

  const transformToApiData = (userData) => {
    return {
      firstname: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password || 'MotDePasse123!', 
      phone: userData.phone || null,
      address: userData.address || null,
      roles: Array.isArray(userData.roles) ? userData.roles : [], 
      is_active: userData.active !== false
    };
  };

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        // Vérification de l'authentification
        console.log('�� === VÉRIFICATION AUTHENTIFICATION ===');
        console.log('🔑 Token présent:', !!localStorage.getItem('token'));
        console.log('👤 Utilisateur connecté:', localStorage.getItem('user'));
        console.log('🔗 URL de base:', import.meta.env.VITE_API_URL);
        
        // Vérifier si l'utilisateur est connecté
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ Aucun token trouvé, redirection vers la connexion...');
          ErrorAlert(
            'Authentification requise !', 
            'Vous devez être connecté pour accéder à cette page.'
          );
          navigate('/login');
          return;
        }
        
        // Test de l'API étape par étape
        console.log('📡 Appel de fetchUsers()...');
        const apiUsers = await fetchUsers();
        console.log('✅ Réponse de l\'API:', apiUsers);
        console.log('📊 Nombre d\'utilisateurs:', apiUsers?.length || 0);
        
        if (!Array.isArray(apiUsers)) {
          throw new Error('La réponse de l\'API n\'est pas un tableau');
        }
        
        // Transformer les données
        console.log('�� Transformation des données...');
        const transformedUsers = apiUsers.map(transformUserData);
        console.log('✅ Utilisateurs transformés:', transformedUsers);
        
        // Charger les données supplémentaires pour chaque utilisateur
        console.log('📊 Chargement des statistiques...');
        const usersWithStats = await Promise.all(
          transformedUsers.map(async (user) => {
            try {
              console.log(`🔄 Chargement des stats pour l'utilisateur ${user.id}...`);
              const [boats, reservations, documents] = await Promise.all([
                fetchUserBoats(user.id).catch(err => {
                  console.warn(`⚠️ Erreur boats pour ${user.id}:`, err);
                  return [];
                }),
                fetchUserReservations(user.id).catch(err => {
                  console.warn(`⚠️ Erreur reservations pour ${user.id}:`, err);
                  return [];
                }),
                fetchUserDocuments(user.id).catch(err => {
                  console.warn(`⚠️ Erreur documents pour ${user.id}:`, err);
                  return [];
                })
              ]);

              const userWithStats = {
                ...user,
                boats: boats?.length || 0,
                reservations: reservations?.length || 0,
                documents: documents?.map(doc => doc.document_type) || []
              };
              
              console.log(`✅ Stats chargées pour ${user.id}:`, userWithStats);
              return userWithStats;
            } catch (error) {
              console.warn(`❌ Erreur lors du chargement des stats pour l'utilisateur ${user.id}:`, error);
              return user;
            }
          })
        );

        console.log('✅ === CHARGEMENT TERMINÉ ===');
        console.log('📊 Utilisateurs finaux:', usersWithStats.length);
        setUsers(usersWithStats);
        
      } catch (error) {
        console.error(' === ERREUR DÉTAILLÉE ===');
        console.error(' Type d\'erreur:', error.constructor.name);
        console.error(' Message:', error.message);
        console.error(' Stack:', error.stack);
        console.error(' Erreur complète:', error);
        
        // Gestion spécifique des erreurs d'authentification
        if (error.message.includes('Token invalide') || error.message.includes('401')) {
          console.warn('Token invalide, nettoyage et redirection...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          ErrorAlert(
            'Session expirée !', 
            'Votre session a expiré. Veuillez vous reconnecter.'
          );
          navigate('/login');
          return;
        }
        
        // Afficher une erreur plus détaillée
        ErrorAlert(
          'Erreur de chargement !', 
          `Impossible de charger les utilisateurs.\n\nDétails: ${error.message}\n\nVérifiez la console pour plus d'informations.`
        );
      } finally {
        setLoading(false);
      }
    };

    // Charger les utilisateurs au montage
    loadUsers();
  }, [navigate]);

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

  // Fonction de validation côté client
  const validateCreateForm = (formData) => {
    const errors = {};
    
    if (!formData.firstName || formData.firstName.length < 2) {
      errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      errors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }
  
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Veuillez fournir une adresse email valide';
    }
    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = 'Veuillez sélectionner au moins un rôle';
    }
    
    return errors;
  };

  // CRUD Operations
  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      console.log('�� Création d\'un nouvel utilisateur...');
      console.log('�� Données du formulaire:', userData);
      console.log('�� Rôles sélectionnés:', userData.roles);
      console.log('🔍 Type des rôles:', typeof userData.roles, Array.isArray(userData.roles));
      
      // Validation côté client
      const errors = validateCreateForm(userData);
      if (Object.keys(errors).length > 0) {
        console.error('❌ Erreurs de validation:', errors);
        ErrorAlert('Erreur de validation !', Object.values(errors).join('\n'));
        return;
      }
      
      const apiData = transformToApiData(userData);
      console.log('�� Données envoyées à l\'API:', apiData);
      
      const newUser = await createUser(apiData);
      console.log('✅ Utilisateur créé:', newUser);
      
      // Transformer et ajouter à la liste
      const transformedUser = transformUserData(newUser);
      setUsers(prev => [transformedUser, ...prev]);
      // Fermer le modal et réinitialiser
      setShowCreateModal(false); 
      SuccessAlert('Utilisateur créé !', 'Le nouvel utilisateur a été créé avec succès.');
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
  
      // Gestion des erreurs de validation
      if (error.message && error.message.includes('422')) {
        ErrorAlert('Erreur de validation !', 'Vérifiez que tous les champs obligatoires sont remplis correctement.');
      } else {
        ErrorAlert('Erreur !', `Impossible de créer l'utilisateur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user, roles: [...user.roles] });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      console.log('�� Mise à jour de l\'utilisateur:', userData.id);
      const apiData = transformToApiData(userData);
      console.log('�� Données envoyées à l\'API:', apiData);
      const updatedUser = await updateUser(userData.id, apiData);
      console.log('✅ Utilisateur mis à jour:', updatedUser);
      
      // Transformer et mettre à jour dans la liste
      const transformedUser = transformUserData(updatedUser);
      setUsers(prev => prev.map(u => 
        u.id === userData.id ? transformedUser : u
      ));
      
      SuccessAlert('Utilisateur modifié !', 'Les informations ont été mises à jour avec succès.');
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      ErrorAlert('Erreur !', `Impossible de sauvegarder les modifications: ${error.message}`);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      console.log('🗑️ Suppression de l\'utilisateur:', user.id);
      const confirmed = await ActivationConfirmation('delete', 1, 'utilisateur');
      if (confirmed) {
        await deleteUser(user.id);
        console.log('✅ Utilisateur supprimé');
        
        // Retirer de la liste
        setUsers(prev => prev.filter(u => u.id !== user.id));
        
        SuccessAlert('Utilisateur supprimé !', 'L\'utilisateur a été supprimé avec succès.');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      ErrorAlert('Erreur !', `Impossible de supprimer l'utilisateur: ${error.message}`);
    }
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
        const userData = { is_active: true };
        await updateUser(user.id, userData);
        console.log('📊 Mise à jour du statut: réussie');
        
        // Mettre à jour l'état local
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, active: true } : u
        ));
        
        SuccessAlert(
          'Utilisateur activé !',
          'Le compte a été activé avec succès.'
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation:', error);
      ErrorAlert('Erreur !', `Impossible d'activer l'utilisateur: ${error.message}`);
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      console.log('🔄 Tentative de désactivation de l\'utilisateur:', user.id, user.firstName);
      const confirmed = await ActivationConfirmation('deactivate', 1, 'utilisateur');
      if (confirmed) {
        console.log('✅ Confirmation reçue, mise à jour du statut...');
        const userData = { is_active: false };
        await updateUser(user.id, userData);
        console.log('📊 Mise à jour du statut: réussie');
        
        // Mettre à jour l'état local
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, active: false } : u
        ));
        
        SuccessAlert(
          'Utilisateur désactivé !',
          'Le compte a été désactivé avec succès.'
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de la désactivation:', error);
      ErrorAlert('Erreur !', `Impossible de désactiver l'utilisateur: ${error.message}`);
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
        case 'delete':
          confirmed = await ActivationConfirmation('delete', selectedUsers.length, 'utilisateurs');
          actionText = 'supprimés';
          break;
        default:
          return;
      }

      if (confirmed) {
        // Traiter chaque utilisateur sélectionné
        if (action === 'delete') {
          await Promise.all(
            selectedUsers.map(userId => deleteUser(userId))
          );
          // Retirer de la liste
          setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        } else {
          await Promise.all(
            selectedUsers.map(userId => {
              const userData = { is_active: action === 'activate' };
              return updateUser(userId, userData);
            })
          );
          // Mettre à jour l'état local
          setUsers(prev => prev.map(u => 
            selectedUsers.includes(u.id) ? { ...u, active: action === 'activate' } : u
          ));
        }
        
        setSelectedUsers([]);
        SuccessAlert(
          `Utilisateurs ${actionText} !`,
          `${selectedUsers.length} utilisateur(s) ont été ${actionText} avec succès.`
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'action en lot:', error);
      ErrorAlert('Erreur !', `Impossible de traiter l'action en lot: ${error.message}`);
    }
  };

  // Navigation vers les détails
  // Navigation vers les détails
  const handleViewUserDetails = (userId) => {
    console.log(' Redirection vers les détails de l\'utilisateur:', userId);
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

  // Afficher le preloader pendant le chargement
  if (loading) {
    return <Preloader />;
  }

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
            onClick={() => setShowCreateModal(true)}
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
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                <span>Supprimer ({selectedUsers.length})</span>
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
                      
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
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

      {/* Modal de création d'utilisateur */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#4B6A88]">
                Créer un nouvel utilisateur
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              
              // Récupération simplifiée des rôles
              const roles = [];
              if (formData.get('role_locataire')) roles.push('Locataire');
              if (formData.get('role_proprietaire')) roles.push('Propriétaire');
              if (formData.get('role_administrateur')) roles.push('Administrateur');
              
              // Si aucun rôle, utiliser Locataire par défaut
              if (roles.length === 0) roles.push('Locataire');
              
              const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                roles: roles,
                active: formData.get('status') === 'active'
              };
              
              console.log('�� Données du formulaire:', userData);
              handleCreateUser(userData);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    minLength={2}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                   </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    minLength={2}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                  </div>
               
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôles *
                  </label>
                <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="role_locataire"
                        defaultChecked
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Locataire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="role_proprietaire"
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Propriétaire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="role_administrateur"
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Administrateur
                    </label>
                  </div>
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
                      defaultChecked
                      className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                    Actif
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                    Inactif
                  </label>
                </div>
              </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  name="address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              
              <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                  Annuler
              </button>
              <button
                  type="submit"
                className="bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg transition-colors"
              >
                  Créer
              </button>
            </div>
            </form>
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

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const userData = {
                ...editingUser,
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                roles: Array.from(document.querySelectorAll('input[name="roles"]:checked')).map(cb => cb.value),
                active: formData.get('status') === 'active'
              };
              handleUpdateUser(userData);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
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
                    name="lastName"
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
                    name="email"
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
                    name="phone"
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
                        name="roles"
                        value="Locataire"
                        defaultChecked={editingUser.roles.includes('Locataire')}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Locataire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="roles"
                        value="Propriétaire"
                        defaultChecked={editingUser.roles.includes('Propriétaire')}
                        className="mr-2 text-[#AD7C59] focus:ring-[#AD7C59] rounded"
                      />
                      Propriétaire
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="roles"
                        value="Administrateur"
                        defaultChecked={editingUser.roles.includes('Administrateur')}
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
                  name="address"
                  rows={3}
                  defaultValue={editingUser.address}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                  type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
                 <button
                  type="submit"
                  className="bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sauvegarder
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin; 