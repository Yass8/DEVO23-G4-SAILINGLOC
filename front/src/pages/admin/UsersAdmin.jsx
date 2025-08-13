import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSpinner,
  faDownload,
  faPlus,
  faUser,
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

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Données simulées
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '+33 6 98 76 54 32',
        role: 'client',
        status: 'active',
        verified: true,
        createdAt: '2024-01-15',
        lastLogin: '2024-02-10',
        avatar: '/images/profil/1.jpg',
        address: '123 Rue de la Paix, 75001 Paris',
        boats: 2,
        reservations: 5,
        totalSpent: 1200,
        documents: ['cni.pdf', 'permis_bateau.pdf']
      },
      {
        id: 2,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        role: 'owner',
        status: 'active',
        verified: true,
        createdAt: '2024-01-10',
        lastLogin: '2024-02-12',
        avatar: '/images/profil/2.jpg',
        address: '456 Avenue des Champs, 75008 Paris',
        boats: 3,
        reservations: 0,
        totalEarned: 2500,
        documents: ['cni.pdf', 'certificat_proprietaire.pdf']
      },
      {
        id: 3,
        firstName: 'Pierre',
        lastName: 'Bernard',
        email: 'pierre.bernard@email.com',
        phone: '+33 6 11 22 33 44',
        role: 'client',
        status: 'pending',
        verified: false,
        createdAt: '2024-02-01',
        lastLogin: '2024-02-01',
        avatar: '/images/profil/3.jpg',
        address: '789 Boulevard Saint-Germain, 75006 Paris',
        boats: 0,
        reservations: 1,
        totalSpent: 300,
        documents: ['cni.pdf']
      },
      {
        id: 4,
        firstName: 'Sophie',
        lastName: 'Petit',
        email: 'sophie.petit@email.com',
        phone: '+33 6 55 66 77 88',
        role: 'owner',
        status: 'active',
        verified: true,
        createdAt: '2024-01-20',
        lastLogin: '2024-02-11',
        avatar: '/images/profil/4.jpg',
        address: '321 Rue de Rivoli, 75001 Paris',
        boats: 1,
        reservations: 0,
        totalEarned: 800,
        documents: ['cni.pdf', 'assurance.pdf']
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesVerified = filterVerified === 'all' || user.verified === (filterVerified === 'true');
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerified;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Gestion de la sélection multiple
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(currentUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // Actions sur les utilisateurs
  const handleViewUser = (user) => {
    setModalUser(user);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
  };

  const handleVerifyUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, verified: true }
        : user
    ));
  };

  const handleActivateUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' }
        : user
    ));
  };

  const handleSuspendUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'suspended' }
        : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== userId));
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case 'verify':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, verified: true }
            : user
        ));
        break;
      case 'activate':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'active' }
            : user
        ));
        break;
      case 'suspend':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: 'suspended' }
            : user
        ));
        break;
      case 'delete':
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
          setSelectedUsers([]);
        }
        break;
      default:
        break;
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Nom', 'Email', 'Rôle', 'Statut', 'Vérifié', 'Date création', 'Dernière connexion'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.status,
        user.verified ? 'Oui' : 'Non',
        user.createdAt,
        user.lastLogin
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Composant pour le rôle
  const RoleBadge = ({ role }) => {
    const roleConfig = {
      client: { color: 'bg-blue-100 text-blue-800', icon: faUser, label: 'Client' },
      owner: { color: 'bg-green-100 text-green-800', icon: faShip, label: 'Propriétaire' },
      admin: { color: 'bg-purple-100 text-purple-800', icon: faUserCog, label: 'Administrateur' }
    };

    const config = roleConfig[role] || roleConfig.client;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Composant pour le statut
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: faCheckCircle, label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faClock, label: 'En attente' },
      suspended: { color: 'bg-red-100 text-red-800', icon: faBan, label: 'Suspendu' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: faTimesCircle, label: 'Inactif' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-[#AD7C59]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez tous les utilisateurs, validez les comptes et suivez l'activité
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AD7C59] hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
            />
          </div>

          {/* Filtre par rôle */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="owner">Propriétaires</option>
            <option value="admin">Administrateurs</option>
          </select>

          {/* Filtre par statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
            <option value="inactive">Inactifs</option>
          </select>

          {/* Filtre par vérification */}
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous</option>
            <option value="true">Vérifiés</option>
            <option value="false">Non vérifiés</option>
          </select>

          {/* Actions en lot */}
          {selectedUsers.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-2 text-sm text-green-600 hover:text-green-800"
              >
                Vérifier
              </button>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Activer
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Suspendre
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faUsers} className="w-8 h-8 text-[#AD7C59]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total utilisateurs</dt>
                <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faUserCheck} className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Vérifiés</dt>
                <dd className="text-lg font-medium text-gray-900">{users.filter(u => u.verified).length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faShip} className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Propriétaires</dt>
                <dd className="text-lg font-medium text-gray-900">{users.filter(u => u.role === 'owner').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faUser} className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Clients</dt>
                <dd className="text-lg font-medium text-gray-900">{users.filter(u => u.role === 'client').length}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
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
                    Rôle & Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité & Statistiques
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
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-full object-cover" 
                            src={user.avatar} 
                            alt={`${user.firstName} ${user.lastName}`}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48x48/AD7C59/FFFFFF?text=' + user.firstName.charAt(0);
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                          <div className="text-xs text-gray-400">
                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" />
                            Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-1 text-blue-500" />
                            {user.email}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <FontAwesomeIcon icon={faPhone} className="w-3 h-3 mr-1 text-green-500" />
                            {user.phone}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 mr-1" />
                            {user.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <RoleBadge role={user.role} />
                        <StatusBadge status={user.status} />
                        {user.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                            Vérifié
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 mr-1" />
                            Non vérifié
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4 mb-1">
                          <div>
                            <FontAwesomeIcon icon={faShip} className="w-3 h-3 mr-1 text-blue-500" />
                            {user.boats} bateau(x)
                          </div>
                          <div>
                            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1 text-green-500" />
                            {user.reservations} réservation(s)
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3 mr-1" />
                          Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                        </div>
                        {user.role === 'client' && (
                          <div className="text-xs text-gray-500">
                            Total dépensé: {user.totalSpent} €
                          </div>
                        )}
                        {user.role === 'owner' && (
                          <div className="text-xs text-gray-500">
                            Total gagné: {user.totalEarned} €
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-[#AD7C59] hover:text-[#9B6B47]"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        {!user.verified && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Vérifier"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {user.status === 'pending' && (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Activer"
                          >
                            <FontAwesomeIcon icon={faUserCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faBan} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Supprimer"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} résultats
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de détails utilisateur */}
      {showModal && modalUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails de l'utilisateur {modalUser.firstName} {modalUser.lastName}</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations personnelles</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                      <p className="text-sm text-gray-900">{modalUser.firstName} {modalUser.lastName}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{modalUser.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-sm text-gray-900">{modalUser.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <p className="text-sm text-gray-900">{modalUser.address}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 mt-6">Statut du compte</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rôle</label>
                      <RoleBadge role={modalUser.role} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <StatusBadge status={modalUser.status} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vérifié</label>
                      {modalUser.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
                          Oui
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 mr-1" />
                          Non
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Activité et statistiques</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                      <p className="text-sm text-gray-900">{new Date(modalUser.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dernière connexion</label>
                      <p className="text-sm text-gray-900">{new Date(modalUser.lastLogin).toLocaleDateString('fr-FR')}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bateaux</label>
                      <p className="text-sm text-gray-900">{modalUser.boats}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Réservations</label>
                      <p className="text-sm text-gray-900">{modalUser.reservations}</p>
                    </div>
                    
                    {modalUser.role === 'client' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total dépensé</label>
                        <p className="text-sm text-gray-900 font-semibold text-[#AD7C59]">{modalUser.totalSpent} €</p>
                      </div>
                    )}
                    
                    {modalUser.role === 'owner' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total gagné</label>
                        <p className="text-sm text-gray-900 font-semibold text-[#AD7C59]">{modalUser.totalEarned} €</p>
                      </div>
                    )}
                  </div>
                  
                  {modalUser.documents && modalUser.documents.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                      <div className="space-y-2">
                        {modalUser.documents.map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-blue-500" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleEditUser(modalUser);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition d'utilisateur */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Modifier l'utilisateur {editingUser.firstName} {editingUser.lastName}</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        firstName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        lastName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      email: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      phone: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        role: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    >
                      <option value="client">Client</option>
                      <option value="owner">Propriétaire</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({
                        ...editingUser,
                        status: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="suspended">Suspendu</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Mettre à jour l'utilisateur
                      setUsers(users.map(user => 
                        user.id === editingUser.id 
                          ? editingUser
                          : user
                      ));
                      setShowEditModal(false);
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin; 