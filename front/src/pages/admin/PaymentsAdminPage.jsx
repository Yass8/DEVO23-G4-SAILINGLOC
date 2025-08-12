import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCreditCard, faSearch, faTrash, faEdit, faEye, faTimes, 
  faCheck, faBan, faClock, faUser, faShip, faReply,
  faCalendar, faFilter, faSort, faDownload, faExclamationTriangle,
  faCheckCircle, faTimesCircle, faHourglassHalf, faFlag,
  faChartLine, faChartBar, faChartPie, faTable, faList,
  faLightbulb, faHistory, faBell, faPhone, faFileAlt,
  faClipboardCheck, faClipboard, faReceipt, faCalculator, faPercent,
  faTag, faGift, faHandshake, faShieldAlt, faEyeSlash,
  faEyeDropper, faComment, faCommentSlash, faCommentDots,
  faCommentAlt, faCommentMedical,
  faPaperPlane, faInbox, faArchive, faStar,
  faThumbsUp, faThumbsDown, faExclamationCircle, faQuestionCircle,
  faInfoCircle, faWarning, faLock, faUnlock,
  faMoneyBillWave, faUniversity,
  faCoins, faExchangeAlt, faUndo, faRedo, faSync,
  faFileInvoice, faFileInvoiceDollar, faFileExport, faFileImport,
  faDollarSign, faEuroSign, faPoundSign, faYenSign,
  faArrowUp, faArrowDown, faEquals, faMinus, faPlus,
  faLockOpen, faUnlockAlt, faKey, faFingerprint,
  faQrcode, faBarcode, faIdCard, faPassport,
  faWrench, faTools, faHammer, faScrewdriver,
  faRuler, faTape, faLevelUp, faLevelDown, faBalanceScale,
  faWeight
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les paiements (simulé)
const fetchPayments = async () => {
  // Données simulées
  return [
    { id: 1, method: 'Credit Card', status: 'approved', amount: '500€', customer: 'Jean Dupont', date: '2024-01-15' },
    { id: 2, method: 'PayPal', status: 'pending', amount: '150€', customer: 'Marie Martin', date: '2024-01-16' },
    { id: 3, method: 'Bank Transfer', status: 'rejected', amount: '300€', customer: 'Pierre Durand', date: '2024-01-17' }
  ];
};

const updatePayment = async (id, data) => {
  console.log('Mise à jour du paiement:', id, data);
  return { success: true, message: 'Paiement mis à jour avec succès' };
};

const deletePayment = async (id) => {
  console.log('Suppression du paiement:', id);
  return true;
};

const approvePayment = async (id) => {
  console.log('Approbation du paiement:', id);
  return { success: true, message: 'Paiement approuvé avec succès' };
};

const rejectPayment = async (id, reason) => {
  console.log('Rejet du paiement:', id, reason);
  return { success: true, message: 'Paiement rejeté avec succès' };
};

const refundPayment = async (id, amount, reason) => {
  console.log('Remboursement du paiement:', id, amount, reason);
  return { success: true, message: 'Paiement remboursé avec succès' };
};

const cancelPayment = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/payments/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Erreur lors de l\'annulation');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const suspendPayment = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/payments/${id}/suspend`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Erreur lors de la suspension');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const activatePayment = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/payments/${id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Erreur lors de l\'activation');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const flagPayment = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/payments/${id}/flag`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Erreur lors du signalement');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const exportToCSV = (payments) => {
  const csv = [
    ['ID', 'Client', 'Montant', 'Devise', 'Statut', 'Méthode', 'Date création', 'Référence'],
    ...payments.map(p => [
      p.id,
      p.customer?.name || 'N/A',
      p.amount,
      p.currency,
      p.status,
      p.paymentMethod,
      formatDate(p.createdAt),
      p.reference || 'N/A'
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'paiements.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editPayment, setEditPayment] = useState(null);
  const [editForm, setEditForm] = useState({ 
    amount: '',
    currency: 'EUR',
    status: 'pending',
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailPayment, setDetailPayment] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [refundModal, setRefundModal] = useState(null);
  const [refundForm, setRefundForm] = useState({
    amount: '',
    reason: ''
  });
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [flagModal, setFlagModal] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterAmount, setFilterAmount] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    const data = await fetchPayments();
    setPayments(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce paiement ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deletePayment(id);
    await loadPayments();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (payment) => {
    setEditPayment(payment);
    setEditForm({
      amount: payment.amount || '',
      currency: payment.currency || 'EUR',
      status: payment.status || 'pending',
      notes: payment.notes || ''
    });
  };

  const closeEditModal = () => {
    setEditPayment(null);
    setEditForm({ 
      amount: '',
      currency: 'EUR',
      status: 'pending',
      notes: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updatePayment(editPayment.id, editForm);
    await loadPayments();
    closeEditModal();
  };

  const handleDetail = (payment) => setDetailPayment(payment);
  const closeDetail = () => setDetailPayment(null);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await approvePayment(id);
    await loadPayments();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReject = (payment) => {
    setRejectModal(payment);
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
    await rejectPayment(rejectModal.id, rejectReason);
    await loadPayments();
    closeRejectModal();
    setActionLoading((prev) => ({ ...prev, [rejectModal.id]: false }));
  };

  const handleRefund = (payment) => {
    setRefundModal(payment);
    setRefundForm({
      amount: payment.amount || '',
      reason: ''
    });
  };

  const closeRefundModal = () => {
    setRefundModal(null);
    setRefundForm({
      amount: '',
      reason: ''
    });
  };

  const submitRefund = async (e) => {
    e.preventDefault();
    if (!refundForm.amount || !refundForm.reason.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [refundModal.id]: true }));
    await refundPayment(refundModal.id, refundForm.amount, refundForm.reason);
    await loadPayments();
    closeRefundModal();
    setActionLoading((prev) => ({ ...prev, [refundModal.id]: false }));
  };

  const handleCancel = (payment) => {
    setCancelModal(payment);
    setCancelReason('');
  };

  const closeCancelModal = () => {
    setCancelModal(null);
    setCancelReason('');
  };

  const submitCancel = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert('Veuillez indiquer une raison d\'annulation');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [cancelModal.id]: true }));
    await cancelPayment(cancelModal.id, cancelReason);
    await loadPayments();
    closeCancelModal();
    setActionLoading((prev) => ({ ...prev, [cancelModal.id]: false }));
  };

  const handleSuspend = (payment) => {
    setSuspendModal(payment);
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
    await suspendPayment(suspendModal.id, suspendReason);
    await loadPayments();
    closeSuspendModal();
    setActionLoading((prev) => ({ ...prev, [suspendModal.id]: false }));
  };

  const handleActivate = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await activatePayment(id);
    await loadPayments();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleFlag = (payment) => {
    setFlagModal(payment);
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
    await flagPayment(flagModal.id, flagReason);
    await loadPayments();
    closeFlagModal();
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: false }));
  };

  const handleBulkAction = async () => {
    if (selectedPayments.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedPayments.length} paiement(s) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const paymentId of selectedPayments) {
        switch (bulkAction) {
          case 'approve':
            await approvePayment(paymentId);
            break;
          case 'reject':
            await rejectPayment(paymentId, 'Action en masse');
            break;
          case 'export':
            // Export sera géré séparément
            break;
        }
      }
      await loadPayments();
      setSelectedPayments([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const selectAllPayments = () => {
    if (selectedPayments.length === filteredAndSortedPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredAndSortedPayments.map(p => p.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedPayments = payments
    .filter((payment) => {
      const matchesSearch = payment.reference?.toLowerCase().includes(search.toLowerCase()) ||
                           payment.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           payment.id?.toString().includes(search) ||
                           payment.amount?.toString().includes(search);
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
      const matchesCurrency = filterCurrency === 'all' || payment.currency === filterCurrency;
      
      return matchesSearch && matchesStatus && matchesMethod && matchesCurrency;
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
      'approved': { text: 'Approuvé', class: 'bg-green-100 text-green-800 border-green-200' },
      'failed': { text: 'Échoué', class: 'bg-red-100 text-red-800 border-red-200' },
      'refunded': { text: 'Remboursé', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'cancelled': { text: 'Annulé', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'suspended': { text: 'Suspendu', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'processing': { text: 'En cours', class: 'bg-purple-100 text-purple-800 border-purple-200' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      'card': { text: 'Carte bancaire', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'paypal': { text: 'PayPal', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'stripe': { text: 'Stripe', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'bank_transfer': { text: 'Virement', class: 'bg-green-100 text-green-800 border-green-200' },
      'cash': { text: 'Espèces', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'crypto': { text: 'Cryptomonnaie', class: 'bg-orange-100 text-orange-800 border-orange-200' }
    };
    const config = methodConfig[method] || methodConfig['card'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getAmountBadge = (amount) => {
    const amountNum = parseFloat(amount) || 0;
    let config;
    
    if (amountNum >= 1000) {
      config = { class: 'bg-red-100 text-red-800 border-red-200' };
    } else if (amountNum >= 500) {
      config = { class: 'bg-orange-100 text-orange-800 border-orange-200' };
    } else if (amountNum >= 100) {
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
    const total = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').length;
    const approved = payments.filter(p => p.status === 'approved').length;
    const failed = payments.filter(p => p.status === 'failed').length;
    const refunded = payments.filter(p => p.status === 'refunded').length;
    const today = payments.filter(p => {
      const today = new Date();
      const paymentDate = new Date(p.createdAt);
      return paymentDate.toDateString() === today.toDateString();
    }).length;
    
    return { 
      total, 
      totalAmount, 
      pending, 
      approved, 
      failed, 
      refunded, 
      today 
    };
  };

  const stats = getStats(); 
  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faCreditCard} className="text-[#AD7C59]" /> Gestion des Paiements
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSortedPayments)}
            className="flex items-center gap-2 px-4 py-2 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
          >
            <FontAwesomeIcon icon={faDownload} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Total des paiements</p>
              <p className="text-2xl font-bold text-green-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faDollarSign} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Montant total</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalAmount.toFixed(2)} €</p>
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
              <p className="text-sm text-red-600 font-medium">Échoués</p>
              <p className="text-2xl font-bold text-red-800">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedPayments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedPayments.length} paiement(s) sélectionné(s)
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
              onClick={() => setSelectedPayments([])}
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
          <option value="approved">Approuvés</option>
          <option value="failed">Échoués</option>
          <option value="refunded">Remboursés</option>
          <option value="cancelled">Annulés</option>
          <option value="suspended">Suspendus</option>
          <option value="processing">En cours</option>
        </select>

        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes méthodes</option>
          <option value="card">Carte bancaire</option>
          <option value="paypal">PayPal</option>
          <option value="stripe">Stripe</option>
          <option value="bank_transfer">Virement</option>
          <option value="cash">Espèces</option>
          <option value="crypto">Cryptomonnaie</option>
        </select>

        <select
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes devises</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
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

      {/* Tableau des paiements */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === filteredAndSortedPayments.length && filteredAndSortedPayments.length > 0}
                  onChange={selectAllPayments}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Montant</th>
              <th className="py-2 px-4">Méthode</th>
              <th className="py-2 px-4">Référence</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#AD7C59]">Aucun paiement trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedPayments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => togglePaymentSelection(payment.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{payment.customer?.name}</div>
                        <div className="text-sm text-gray-500">{payment.customer?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getAmountBadge(payment.amount)}
                  </td>
                  <td className="py-2 px-4">
                    {getMethodBadge(payment.paymentMethod)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-800">
                        {payment.reference || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(payment.createdAt)}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(payment.createdAt)}</div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(payment)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(payment)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {payment.status === 'pending' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                            onClick={() => handleApprove(payment.id)}
                            disabled={actionLoading[payment.id]}
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleReject(payment)}
                            title="Rejeter"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      )}

                      {payment.status === 'approved' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                            onClick={() => handleRefund(payment)}
                            title="Rembourser"
                          >
                            <FontAwesomeIcon icon={faUndo} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                            onClick={() => handleSuspend(payment)}
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        </>
                      )}

                      {payment.status === 'suspended' && (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleActivate(payment.id)}
                          disabled={actionLoading[payment.id]}
                          title="Activer"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                        onClick={() => handleFlag(payment)}
                        title="Signaler"
                      >
                        <FontAwesomeIcon icon={faFlag} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(payment.id)}
                        disabled={actionLoading[payment.id]}
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
      {editPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Modifier le paiement</h3>
            <form onSubmit={submitEdit}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                <select
                  value={editForm.currency}
                  onChange={(e) => setEditForm({...editForm, currency: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
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
                  <option value="approved">Approuvé</option>
                  <option value="failed">Échoué</option>
                  <option value="refunded">Remboursé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="suspended">Suspendu</option>
                  <option value="processing">En cours</option>
                </select>
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
      {detailPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#AD7C59]">Détail du paiement</h3>
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
                  <div><span className="font-medium">ID:</span> {detailPayment.id}</div>
                  <div><span className="font-medium">Référence:</span> {detailPayment.reference || 'N/A'}</div>
                  <div><span className="font-medium">Statut:</span> {getStatusBadge(detailPayment.status)}</div>
                  <div><span className="font-medium">Méthode:</span> {getMethodBadge(detailPayment.paymentMethod)}</div>
                  <div><span className="font-medium">Montant:</span> {getAmountBadge(detailPayment.amount)}</div>
                  <div><span className="font-medium">Devise:</span> {detailPayment.currency}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Client</h4>
                <div className="space-y-2">
                  <div><span className="font-medium">Nom:</span> {detailPayment.customer?.name}</div>
                  <div><span className="font-medium">Email:</span> {detailPayment.customer?.email}</div>
                  <div><span className="font-medium">Téléphone:</span> {detailPayment.customer?.phone || 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Créé le:</span> {formatDateTime(detailPayment.createdAt)}</div>
                <div><span className="font-medium">Mis à jour le:</span> {formatDateTime(detailPayment.updatedAt)}</div>
              </div>
            </div>
            {detailPayment.notes && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                <p className="text-gray-600">{detailPayment.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Rejeter le paiement</h3>
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

      {/* Modal de remboursement */}
      {refundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Rembourser le paiement</h3>
            <form onSubmit={submitRefund}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant du remboursement</label>
                <input
                  type="number"
                  step="0.01"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({...refundForm, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du remboursement</label>
                <textarea
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})}
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
                  Rembourser
                </button>
                <button
                  type="button"
                  onClick={closeRefundModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'annulation */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Annuler le paiement</h3>
            <form onSubmit={submitCancel}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison de l'annulation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
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
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Fermer
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
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Suspendre le paiement</h3>
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
            <h3 className="text-lg font-bold text-[#AD7C59] mb-4">Signaler le paiement</h3>
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