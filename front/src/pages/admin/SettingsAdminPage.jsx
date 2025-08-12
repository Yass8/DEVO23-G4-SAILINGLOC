import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCog, faSearch, faTrash, faEdit, faEye, faTimes, 
  faCheck, faBan, faClock, faUser, faShip, faReply,
  faCalendar, faFilter, faSort, faDownload, faExclamationTriangle,
  faCheckCircle, faTimesCircle, faHourglassHalf, faFlag,
  faChartLine, faChartBar, faChartPie, faTable, faList,
  faLightbulb, faHistory, faBell, faPhone, faFileAlt,
  faClipboardCheck, faClipboard, faReceipt, faCalculator, faPercent,
  faTag, faGift, faHandshake, faShieldAlt, faEyeSlash,
  faComment,
  faPaperPlane, faInbox, faArchive, faStar,
  faThumbsUp, faThumbsDown, faExclamationCircle, faQuestionCircle,
  faInfoCircle, faWarning, faLock, faUnlock,
  faMoneyBillWave, faCreditCard, faUniversity,
  faCoins, faExchangeAlt, faUndo, faRedo, faSync,
  faFileInvoice, faFileInvoiceDollar, faFileExport, faFileImport,
  faDollarSign, faEuroSign, faPoundSign, faYenSign,
  faArrowUp, faArrowDown, faEquals, faMinus, faPlus,
  faLockOpen, faUnlockAlt, faKey, faFingerprint,
  faQrcode, faBarcode, faIdCard, faPassport,
  faWrench, faTools, faHammer, faScrewdriver,
  faRuler, faTape, faLevelUp, faLevelDown, faBalanceScale,
  faWeight,
  faUpload, faFolder
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les paramètres (simulé)
const fetchSettings = async () => {
  // Données simulées
  return [
    { id: 1, name: 'Site Name', value: 'SailingLoc', category: 'general', status: 'active' },
    { id: 2, name: 'Contact Email', value: 'contact@sailingloc.com', category: 'contact', status: 'active' },
    { id: 3, name: 'Max Boats Per User', value: '5', category: 'limits', status: 'active' },
    { id: 4, name: 'Reservation Timeout', value: '30', category: 'reservations', status: 'active' },
    { id: 5, name: 'Maintenance Mode', value: 'false', category: 'system', status: 'inactive' }
  ];
};

const updateSetting = async (id, data) => {
  console.log('Mise à jour du paramètre:', id, data);
  return { success: true, message: 'Paramètre mis à jour avec succès' };
};

const createSetting = async (data) => {
  console.log('Création du paramètre:', data);
  return { success: true, message: 'Paramètre créé avec succès', id: Date.now() };
};

const deleteSetting = async (id) => {
  console.log('Suppression du paramètre:', id);
  return true;
};

const resetSetting = async (id) => {
  console.log('Réinitialisation du paramètre:', id);
  return { success: true, message: 'Paramètre réinitialisé avec succès' };
};

const backupSettings = async () => {
  console.log('Sauvegarde des paramètres');
  return { success: true, message: 'Sauvegarde créée avec succès', backupId: Date.now() };
};

const restoreSettings = async (backupId) => {
  console.log('Restauration des paramètres depuis la sauvegarde:', backupId);
  return { success: true, message: 'Paramètres restaurés avec succès' };
};

const exportToCSV = (settings) => {
  const csv = [
    ['ID', 'Catégorie', 'Clé', 'Valeur', 'Description', 'Statut'],
    ...settings.map(s => [
      s.id,
      s.category,
      s.key,
      s.value,
      s.description || 'N/A',
      s.status
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parametres.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editSetting, setEditSetting] = useState(null);
  const [editForm, setEditForm] = useState({ 
    category: '',
    key: '',
    value: '',
    description: '',
    status: 'active'
  });
  const [editLoading, setEditLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    category: '',
    key: '',
    value: '',
    description: '',
    status: 'active'
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [detailSetting, setDetailSetting] = useState(null);
  const [backupModal, setBackupModal] = useState(false);
  const [restoreModal, setRestoreModal] = useState(false);
  const [backupList, setBackupList] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSettings();
    setSettings(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce paramètre ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteSetting(id);
    await loadSettings();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (setting) => {
    setEditSetting(setting);
    setEditForm({
      category: setting.category || '',
      key: setting.key || '',
      value: setting.value || '',
      description: setting.description || '',
      status: setting.status || 'active'
    });
  };

  const closeEditModal = () => {
    setEditSetting(null);
    setEditForm({ 
      category: '',
      key: '',
      value: '',
      description: '',
      status: 'active'
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateSetting(editSetting.id, editForm);
    await loadSettings();
    closeEditModal();
  };

  const handleCreate = () => {
    setCreateModal(true);
    setCreateForm({
      category: '',
      key: '',
      value: '',
      description: '',
      status: 'active'
    });
  };

  const closeCreateModal = () => {
    setCreateModal(false);
    setCreateForm({
      category: '',
      key: '',
      value: '',
      description: '',
      status: 'active'
    });
    setCreateLoading(false);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!createForm.category || !createForm.key || !createForm.value) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setCreateLoading(true);
    await createSetting(createForm);
    await loadSettings();
    closeCreateModal();
  };

  const handleDetail = (setting) => setDetailSetting(setting);
  const closeDetail = () => setDetailSetting(null);

  const handleReset = async (id) => {
    if (!window.confirm("Réinitialiser ce paramètre à sa valeur par défaut ?")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await resetSetting(id);
    await loadSettings();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleBackup = async () => {
    setActionLoading((prev) => ({ ...prev, backup: true }));
    await backupSettings();
    setActionLoading((prev) => ({ ...prev, backup: false }));
    setBackupModal(false);
  };

  const handleRestore = async () => {
    if (!selectedBackup) {
      alert('Veuillez sélectionner une sauvegarde');
      return;
    }
    if (!window.confirm("Restaurer cette sauvegarde ? Cela remplacera tous les paramètres actuels.")) return;
    setActionLoading((prev) => ({ ...prev, restore: true }));
    await restoreSettings(selectedBackup);
    await loadSettings();
    setActionLoading((prev) => ({ ...prev, restore: false }));
    setRestoreModal(false);
  };

  const handleBulkAction = async () => {
    if (selectedSettings.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedSettings.length} paramètre(s) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const settingId of selectedSettings) {
        switch (bulkAction) {
          case 'reset':
            await resetSetting(settingId);
            break;
          case 'delete':
            await deleteSetting(settingId);
            break;
          case 'export':
            // Export sera géré séparément
            break;
        }
      }
      await loadSettings();
      setSelectedSettings([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleSettingSelection = (settingId) => {
    setSelectedSettings(prev => 
      prev.includes(settingId) 
        ? prev.filter(id => id !== settingId)
        : [...prev, settingId]
    );
  };

  const selectAllSettings = () => {
    if (selectedSettings.length === filteredAndSortedSettings.length) {
      setSelectedSettings([]);
    } else {
      setSelectedSettings(filteredAndSortedSettings.map(s => s.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedSettings = settings
    .filter((setting) => {
      const matchesSearch = setting.key?.toLowerCase().includes(search.toLowerCase()) ||
                           setting.value?.toLowerCase().includes(search.toLowerCase()) ||
                           setting.description?.toLowerCase().includes(search.toLowerCase()) ||
                           setting.category?.toLowerCase().includes(search.toLowerCase()) ||
                           setting.id?.toString().includes(search);
      const matchesCategory = filterCategory === 'all' || setting.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || setting.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'category':
          aValue = a.category?.toLowerCase();
          bValue = b.category?.toLowerCase();
          break;
        case 'key':
          aValue = a.key?.toLowerCase();
          bValue = b.key?.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.category?.toLowerCase();
          bValue = b.category?.toLowerCase();
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
      'deprecated': { text: 'Déprécié', class: 'bg-red-100 text-red-800 border-red-200' },
      'experimental': { text: 'Expérimental', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    };
    const config = statusConfig[status] || statusConfig['active'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'general': { text: 'Général', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'security': { text: 'Sécurité', class: 'bg-red-100 text-red-800 border-red-200' },
      'email': { text: 'Email', class: 'bg-green-100 text-green-800 border-green-200' },
      'payment': { text: 'Paiement', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'notification': { text: 'Notification', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'system': { text: 'Système', class: 'bg-gray-100 text-gray-800 border-gray-200' }
    };
    const config = categoryConfig[category] || categoryConfig['general'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getStats = () => {
    const total = settings.length;
    const active = settings.filter(s => s.status === 'active').length;
    const inactive = settings.filter(s => s.status === 'inactive').length;
    const deprecated = settings.filter(s => s.status === 'deprecated').length;
    const categories = [...new Set(settings.map(s => s.category))].length;
    
    return { 
      total, 
      active, 
      inactive, 
      deprecated, 
      categories 
    };
  };

  const stats = getStats();

  const getSettingsByCategory = (category) => {
    return filteredAndSortedSettings.filter(s => s.category === category);
  };

  const renderSettingsTable = (categorySettings) => (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white rounded-xl">
        <thead>
          <tr className="text-left text-[#AD7C59]">
            <th className="py-2 px-4">
              <input
                type="checkbox"
                checked={categorySettings.every(s => selectedSettings.includes(s.id))}
                onChange={() => {
                  const allSelected = categorySettings.every(s => selectedSettings.includes(s.id));
                  if (allSelected) {
                    setSelectedSettings(prev => prev.filter(id => !categorySettings.map(s => s.id).includes(id)));
                  } else {
                    setSelectedSettings(prev => [...new Set([...prev, ...categorySettings.map(s => s.id)])]);
                  }
                }}
                className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
              />
            </th>
            <th className="py-2 px-4">Clé</th>
            <th className="py-2 px-4">Valeur</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Statut</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categorySettings.map((setting) => (
            <tr key={setting.id} className="border-b last:border-b-0">
              <td className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedSettings.includes(setting.id)}
                  onChange={() => toggleSettingSelection(setting.id)}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </td>
              <td className="py-2 px-4">
                <div className="font-medium text-gray-800">{setting.key}</div>
              </td>
              <td className="py-2 px-4">
                <div className="max-w-xs">
                  <div className="text-sm text-gray-600 break-words">
                    {setting.value?.length > 50 
                      ? `${setting.value.substring(0, 50)}...` 
                      : setting.value
                    }
                  </div>
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="max-w-xs">
                  <div className="text-sm text-gray-600">
                    {setting.description || 'Aucune description'}
                  </div>
                </div>
              </td>
              <td className="py-2 px-4">
                {getStatusBadge(setting.status)}
              </td>
              <td className="py-2 px-4">
                <div className="flex flex-wrap gap-1">
                  <button
                    className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                    onClick={() => handleDetail(setting)}
                    title="Voir le détail"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                    onClick={() => handleEdit(setting)}
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                    onClick={() => handleReset(setting.id)}
                    disabled={actionLoading[setting.id]}
                    title="Réinitialiser"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </button>
                  <button
                    className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                    onClick={() => handleDelete(setting.id)}
                    disabled={actionLoading[setting.id]}
                    title="Supprimer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faCog} className="text-[#AD7C59]" /> Paramètres du Système
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setBackupModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            <FontAwesomeIcon icon={faDownload} /> Sauvegarder
          </button>
          <button
            onClick={() => setRestoreModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
          >
            <FontAwesomeIcon icon={faUpload} /> Restaurer
          </button>
          <button
            onClick={() => exportToCSV(filteredAndSortedSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
          >
            <FontAwesomeIcon icon={faFileExport} /> Exporter CSV
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#AD7C59] text-white rounded hover:bg-[#8B6B4A] transition"
          >
            <FontAwesomeIcon icon={faPlus} /> Nouveau
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCog} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total des paramètres</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTimesCircle} className="text-2xl text-gray-600" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Inactifs</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">Dépréciés</p>
              <p className="text-2xl font-bold text-red-800">{stats.deprecated}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faFolder} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Catégories</p>
              <p className="text-2xl font-bold text-purple-800">{stats.categories}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedSettings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedSettings.length} paramètre(s) sélectionné(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="reset">Réinitialiser</option>
                <option value="delete">Supprimer</option>
                <option value="export">Exporter</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || actionLoading.bulk}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading.bulk ? 'Exécution...' : 'Exécuter'}
              </button>
            </div>
            <button
              onClick={() => setSelectedSettings([])}
              className="text-blue-600 hover:text-blue-800"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

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
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes catégories</option>
          <option value="general">Général</option>
          <option value="security">Sécurité</option>
          <option value="email">Email</option>
          <option value="payment">Paiement</option>
          <option value="notification">Notification</option>
          <option value="system">Système</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="deprecated">Déprécié</option>
          <option value="experimental">Expérimental</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="category">Trier par catégorie</option>
          <option value="key">Trier par clé</option>
          <option value="status">Trier par statut</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
        >
          <FontAwesomeIcon icon={faSort} />
          {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
        </button>
      </div>

      {/* Onglets par catégorie */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['general', 'security', 'email', 'payment', 'notification', 'system'].map((category) => {
              const categorySettings = getSettingsByCategory(category);
              if (categorySettings.length === 0) return null;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === category
                      ? 'border-[#AD7C59] text-[#AD7C59]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getCategoryBadge(category).props.children}
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full">
                    {categorySettings.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {['general', 'security', 'email', 'payment', 'notification', 'system'].map((category) => {
        const categorySettings = getSettingsByCategory(category);
        if (categorySettings.length === 0) return null;
        
        return (
          <div key={category} className={activeTab === category ? 'block' : 'hidden'}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {getCategoryBadge(category)}
                <span className="text-gray-600">({categorySettings.length} paramètres)</span>
              </h2>
            </div>
            {renderSettingsTable(categorySettings)}
          </div>
        );
      })}

      {/* Modal d'édition */}
      {editSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Modifier le paramètre</h3>
            <form onSubmit={submitEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                >
                  <option value="general">Général</option>
                  <option value="security">Sécurité</option>
                  <option value="email">Email</option>
                  <option value="payment">Paiement</option>
                  <option value="notification">Notification</option>
                  <option value="system">Système</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clé</label>
                <input
                  type="text"
                  value={editForm.key}
                  onChange={(e) => setEditForm({...editForm, key: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
                <textarea
                  value={editForm.value}
                  onChange={(e) => setEditForm({...editForm, value: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="deprecated">Déprécié</option>
                  <option value="experimental">Expérimental</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-[#AD7C59] text-white py-2 rounded-lg hover:bg-[#8B6B4A] disabled:opacity-50"
                >
                  {editLoading ? 'Modification...' : 'Modifier'}
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 border border-[#AD7C59] text-[#AD7C59] py-2 rounded-lg hover:bg-[#AD7C59] hover:text-white transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de création */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Nouveau paramètre</h3>
            <form onSubmit={submitCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="general">Général</option>
                  <option value="security">Sécurité</option>
                  <option value="email">Email</option>
                  <option value="payment">Paiement</option>
                  <option value="notification">Notification</option>
                  <option value="system">Système</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clé</label>
                <input
                  type="text"
                  value={createForm.key}
                  onChange={(e) => setCreateForm({...createForm, key: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  placeholder="ex: app.name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
                <textarea
                  value={createForm.value}
                  onChange={(e) => setCreateForm({...createForm, value: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  placeholder="Valeur du paramètre"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="2"
                  placeholder="Description du paramètre"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="experimental">Expérimental</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-[#AD7C59] text-white py-2 rounded-lg hover:bg-[#8B6B4A] disabled:opacity-50"
                >
                  {createLoading ? 'Création...' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 border border-[#AD7C59] text-[#AD7C59] py-2 rounded-lg hover:bg-[#AD7C59] hover:text-white transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de détail */}
      {detailSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#AD7C59]">Détail du paramètre</h3>
              <button
                onClick={closeDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Informations générales</h4>
                <div className="space-y-2">
                  <div><span className="font-medium">ID:</span> {detailSetting.id}</div>
                  <div><span className="font-medium">Catégorie:</span> {getCategoryBadge(detailSetting.category)}</div>
                  <div><span className="font-medium">Clé:</span> <code className="bg-gray-100 px-2 py-1 rounded">{detailSetting.key}</code></div>
                  <div><span className="font-medium">Statut:</span> {getStatusBadge(detailSetting.status)}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Valeur</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">{detailSetting.value}</pre>
                </div>
              </div>
            </div>
            {detailSetting.description && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{detailSetting.description}</p>
              </div>
            )}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Créé le:</span> {new Date(detailSetting.createdAt).toLocaleString('fr-FR')}</div>
                <div><span className="font-medium">Mis à jour le:</span> {new Date(detailSetting.updatedAt).toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sauvegarde */}
      {backupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Sauvegarder les paramètres</h3>
            <p className="text-gray-600 mb-4">
              Cette action créera une sauvegarde complète de tous les paramètres actuels du système.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleBackup}
                disabled={actionLoading.backup}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading.backup ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={() => setBackupModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de restauration */}
      {restoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Restaurer les paramètres</h3>
            <p className="text-gray-600 mb-4">
              Attention : Cette action remplacera tous les paramètres actuels par ceux de la sauvegarde sélectionnée.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner une sauvegarde</label>
              <select
                value={selectedBackup}
                onChange={(e) => setSelectedBackup(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
              >
                <option value="">Choisir une sauvegarde</option>
                <option value="backup_2024_01_01">Sauvegarde du 01/01/2024</option>
                <option value="backup_2024_02_01">Sauvegarde du 01/02/2024</option>
                <option value="backup_2024_03_01">Sauvegarde du 01/03/2024</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRestore}
                disabled={!selectedBackup || actionLoading.restore}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading.restore ? 'Restauration...' : 'Restaurer'}
              </button>
              <button
                onClick={() => setRestoreModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 