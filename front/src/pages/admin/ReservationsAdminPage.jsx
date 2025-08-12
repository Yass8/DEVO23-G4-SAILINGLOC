import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, faSearch, faTrash, faEdit, faEye, faTimes, 
  faCheck, faBan, faClock, faUser, faShip, faMapMarkerAlt,
  faCalendar, faEuroSign, faStar, faFilter, faSort,
  faDownload, faExclamationTriangle, faCheckCircle, faTimesCircle,
  faHourglassHalf, faCalendarPlus, faCalendarMinus, faCalendarTimes,
  faFileInvoice, faCreditCard, faMoneyBillWave, faChartLine,
  faChartBar, faChartPie, faTable, faList, faThumbsUp,
  faThumbsDown, faFlag, faWarning, faLightbulb, faHistory,
  faBell, faEnvelope, faPhone, faFileAlt, faClipboardCheck,
  faClipboard, faReceipt, faCalculator, faPercent, faTag, faGift, faHandshake
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les réservations (simulé)
const fetchReservations = async () => {
  // Données simulées
  return [
    { id: 1, customer: 'Jean Dupont', boat: 'Voilier Élégance', startDate: '2024-01-20', endDate: '2024-01-25', status: 'confirmed' },
    { id: 2, customer: 'Marie Martin', boat: 'Catamaran Horizon', startDate: '2024-02-01', endDate: '2024-02-05', status: 'pending' },
    { id: 3, customer: 'Pierre Durand', boat: 'Moteur Rapide', startDate: '2024-01-30', endDate: '2024-02-02', status: 'cancelled' }
  ];
};

const updateReservation = async (id, data) => {
  console.log('Mise à jour de la réservation:', id, data);
  return { success: true, message: 'Réservation mise à jour avec succès' };
};

const deleteReservation = async (id) => {
  console.log('Suppression de la réservation:', id);
  return true;
};

const approveReservation = async (id) => {
  console.log('Approbation de la réservation:', id);
  return { success: true, message: 'Réservation approuvée avec succès' };
};

const rejectReservation = async (id, reason) => {
  console.log('Rejet de la réservation:', id, reason);
  return { success: true, message: 'Réservation rejetée avec succès' };
};

const cancelReservation = async (id, reason) => {
  console.log('Annulation de la réservation:', id, reason);
  return { success: true, message: 'Réservation annulée avec succès' };
};

const completeReservation = async (id) => {
  console.log('Finalisation de la réservation:', id);
  return { success: true, message: 'Réservation finalisée avec succès' };
};

const sendNotification = async (id, message) => {
  console.log('Envoi de notification pour la réservation:', id, message);
  return { success: true, message: 'Notification envoyée avec succès' };
};

const exportToCSV = (reservations) => {
  const csv = [
    ['ID', 'Client', 'Bateau', 'Date début', 'Date fin', 'Statut', 'Prix total', 'Commission', 'Date création'],
    ...reservations.map(r => [
      r.id,
      r.client?.name || 'N/A',
      r.boat?.name || 'N/A',
      formatDate(r.startDate),
      formatDate(r.endDate),
      r.status,
      formatPrice(r.totalPrice),
      formatPrice(r.commission),
      formatDate(r.createdAt)
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reservations.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReservationsAdminPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editReservation, setEditReservation] = useState(null);
  const [editForm, setEditForm] = useState({ 
    startDate: '', 
    endDate: '', 
    status: 'pending',
    totalPrice: '',
    commission: '',
    notes: '',
    specialRequests: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailReservation, setDetailReservation] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [notificationModal, setNotificationModal] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterBoat, setFilterBoat] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const data = await fetchReservations();
    setReservations(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette réservation ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteReservation(id);
    await loadReservations();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (reservation) => {
    setEditReservation(reservation);
    setEditForm({
      startDate: reservation.startDate ? reservation.startDate.split('T')[0] : '',
      endDate: reservation.endDate ? reservation.endDate.split('T')[0] : '',
      status: reservation.status || 'pending',
      totalPrice: reservation.totalPrice || '',
      commission: reservation.commission || '',
      notes: reservation.notes || '',
      specialRequests: reservation.specialRequests || ''
    });
  };

  const closeEditModal = () => {
    setEditReservation(null);
    setEditForm({ 
      startDate: '', 
      endDate: '', 
      status: 'pending',
      totalPrice: '',
      commission: '',
      notes: '',
      specialRequests: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateReservation(editReservation.id, editForm);
    await loadReservations();
    closeEditModal();
  };

  const handleDetail = (reservation) => setDetailReservation(reservation);
  const closeDetail = () => setDetailReservation(null);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await approveReservation(id);
    await loadReservations();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReject = (reservation) => {
    setRejectModal(reservation);
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
    await rejectReservation(rejectModal.id, rejectReason);
    await loadReservations();
    closeRejectModal();
    setActionLoading((prev) => ({ ...prev, [rejectModal.id]: false }));
  };

  const handleCancel = (reservation) => {
    setCancelModal(reservation);
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
    await cancelReservation(cancelModal.id, cancelReason);
    await loadReservations();
    closeCancelModal();
    setActionLoading((prev) => ({ ...prev, [cancelModal.id]: false }));
  };

  const handleComplete = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await completeReservation(id);
    await loadReservations();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleNotification = (reservation) => {
    setNotificationModal(reservation);
    setNotificationMessage('');
  };

  const closeNotificationModal = () => {
    setNotificationModal(null);
    setNotificationMessage('');
  };

  const submitNotification = async (e) => {
    e.preventDefault();
    if (!notificationMessage.trim()) {
      alert('Veuillez saisir un message');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [notificationModal.id]: true }));
    await sendNotification(notificationModal.id, notificationMessage);
    closeNotificationModal();
    setActionLoading((prev) => ({ ...prev, [notificationModal.id]: false }));
  };

  const handleBulkAction = async () => {
    if (selectedReservations.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedReservations.length} réservation(s) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const reservationId of selectedReservations) {
        switch (bulkAction) {
          case 'approve':
            await approveReservation(reservationId);
            break;
          case 'reject':
            await rejectReservation(reservationId, 'Action en masse');
            break;
          case 'cancel':
            await cancelReservation(reservationId, 'Action en masse');
            break;
          case 'complete':
            await completeReservation(reservationId);
            break;
        }
      }
      await loadReservations();
      setSelectedReservations([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleReservationSelection = (reservationId) => {
    setSelectedReservations(prev => 
      prev.includes(reservationId) 
        ? prev.filter(id => id !== reservationId)
        : [...prev, reservationId]
    );
  };

  const selectAllReservations = () => {
    if (selectedReservations.length === filteredAndSortedReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(filteredAndSortedReservations.map(r => r.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedReservations = reservations
    .filter((reservation) => {
      const matchesSearch = reservation.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           reservation.boat?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           reservation.id?.toString().includes(search) ||
                           reservation.client?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
      const matchesBoat = filterBoat === 'all' || reservation.boat?.id === filterBoat;
      const matchesClient = filterClient === 'all' || reservation.client?.id === filterClient;
      
      let matchesDate = true;
      if (filterDate !== 'all') {
        const today = new Date();
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        
        switch (filterDate) {
          case 'today':
            matchesDate = startDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDate = startDate <= weekFromNow;
            break;
          case 'month':
            const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            matchesDate = startDate <= monthFromNow;
            break;
          case 'past':
            matchesDate = endDate < today;
            break;
          case 'upcoming':
            matchesDate = startDate > today;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesBoat && matchesClient && matchesDate;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'price':
          aValue = parseFloat(a.totalPrice) || 0;
          bValue = parseFloat(b.totalPrice) || 0;
          break;
        case 'client':
          aValue = a.client?.name?.toLowerCase();
          bValue = b.client?.name?.toLowerCase();
          break;
        case 'boat':
          aValue = a.boat?.name?.toLowerCase();
          bValue = b.boat?.name?.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
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
      'approved': { text: 'Approuvée', class: 'bg-green-100 text-green-800 border-green-200' },
      'rejected': { text: 'Rejetée', class: 'bg-red-100 text-red-800 border-red-200' },
      'confirmed': { text: 'Confirmée', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'active': { text: 'Active', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'completed': { text: 'Terminée', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'cancelled': { text: 'Annulée', class: 'bg-red-100 text-red-800 border-red-200' },
      'expired': { text: 'Expirée', class: 'bg-orange-100 text-orange-800 border-orange-200' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { text: 'Faible', class: 'bg-green-100 text-green-800 border-green-200' },
      'medium': { text: 'Moyenne', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'high': { text: 'Élevée', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${config.class}`}>
        {config.text}
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

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour(s)`;
  };

  const getStats = () => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const approved = reservations.filter(r => r.status === 'approved').length;
    const active = reservations.filter(r => r.status === 'active').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    const totalRevenue = reservations.filter(r => r.status === 'completed').reduce((sum, r) => sum + (parseFloat(r.totalPrice) || 0), 0);
    const totalCommission = reservations.filter(r => r.status === 'completed').reduce((sum, r) => sum + (parseFloat(r.commission) || 0), 0);
    
    return { total, pending, approved, active, completed, cancelled, totalRevenue, totalCommission };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarCheck} className="text-[#AD7C59]" /> Gestion des Réservations
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSortedReservations)}
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
            <FontAwesomeIcon icon={faCalendarCheck} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total réservations</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
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
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faCheck} className="text-2xl text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Terminées</p>
              <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Revenus</p>
              <p className="text-2xl font-bold text-purple-800">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedReservations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedReservations.length} réservation(s) sélectionnée(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="approve">Approuver</option>
                <option value="reject">Rejeter</option>
                <option value="cancel">Annuler</option>
                <option value="complete">Terminer</option>
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
              onClick={() => setSelectedReservations([])}
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
          <option value="approved">Approuvées</option>
          <option value="confirmed">Confirmées</option>
          <option value="active">Actives</option>
          <option value="completed">Terminées</option>
          <option value="cancelled">Annulées</option>
          <option value="rejected">Rejetées</option>
        </select>

        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="past">Passées</option>
          <option value="upcoming">À venir</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="price">Trier par prix</option>
          <option value="client">Trier par client</option>
          <option value="boat">Trier par bateau</option>
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

      {/* Tableau des réservations */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedReservations.length === filteredAndSortedReservations.length && filteredAndSortedReservations.length > 0}
                  onChange={selectAllReservations}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Bateau</th>
              <th className="py-2 px-4">Dates</th>
              <th className="py-2 px-4">Durée</th>
              <th className="py-2 px-4">Prix total</th>
              <th className="py-2 px-4">Commission</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedReservations.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-[#AD7C59]">Aucune réservation trouvée.</td>
              </tr>
            ) : (
              filteredAndSortedReservations.map((reservation) => (
                <tr key={reservation.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation.id)}
                      onChange={() => toggleReservationSelection(reservation.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      #{reservation.id}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{reservation.client?.name}</div>
                        <div className="text-sm text-gray-500">{reservation.client?.email}</div>
                        <div className="text-xs text-gray-400">{reservation.client?.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faShip} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{reservation.boat?.name}</div>
                        <div className="text-sm text-gray-500">{reservation.boat?.type}</div>
                        <div className="text-xs text-gray-400">{reservation.boat?.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarPlus} className="text-green-600" />
                        <span>Début: {formatDate(reservation.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarMinus} className="text-red-600" />
                        <span>Fin: {formatDate(reservation.endDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-sm font-medium">
                      {calculateDuration(reservation.startDate, reservation.endDate)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faEuroSign} className="text-[#AD7C59]" />
                      <span className="font-semibold">{formatPrice(reservation.totalPrice)}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faPercent} className="text-[#AD7C59]" />
                      <span className="font-semibold">{formatPrice(reservation.commission)}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(reservation.status)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(reservation)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(reservation)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {reservation.status === 'pending' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                            onClick={() => handleApprove(reservation.id)}
                            disabled={actionLoading[reservation.id]}
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleReject(reservation)}
                            title="Rejeter"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        </>
                      )}

                      {reservation.status === 'confirmed' && (
                        <button
                          className="px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs"
                          onClick={() => handleComplete(reservation.id)}
                          disabled={actionLoading[reservation.id]}
                          title="Marquer comme terminée"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}

                      {['pending', 'approved', 'confirmed'].includes(reservation.status) && (
                        <button
                          className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                          onClick={() => handleCancel(reservation)}
                          title="Annuler"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition text-xs"
                        onClick={() => handleNotification(reservation)}
                        title="Envoyer notification"
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(reservation.id)}
                        disabled={actionLoading[reservation.id]}
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

      {/* Modals - Je vais les créer dans la suite */}
    </div>
  );
} 