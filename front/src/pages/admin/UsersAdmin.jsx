import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faSearch, faTrash, faEdit, faTimes, faKey, faEye, faPause, faEnvelope, faFileExport, 
  faDownload, faFilter, faSort, faCheck, faBan, faShieldAlt,
  faPhone, faIdCard, faCalendarAlt, faClock, faExclamationTriangle,
  faUserLock, faUserCog,
  faChartBar, faUsers,
  faBell, faLock, faUnlock, faEyeSlash, faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les utilisateurs (simulé)
const fetchUsers = async () => {
  // Données simulées
  return [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01', phone: '+33 6 12 34 56 78', lastLogin: '2024-01-15' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'locataire', status: 'active', createdAt: '2024-01-02', phone: '+33 6 23 45 67 89', lastLogin: '2024-01-14' },
    { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', role: 'proprietaire', status: 'inactive', createdAt: '2024-01-03', phone: '+33 6 34 56 78 90', lastLogin: '2024-01-10' },
    { id: 4, name: 'Sophie Bernard', email: 'sophie@example.com', role: 'locataire', status: 'active', createdAt: '2024-01-04', phone: '+33 6 45 67 89 01', lastLogin: '2024-01-15' },
    { id: 5, name: 'Lucas Moreau', email: 'lucas@example.com', role: 'proprietaire', status: 'active', createdAt: '2024-01-05', phone: '+33 6 56 78 90 12', lastLogin: '2024-01-13' }
  ];
};

const updateUser = async (id, data) => {
  console.log('Mise à jour de l\'utilisateur:', id, data);
  return { success: true, message: 'Utilisateur mis à jour avec succès' };
};

const deleteUser = async (id) => {
  console.log('Suppression de l\'utilisateur:', id);
  return true;
};

const exportUsersToCSV = (users) => {
  const csv = [
    ['ID', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Date d\'inscription', 'Dernière connexion'],
    ...users.map(u => [
      u.id,
      u.name,
      u.email,
      u.phone || 'N/A',
      u.role,
      u.status,
      new Date(u.createdAt).toLocaleDateString('fr-FR'),
      u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('fr-FR') : 'N/A'
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'utilisateurs.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    role: 'locataire',
    status: 'active',
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [suspendUserModal, setSuspendUserModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [messageUserModal, setMessageUserModal] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [resetPasswordModal, setResetPasswordModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      notes: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    
    setEditLoading(true);
    try {
      await updateUser(editUser.id, editForm);
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
      setEditUser(null);
      setEditForm({ name: '', email: '', phone: '', role: 'locataire', status: 'active', notes: '' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleSuspend = async (userId) => {
    if (!suspendReason.trim()) return;
    
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      // TODO: Appel API pour suspendre l'utilisateur
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u));
      setSuspendUserModal(null);
      setSuspendReason('');
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleResetPassword = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      // TODO: Appel API pour réinitialiser le mot de passe
      alert('Un email de réinitialisation a été envoyé à l\'utilisateur');
      setResetPasswordModal(null);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' ? 
        new Date(b.createdAt) - new Date(a.createdAt) : 
        new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' ? 
        b.name.localeCompare(a.name) : 
        a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'proprietaire': return 'bg-blue-100 text-blue-800';
      case 'locataire': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#AD7C59] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-[#AD7C59] flex items-center gap-3">
              <FontAwesomeIcon icon={faUsers} className="text-[#AD7C59]" />
              Gestion des Utilisateurs
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => exportUsersToCSV(users)}
                className="flex items-center gap-2 px-4 py-2 bg-[#AD7C59] text-white rounded-lg hover:bg-[#8B5A3C] transition-colors"
              >
                <FontAwesomeIcon icon={faDownload} />
                Exporter CSV
              </button>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total utilisateurs</p>
                  <p className="text-2xl font-bold text-blue-800">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Actifs</p>
                  <p className="text-2xl font-bold text-green-800">{users.filter(u => u.status === 'active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-2xl text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">Locataires</p>
                  <p className="text-2xl font-bold text-orange-800">{users.filter(u => u.role === 'locataire').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Propriétaires</p>
                  <p className="text-2xl font-bold text-purple-800">{users.filter(u => u.role === 'proprietaire').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="proprietaire">Propriétaire</option>
                <option value="locataire">Locataire</option>
              </select>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="border-t pt-4">
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                >
                  <option value="date">Trier par date</option>
                  <option value="name">Trier par nom</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSort} />
                  {sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#AD7C59] flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailUser(user)}
                          className="text-[#AD7C59] hover:text-[#8B5A3C] transition-colors"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => setResetPasswordModal(user.id)}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Réinitialiser le mot de passe"
                        >
                          <FontAwesomeIcon icon={faKey} />
                        </button>
                        <button
                          onClick={() => setSuspendUserModal(user.id)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Suspendre"
                        >
                          <FontAwesomeIcon icon={faPause} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading[user.id]}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {actionLoading[user.id] ? (
                            <FontAwesomeIcon icon={faTimes} className="animate-spin" />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
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

      {/* Modal d'édition */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Modifier l'utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                >
                  <option value="locataire">Locataire</option>
                  <option value="proprietaire">Propriétaire</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 bg-[#AD7C59] text-white py-2 px-4 rounded-lg hover:bg-[#8B5A3C] transition-colors disabled:opacity-50"
              >
                {editLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suspension */}
      {suspendUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Suspendre l'utilisateur</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Raison de la suspension</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD7C59] focus:border-transparent"
                rows="3"
                placeholder="Entrez la raison de la suspension..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSuspend(suspendUserModal)}
                disabled={!suspendReason.trim() || actionLoading[suspendUserModal]}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading[suspendUserModal] ? 'Suspension...' : 'Suspendre'}
              </button>
              <button
                onClick={() => setSuspendUserModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de réinitialisation de mot de passe */}
      {resetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Réinitialiser le mot de passe</h3>
            <p className="text-gray-600 mb-4">
              Un email de réinitialisation sera envoyé à l'utilisateur. Êtes-vous sûr de vouloir continuer ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleResetPassword(resetPasswordModal)}
                disabled={actionLoading[resetPasswordModal]}
                className="flex-1 bg-[#AD7C59] text-white py-2 px-4 rounded-lg hover:bg-[#8B5A3C] transition-colors disabled:opacity-50"
              >
                {actionLoading[resetPasswordModal] ? 'Envoi...' : 'Confirmer'}
              </button>
              <button
                onClick={() => setResetPasswordModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin; 