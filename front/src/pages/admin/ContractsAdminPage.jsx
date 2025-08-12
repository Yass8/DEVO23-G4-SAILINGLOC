import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faTrash, faEdit, faEye, faTimes, 
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
  faCheckDouble,
  faLockOpen, faUnlockAlt, faKey, faFingerprint,
  faQrcode, faBarcode, faIdCard, faPassport,
  faWrench, faTools, faHammer, faScrewdriver,
  faRuler, faTape, faLevelUp, faLevelDown, faBalanceScale,
  faWeight, faPause, faPlay
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les contrats (simulé)
const fetchContracts = async () => {
  // Données simulées
  return [
    { id: 1, type: 'Location', status: 'active', amount: '500€', startDate: '2024-01-15', endDate: '2024-01-20', notes: 'Contrat de location' },
    { id: 2, type: 'Vente', status: 'pending', amount: '15000€', startDate: '2024-02-01', endDate: '2024-02-01', notes: 'Contrat de vente' },
    { id: 3, type: 'Location', status: 'expired', amount: '300€', startDate: '2023-12-01', endDate: '2023-12-05', notes: 'Ancien contrat' }
  ];
};

const updateContract = async (id, data) => {
  console.log('Mise à jour du contrat:', id, data);
  return { success: true, message: 'Contrat mis à jour avec succès' };
};

const deleteContract = async (id) => {
  console.log('Suppression du contrat:', id);
  return true;
};

const approveContract = async (id) => {
  console.log('Approbation du contrat:', id);
  return { success: true, message: 'Contrat approuvé avec succès' };
};

const rejectContract = async (id, reason) => {
  console.log('Rejet du contrat:', id, reason);
  return { success: true, message: 'Contrat rejeté avec succès' };
};

const terminateContract = async (id, reason) => {
  console.log('Résiliation du contrat:', id, reason);
  return { success: true, message: 'Contrat résilié avec succès' };
};

const renewContract = async (id, renewalData) => {
  console.log('Renouvellement du contrat:', id, renewalData);
  return { success: true, message: 'Contrat renouvelé avec succès' };
};

const suspendContract = async (id, reason) => {
  console.log('Suspension du contrat:', id, reason);
  return { success: true, message: 'Contrat suspendu avec succès' };
};

const activateContract = async (id) => {
  console.log('Activation du contrat:', id);
  return { success: true, message: 'Contrat activé avec succès' };
};

const flagContract = async (id, reason) => {
  console.log('Signalement du contrat:', id, reason);
  return { success: true, message: 'Contrat signalé avec succès' };
};

const exportToCSV = (contracts) => {
  const csv = [
    ['ID', 'Client', 'Bateau', 'Type', 'Statut', 'Montant', 'Date début', 'Date fin'],
    ...contracts.map(c => [
      c.id,
      c.customer?.name || 'N/A',
      c.boat?.name || 'N/A',
      c.type,
      c.status,
      c.amount,
      formatDate(c.startDate),
      formatDate(c.endDate)
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contrats.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function ContractsAdminPage() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editContract, setEditContract] = useState(null);
  const [editForm, setEditForm] = useState({ 
    type: '',
    status: 'pending',
    amount: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailContract, setDetailContract] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [terminateModal, setTerminateModal] = useState(null);
  const [terminateReason, setTerminateReason] = useState('');
  const [renewModal, setRenewModal] = useState(null);
  const [renewForm, setRenewForm] = useState({
    newEndDate: '',
    newAmount: '',
    reason: ''
  });
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [flagModal, setFlagModal] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterAmount, setFilterAmount] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setLoading(true);
    const data = await fetchContracts();
    setContracts(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce contrat ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteContract(id);
    await loadContracts();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (contract) => {
    setEditContract(contract);
    setEditForm({
      type: contract.type || '',
      status: contract.status || 'pending',
      amount: contract.amount || '',
      startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
      endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      notes: contract.notes || ''
    });
  };

  const closeEditModal = () => {
    setEditContract(null);
    setEditForm({ 
      type: '',
      status: 'pending',
      amount: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateContract(editContract.id, editForm);
    await loadContracts();
    closeEditModal();
  };

  const handleDetail = (contract) => setDetailContract(contract);
  const closeDetail = () => setDetailContract(null);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await approveContract(id);
    await loadContracts();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReject = (contract) => {
    setRejectModal(contract);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectModal(null);
    setRejectReason('');
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Veuillez indiquer une raison de rejet');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [rejectModal.id]: true }));
    await rejectContract(rejectModal.id, rejectReason);
    await loadContracts();
    closeRejectModal();
    setActionLoading((prev) => ({ ...prev, [rejectModal.id]: false }));
  };

  const handleTerminate = (contract) => {
    setTerminateModal(contract);
    setTerminateReason('');
  };

  const closeTerminateModal = () => {
    setTerminateModal(null);
    setTerminateReason('');
  };

  const submitTerminate = async (e) => {
    e.preventDefault();
    if (!terminateReason.trim()) {
      alert('Veuillez indiquer une raison de résiliation');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [terminateModal.id]: true }));
    await terminateContract(terminateModal.id, terminateReason);
    await loadContracts();
    closeTerminateModal();
    setActionLoading((prev) => ({ ...prev, [terminateModal.id]: false }));
  };

  const handleRenew = (contract) => {
    setRenewModal(contract);
    setRenewForm({
      newEndDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      newAmount: contract.amount || '',
      reason: ''
    });
  };

  const closeRenewModal = () => {
    setRenewModal(null);
    setRenewForm({
      newEndDate: '',
      newAmount: '',
      reason: ''
    });
  };

  const submitRenew = async (e) => {
    e.preventDefault();
    if (!renewForm.newEndDate || !renewForm.newAmount || !renewForm.reason.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [renewModal.id]: true }));
    await renewContract(renewModal.id, renewForm);
    await loadContracts();
    closeRenewModal();
    setActionLoading((prev) => ({ ...prev, [renewModal.id]: false }));
  };

  const handleSuspend = (contract) => {
    setSuspendModal(contract);
    setSuspendReason('');
  };

  const closeSuspendModal = () => {
    setSuspendModal(null);
    setSuspendReason('');
  };

  const submitSuspend = async (e) => {
    e.preventDefault();
    if (!suspendReason.trim()) {
      alert('Veuillez indiquer une raison de suspension');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [suspendModal.id]: true }));
    await suspendContract(suspendModal.id, suspendReason);
    await loadContracts();
    closeSuspendModal();
    setActionLoading((prev) => ({ ...prev, [suspendModal.id]: false }));
  };

  const handleActivate = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await activateContract(id);
    await loadContracts();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleFlag = (contract) => {
    setFlagModal(contract);
    setFlagReason('');
  };

  const closeFlagModal = () => {
    setFlagModal(null);
    setFlagReason('');
  };

  const submitFlag = async (e) => {
    e.preventDefault();
    if (!flagReason.trim()) {
      alert('Veuillez indiquer une raison de signalement');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: true }));
    await flagContract(flagModal.id, flagReason);
    await loadContracts();
    closeFlagModal();
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: false }));
  };

  const handleBulkAction = async () => {
    if (selectedContracts.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedContracts.length} contrat(s) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const contractId of selectedContracts) {
        switch (bulkAction) {
          case 'approve':
            await approveContract(contractId);
            break;
          case 'reject':
            await rejectContract(contractId, 'Action en masse');
            break;
          case 'export':
            // Export sera géré séparément
            break;
        }
      }
      await loadContracts();
      setSelectedContracts([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleContractSelection = (contractId) => {
    setSelectedContracts(prev => 
      prev.includes(contractId) 
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    );
  };

  const selectAllContracts = () => {
    if (selectedContracts.length === filteredAndSortedContracts.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(filteredAndSortedContracts.map(c => c.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedContracts = contracts
    .filter((contract) => {
      const matchesSearch = contract.reference?.toLowerCase().includes(search.toLowerCase()) ||
                           contract.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           contract.boat?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           contract.id?.toString().includes(search) ||
                           contract.amount?.toString().includes(search);
      const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
      const matchesType = filterType === 'all' || contract.type === filterType;
      const matchesCustomer = filterCustomer === 'all' || contract.customer?.id === filterCustomer;
      
      return matchesSearch && matchesStatus && matchesType && matchesCustomer;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'amount':
          aValue = parseFloat(a.amount) || 0;
          bValue = parseFloat(b.amount) || 0;
          break;
        case 'customer':
          aValue = a.customer?.name?.toLowerCase();
          bValue = b.customer?.name?.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
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
      'pending': { text: 'En attente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'active': { text: 'Actif', class: 'bg-green-100 text-green-800 border-green-200' },
      'expired': { text: 'Expiré', class: 'bg-red-100 text-red-800 border-red-200' },
      'terminated': { text: 'Résilié', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'suspended': { text: 'Suspendu', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'draft': { text: 'Brouillon', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'rejected': { text: 'Rejeté', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'rental': { text: 'Location', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'purchase': { text: 'Achat', class: 'bg-green-100 text-green-800 border-green-200' },
      'maintenance': { text: 'Maintenance', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'insurance': { text: 'Assurance', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'service': { text: 'Service', class: 'bg-pink-100 text-pink-800 border-pink-200' }
    };
    const config = typeConfig[type] || typeConfig['rental'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getAmountBadge = (amount) => {
    const amountNum = parseFloat(amount) || 0;
    let config;
    
    if (amountNum >= 10000) {
      config = { class: 'bg-red-100 text-red-800 border-red-200' };
    } else if (amountNum >= 5000) {
      config = { class: 'bg-orange-100 text-orange-800 border-orange-200' };
    } else if (amountNum >= 1000) {
      config = { class: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      config = { class: 'bg-green-100 text-green-800 border-green-200' };
    }
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {amountNum.toFixed(2)} €
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStats = () => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'active').length;
    const pending = contracts.filter(c => c.status === 'pending').length;
    const expired = contracts.filter(c => c.status === 'expired').length;
    const totalAmount = contracts.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const today = contracts.filter(c => {
      const today = new Date();
      const contractDate = new Date(c.createdAt);
      return contractDate.toDateString() === today.toDateString();
    }).length;
    
    return { 
      total, 
      active, 
      pending, 
      expired, 
      totalAmount, 
      today 
    };
  };

  const stats = getStats(); 
  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-[#AD7C59]" /> Gestion des Contrats
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSortedContracts)}
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
            <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total des contrats</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Contrats actifs</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="text-2xl text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">En attente</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTimesCircle} className="text-2xl text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">Expirés</p>
              <p className="text-2xl font-bold text-red-800">{stats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedContracts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedContracts.length} contrat(s) sélectionné(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="approve">Approuver</option>
                <option value="reject">Rejeter</option>
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
              onClick={() => setSelectedContracts([])}
              className="text-blue-600 hover:text-blue-800"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
          <option value="pending">En attente</option>
          <option value="active">Actifs</option>
          <option value="expired">Expirés</option>
          <option value="terminated">Résiliés</option>
          <option value="suspended">Suspendus</option>
          <option value="draft">Brouillons</option>
          <option value="rejected">Rejetés</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous types</option>
          <option value="rental">Location</option>
          <option value="purchase">Achat</option>
          <option value="maintenance">Maintenance</option>
          <option value="insurance">Assurance</option>
          <option value="service">Service</option>
        </select>

        <select
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous montants</option>
          <option value="low">Faible (&lt; 1000€)</option>
          <option value="medium">Moyen (1000-5000€)</option>
          <option value="high">Élevé (5000-10000€)</option>
          <option value="very_high">Très élevé (&gt; 10000€)</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="amount">Trier par montant</option>
          <option value="customer">Trier par client</option>
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

      {/* Tableau des contrats */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedContracts.length === filteredAndSortedContracts.length && filteredAndSortedContracts.length > 0}
                  onChange={selectAllContracts}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Bateau</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Montant</th>
              <th className="py-2 px-4">Période</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedContracts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#AD7C59]">Aucun contrat trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedContracts.map((contract) => (
                <tr key={contract.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedContracts.includes(contract.id)}
                      onChange={() => toggleContractSelection(contract.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{contract.customer?.name}</div>
                        <div className="text-sm text-gray-500">{contract.customer?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faShip} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{contract.boat?.name}</div>
                        <div className="text-sm text-gray-500">{contract.boat?.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getTypeBadge(contract.type)}
                  </td>
                  <td className="py-2 px-4">
                    {getAmountBadge(contract.amount)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div className="font-medium">Du {formatDate(contract.startDate)}</div>
                      <div className="text-xs text-gray-500">Au {formatDate(contract.endDate)}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(contract)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(contract)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {contract.status === 'pending' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                            onClick={() => handleApprove(contract.id)}
                            disabled={actionLoading[contract.id]}
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleReject(contract)}
                            title="Rejeter"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      )}

                      {contract.status === 'active' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                            onClick={() => handleRenew(contract)}
                            title="Renouveler"
                          >
                            <FontAwesomeIcon icon={faSync} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleTerminate(contract)}
                            title="Résilier"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                            onClick={() => handleSuspend(contract)}
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faPause} />
                          </button>
                        </>
                      )}

                      {contract.status === 'suspended' && (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleActivate(contract.id)}
                          disabled={actionLoading[contract.id]}
                          title="Activer"
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                        onClick={() => handleFlag(contract)}
                        title="Signaler"
                      >
                        <FontAwesomeIcon icon={faFlag} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(contract.id)}
                        disabled={actionLoading[contract.id]}
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
      {editContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Modifier le contrat</h3>
            <form onSubmit={submitEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de contrat</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                >
                  <option value="rental">Location</option>
                  <option value="purchase">Achat</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="insurance">Assurance</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                >
                  <option value="pending">En attente</option>
                  <option value="active">Actif</option>
                  <option value="expired">Expiré</option>
                  <option value="terminated">Résilié</option>
                  <option value="suspended">Suspendu</option>
                  <option value="draft">Brouillon</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                />
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

      {/* Modal de détail */}
      {detailContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#AD7C59]">Détail du contrat</h3>
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
                  <div><span className="font-medium">ID:</span> {detailContract.id}</div>
                  <div><span className="font-medium">Référence:</span> {detailContract.reference || 'N/A'}</div>
                  <div><span className="font-medium">Statut:</span> {getStatusBadge(detailContract.status)}</div>
                  <div><span className="font-medium">Type:</span> {getTypeBadge(detailContract.type)}</div>
                  <div><span className="font-medium">Montant:</span> {getAmountBadge(detailContract.amount)}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Client</h4>
                <div className="space-y-2">
                  <div><span className="font-medium">Nom:</span> {detailContract.customer?.name}</div>
                  <div><span className="font-medium">Email:</span> {detailContract.customer?.email}</div>
                  <div><span className="font-medium">Téléphone:</span> {detailContract.customer?.phone || 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Bateau</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Nom:</span> {detailContract.boat?.name}</div>
                <div><span className="font-medium">Type:</span> {detailContract.boat?.type}</div>
                <div><span className="font-medium">Longueur:</span> {detailContract.boat?.length || 'N/A'}</div>
                <div><span className="font-medium">Capacité:</span> {detailContract.boat?.capacity || 'N/A'}</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Période</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Début:</span> {formatDateTime(detailContract.startDate)}</div>
                <div><span className="font-medium">Fin:</span> {formatDateTime(detailContract.endDate)}</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Créé le:</span> {formatDateTime(detailContract.createdAt)}</div>
                <div><span className="font-medium">Mis à jour le:</span> {formatDateTime(detailContract.updatedAt)}</div>
              </div>
            </div>
            {detailContract.notes && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                <p className="text-gray-600">{detailContract.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Rejeter le contrat</h3>
            <form onSubmit={submitReject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du rejet</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Rejeter
                </button>
                <button
                  type="button"
                  onClick={closeRejectModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de résiliation */}
      {terminateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Résilier le contrat</h3>
            <form onSubmit={submitTerminate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison de la résiliation</label>
                <textarea
                  value={terminateReason}
                  onChange={(e) => setTerminateReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Résilier
                </button>
                <button
                  type="button"
                  onClick={closeTerminateModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de renouvellement */}
      {renewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Renouveler le contrat</h3>
            <form onSubmit={submitRenew}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouvelle date de fin</label>
                <input
                  type="date"
                  value={renewForm.newEndDate}
                  onChange={(e) => setRenewForm({...renewForm, newEndDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau montant</label>
                <input
                  type="number"
                  step="0.01"
                  value={renewForm.newAmount}
                  onChange={(e) => setRenewForm({...renewForm, newAmount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du renouvellement</label>
                <textarea
                  value={renewForm.reason}
                  onChange={(e) => setRenewForm({...renewForm, reason: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Renouveler
                </button>
                <button
                  type="button"
                  onClick={closeRenewModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de suspension */}
      {suspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Suspendre le contrat</h3>
            <form onSubmit={submitSuspend}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison de la suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                >
                  Suspendre
                </button>
                <button
                  type="button"
                  onClick={closeSuspendModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de signalement */}
      {flagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Signaler le contrat</h3>
            <form onSubmit={submitFlag}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du signalement</label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Signaler
                </button>
                <button
                  type="button"
                  onClick={closeFlagModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 