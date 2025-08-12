import { useEffect, useState } from "react";
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
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'user', status: 'active', createdAt: '2024-01-02' },
    { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-03' }
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

export default function UsersAdminPage() {
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
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteUser(id);
    await loadUsers();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'locataire',
      status: user.status || 'active',
      notes: user.notes || ''
    });
  };

  const closeEditModal = () => {
    setEditUser(null);
    setEditForm({ 
      name: '', 
      email: '', 
      phone: '', 
      role: 'locataire',
      status: 'active',
      notes: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateUser(editUser.id, editForm);
    await loadUsers();
    closeEditModal();
  };

  const handleDetail = (user) => setDetailUser(user);
  const closeDetail = () => setDetailUser(null);

  const handleSuspend = (user) => {
    setSuspendUserModal(user);
    setSuspendReason('');
  };

  const closeSuspendModal = () => {
    setSuspendUserModal(null);
    setSuspendReason('');
  };

  const submitSuspend = async (e) => {
    e.preventDefault();
    if (!suspendReason.trim()) {
      alert('Veuillez indiquer une raison de suspension');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [suspendUserModal.id]: true }));
    await updateUser(suspendUserModal.id, { 
      status: 'suspended',
      suspensionReason: suspendReason,
      suspendedAt: new Date().toISOString()
    });
    await loadUsers();
    closeSuspendModal();
    setActionLoading((prev) => ({ ...prev, [suspendUserModal.id]: false }));
  };

  const handleActivate = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await updateUser(id, { 
      status: 'active',
      suspensionReason: null,
      suspendedAt: null
    });
    await loadUsers();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleMessage = (user) => {
    setMessageUserModal(user);
    setMessageText('');
  };

  const closeMessageModal = () => {
    setMessageUserModal(null);
    setMessageText('');
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      alert('Veuillez saisir un message');
      return;
    }
    // Ici vous pouvez implémenter l'envoi de notification
    alert(`Message envoyé à ${messageUserModal.name}: ${messageText}`);
    closeMessageModal();
  };

  const handleResetPassword = (user) => {
    setResetPasswordModal(user);
  };

  const closeResetPasswordModal = () => {
    setResetPasswordModal(null);
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    // Ici vous pouvez implémenter la réinitialisation de mot de passe
    alert(`Mot de passe réinitialisé pour ${resetPasswordModal.name}`);
    closeResetPasswordModal();
  };

  // Filtrage et tri
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch = user.name?.toLowerCase().includes(search.toLowerCase()) ||
                           user.email?.toLowerCase().includes(search.toLowerCase()) ||
                           user.phone?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'name':
          aValue = a.name?.toLowerCase();
          bValue = b.name?.toLowerCase();
          break;
        case 'email':
          aValue = a.email?.toLowerCase();
          bValue = b.email?.toLowerCase();
          break;
        case 'lastLogin':
          aValue = new Date(a.lastLogin || 0);
          bValue = new Date(b.lastLogin || 0);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { text: 'Actif', class: 'bg-green-100 text-green-800 border-green-200' },
      'inactive': { text: 'Inactif', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'suspended': { text: 'Suspendu', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'banned': { text: 'Banni', class: 'bg-red-100 text-red-800 border-red-200' },
      'pending': { text: 'En attente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'locked': { text: 'Verrouillé', class: 'bg-purple-100 text-purple-800 border-purple-200' }
    };
    const config = statusConfig[status] || statusConfig['active'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { text: 'Administrateur', class: 'bg-red-100 text-red-800 border-red-200' },
      'proprietaire': { text: 'Propriétaire', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'locataire': { text: 'Locataire', class: 'bg-green-100 text-green-800 border-green-200' }
    };
    const config = roleConfig[role] || roleConfig['locataire'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getVerificationBadges = (user) => {
    return (
      <div className="flex flex-wrap gap-1">
        {user.emailVerified && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Email
          </span>
        )}
        {user.phoneVerified && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Téléphone
          </span>
        )}
        {user.documentsVerified && (
          <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Documents
          </span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const pending = users.filter(u => u.status === 'pending').length;
    
    return { total, active, suspended, pending };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="text-[#AD7C59]" /> Gestion des Utilisateurs
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportUsersToCSV(filteredAndSortedUsers)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
          >
            <FontAwesomeIcon icon={faDownload} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total utilisateurs</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Utilisateurs actifs</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faPause} className="text-2xl text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Suspendus</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.suspended}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">En attente</p>
              <p className="text-2xl font-bold text-purple-800">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={handleSearch}
            className="w-full border border-[#AD7C59] rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
            style={{ color: '#AD7C59' }}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-[#AD7C59]" />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="suspended">Suspendus</option>
          <option value="banned">Bannis</option>
          <option value="pending">En attente</option>
          <option value="locked">Verrouillés</option>
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous les rôles</option>
          <option value="locataire">Locataires</option>
          <option value="proprietaire">Propriétaires</option>
          <option value="admin">Administrateurs</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="name">Trier par nom</option>
          <option value="email">Trier par email</option>
          <option value="lastLogin">Dernière connexion</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
        >
          <FontAwesomeIcon icon={faSort} />
          {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">Utilisateur</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Rôle</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Vérifications</th>
              <th className="py-2 px-4">Dernière connexion</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#AD7C59]">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59] text-lg" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                        <div className="text-xs text-gray-400">Inscrit le {formatDate(user.createdAt)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59] text-sm" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faPhone} className="text-[#AD7C59] text-sm" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-2 px-4">
                    {getVerificationBadges(user)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faClock} className="text-[#AD7C59]" />
                          <span>{formatDate(user.lastLogin)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Jamais connecté</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(user)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(user)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {user.status === 'active' && (
                        <button
                          className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                          onClick={() => handleSuspend(user)}
                          title="Suspendre"
                        >
                          <FontAwesomeIcon icon={faPause} />
                        </button>
                      )}

                      {user.status === 'suspended' && (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleActivate(user.id)}
                          disabled={actionLoading[user.id]}
                          title="Activer"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                        onClick={() => handleMessage(user)}
                        title="Envoyer un message"
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition text-xs"
                        onClick={() => handleResetPassword(user)}
                        title="Réinitialiser le mot de passe"
                      >
                        <FontAwesomeIcon icon={faKey} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(user.id)}
                        disabled={actionLoading[user.id]}
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-[#AD7C59] hover:text-[#9B6B47] text-xl"
              onClick={closeEditModal}
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#AD7C59]">Modifier l'utilisateur</h2>
            <form onSubmit={submitEdit} className="space-y-4">
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Nom</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AD7C59] font-semibold mb-1">Rôle</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59] text-[#AD7C59]"
                  >
                    <option value="locataire">Locataire</option>
                    <option value="proprietaire">Propriétaire</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#AD7C59] font-semibold mb-1">Statut</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59] text-[#AD7C59]"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                    <option value="banned">Banni</option>
                    <option value="pending">En attente</option>
                    <option value="locked">Verrouillé</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
                  onClick={closeEditModal}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#AD7C59] text-white hover:opacity-90 transition"
                  disabled={editLoading}
                >{editLoading ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal détail utilisateur */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-[#AD7C59] hover:text-[#9B6B47] text-xl"
              onClick={closeDetail}
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#AD7C59]">Détail de l'utilisateur</h2>
            <div className="space-y-3">
              <div><span className="font-semibold text-[#AD7C59]">Nom :</span> {detailUser.name}</div>
              <div><span className="font-semibold text-[#AD7C59]">Email :</span> {detailUser.email}</div>
              <div><span className="font-semibold text-[#AD7C59]">Téléphone :</span> {detailUser.phone || 'N/A'}</div>
              <div><span className="font-semibold text-[#AD7C59]">Rôle :</span> {getRoleBadge(detailUser.role)}</div>
              <div><span className="font-semibold text-[#AD7C59]">Statut :</span> {getStatusBadge(detailUser.status)}</div>
              <div><span className="font-semibold text-[#AD7C59]">Date d'inscription :</span> {formatDate(detailUser.createdAt)}</div>
              <div><span className="font-semibold text-[#AD7C59]">Dernière connexion :</span> {detailUser.lastLogin ? formatDate(detailUser.lastLogin) : 'Jamais connecté'}</div>
              <div><span className="font-semibold text-[#AD7C59]">Vérifications :</span> {getVerificationBadges(detailUser)}</div>
              {detailUser.notes && (
                <div><span className="font-semibold text-[#AD7C59]">Notes :</span> {detailUser.notes}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal suspension */}
      {suspendUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-[#AD7C59] hover:text-[#9B6B47] text-xl"
              onClick={closeSuspendModal}
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#AD7C59]">Suspendre l'utilisateur</h2>
            <p className="mb-4 text-gray-600">Vous êtes sur le point de suspendre <strong>{suspendUserModal.name}</strong>.</p>
            <form onSubmit={submitSuspend} className="space-y-4">
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Raison de la suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={e => setSuspendReason(e.target.value)}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows={3}
                  placeholder="Indiquez la raison de la suspension..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
                  onClick={closeSuspendModal}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-orange-600 text-white hover:opacity-90 transition"
                  disabled={actionLoading[suspendUserModal.id]}
                >{actionLoading[suspendUserModal.id] ? 'Suspension...' : 'Suspendre'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal message */}
      {messageUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-[#AD7C59] hover:text-[#9B6B47] text-xl"
              onClick={closeMessageModal}
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#AD7C59]">Envoyer un message</h2>
            <p className="mb-4 text-gray-600">Envoyer un message à <strong>{messageUserModal.name}</strong>.</p>
            <form onSubmit={submitMessage} className="space-y-4">
              <div>
                <label className="block text-[#AD7C59] font-semibold mb-1">Message</label>
                <textarea
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="w-full border border-[#AD7C59] rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows={4}
                  placeholder="Saisissez votre message..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
                  onClick={closeMessageModal}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:opacity-90 transition"
                >Envoyer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal réinitialisation mot de passe */}
      {resetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-[#AD7C59] hover:text-[#9B6B47] text-xl"
              onClick={closeResetPasswordModal}
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#AD7C59]">Réinitialiser le mot de passe</h2>
            <p className="mb-4 text-gray-600">Vous êtes sur le point de réinitialiser le mot de passe de <strong>{resetPasswordModal.name}</strong>.</p>
            <p className="mb-4 text-sm text-orange-600">Un email sera envoyé à l'utilisateur avec un lien de réinitialisation.</p>
            <form onSubmit={submitResetPassword} className="space-y-4">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
                  onClick={closeResetPasswordModal}
                >Annuler</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:opacity-90 transition"
                >Réinitialiser</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 