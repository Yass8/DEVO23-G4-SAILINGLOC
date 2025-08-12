import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, faSearch, faTrash, faEdit, faEye, faTimes, 
  faCheck, faBan, faClock, faUser, faShip, faThumbsUp,
  faCalendar, faFilter, faSort, faDownload, faExclamationTriangle,
  faCheckCircle, faTimesCircle, faHourglassHalf, faFlag,
  faChartLine, faChartBar, faChartPie, faTable, faList,
  faLightbulb, faHistory, faBell, faEnvelope, faPhone,
  faFileAlt, faClipboardCheck, faClipboard, faReceipt, faCalculator, faPercent,
  faTag, faGift, faHandshake, faShieldAlt, faEyeSlash,
  faComment
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les avis (simulé)
const fetchReviews = async () => {
  // Données simulées
  return [
    { id: 1, customer: 'Jean Dupont', boat: 'Voilier Élégance', rating: 5, comment: 'Excellent service !', status: 'approved', date: '2024-01-15' },
    { id: 2, customer: 'Marie Martin', boat: 'Catamaran Horizon', rating: 4, comment: 'Très satisfaite', status: 'pending', date: '2024-01-16' },
    { id: 3, customer: 'Pierre Durand', boat: 'Moteur Rapide', rating: 3, comment: 'Correct mais peut mieux faire', status: 'rejected', date: '2024-01-17' }
  ];
};

const updateReview = async (id, data) => {
  console.log('Mise à jour de l\'avis:', id, data);
  return { success: true, message: 'Avis mis à jour avec succès' };
};

const deleteReview = async (id) => {
  console.log('Suppression de l\'avis:', id);
  return true;
};

const approveReview = async (id) => {
  console.log('Approbation de l\'avis:', id);
  return { success: true, message: 'Avis approuvé avec succès' };
};

const rejectReview = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Erreur lors du rejet');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const flagReview = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/flag`, {
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

const hideReview = async (id, reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/hide`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Erreur lors de la masquage');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const showReview = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/show`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Erreur lors de l\'affichage');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const sendNotification = async (id, message) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Erreur lors de l\'envoi de la notification');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

const exportToCSV = (reviews) => {
  const csv = [
    ['ID', 'Client', 'Bateau', 'Note', 'Commentaire', 'Statut', 'Date création', 'Date approbation'],
    ...reviews.map(r => [
      r.id,
      r.client?.name || 'N/A',
      r.boat?.name || 'N/A',
      r.rating,
      r.comment?.substring(0, 50) + '...' || 'N/A',
      r.status,
      formatDate(r.createdAt),
      r.approvedAt ? formatDate(r.approvedAt) : 'N/A'
    ])
  ].map(row => row.join(';')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'avis.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editReview, setEditReview] = useState(null);
  const [editForm, setEditForm] = useState({ 
    rating: 5,
    comment: '',
    status: 'pending',
    notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailReview, setDetailReview] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [flagModal, setFlagModal] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [hideModal, setHideModal] = useState(null);
  const [hideReason, setHideReason] = useState('');
  const [notificationModal, setNotificationModal] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterBoat, setFilterBoat] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await fetchReviews();
    setReviews(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet avis ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteReview(id);
    await loadReviews();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setEditForm({
      rating: review.rating || 5,
      comment: review.comment || '',
      status: review.status || 'pending',
      notes: review.notes || ''
    });
  };

  const closeEditModal = () => {
    setEditReview(null);
    setEditForm({ 
      rating: 5,
      comment: '',
      status: 'pending',
      notes: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateReview(editReview.id, editForm);
    await loadReviews();
    closeEditModal();
  };

  const handleDetail = (review) => setDetailReview(review);
  const closeDetail = () => setDetailReview(null);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await approveReview(id);
    await loadReviews();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReject = (review) => {
    setRejectModal(review);
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
    await rejectReview(rejectModal.id, rejectReason);
    await loadReviews();
    closeRejectModal();
    setActionLoading((prev) => ({ ...prev, [rejectModal.id]: false }));
  };

  const handleFlag = (review) => {
    setFlagModal(review);
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
    await flagReview(flagModal.id, flagReason);
    await loadReviews();
    closeFlagModal();
    setActionLoading((prev) => ({ ...prev, [flagModal.id]: false }));
  };

  const handleHide = (review) => {
    setHideModal(review);
    setHideReason('');
  };

  const closeHideModal = () => {
    setHideModal(null);
    setHideReason('');
  };

  const submitHide = async (e) => {
    e.preventDefault();
    if (!hideReason.trim()) {
      alert('Veuillez indiquer une raison de masquage');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [hideModal.id]: true }));
    await hideReview(hideModal.id, hideReason);
    await loadReviews();
    closeHideModal();
    setActionLoading((prev) => ({ ...prev, [hideModal.id]: false }));
  };

  const handleShow = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await showReview(id);
    await loadReviews();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleNotification = (review) => {
    setNotificationModal(review);
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
    if (selectedReviews.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedReviews.length} avis ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const reviewId of selectedReviews) {
        switch (bulkAction) {
          case 'approve':
            await approveReview(reviewId);
            break;
          case 'reject':
            await rejectReview(reviewId, 'Action en masse');
            break;
          case 'hide':
            await hideReview(reviewId, 'Action en masse');
            break;
          case 'delete':
            await deleteReview(reviewId);
            break;
        }
      }
      await loadReviews();
      setSelectedReviews([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleReviewSelection = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const selectAllReviews = () => {
    if (selectedReviews.length === filteredAndSortedReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredAndSortedReviews.map(r => r.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      const matchesSearch = review.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           review.boat?.name?.toLowerCase().includes(search.toLowerCase()) ||
                           review.comment?.toLowerCase().includes(search.toLowerCase()) ||
                           review.id?.toString().includes(search);
      const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
      const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
      const matchesBoat = filterBoat === 'all' || review.boat?.id === filterBoat;
      const matchesClient = filterClient === 'all' || review.client?.id === filterClient;
      
      return matchesSearch && matchesStatus && matchesRating && matchesBoat && matchesClient;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'rating':
          aValue = parseFloat(a.rating) || 0;
          bValue = parseFloat(b.rating) || 0;
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
      'rejected': { text: 'Rejeté', class: 'bg-red-100 text-red-800 border-red-200' },
      'flagged': { text: 'Signalé', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'hidden': { text: 'Masqué', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'spam': { text: 'Spam', class: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`text-sm ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating}/5
        </span>
      </div>
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

  const getStats = () => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const approved = reviews.filter(r => r.status === 'approved').length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;
    const flagged = reviews.filter(r => r.status === 'flagged').length;
    const hidden = reviews.filter(r => r.status === 'hidden').length;
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;
    const positiveReviews = reviews.filter(r => (r.rating || 0) >= 4).length;
    const negativeReviews = reviews.filter(r => (r.rating || 0) <= 2).length;
    
    return { 
      total, 
      pending, 
      approved, 
      rejected, 
      flagged, 
      hidden, 
      averageRating, 
      positiveReviews, 
      negativeReviews 
    };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faStar} className="text-[#AD7C59]" /> Gestion des Avis
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSortedReviews)}
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
            <FontAwesomeIcon icon={faStar} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total avis</p>
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
              <p className="text-sm text-green-600 font-medium">Note moyenne</p>
              <p className="text-2xl font-bold text-green-800">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faThumbsUp} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Avis positifs</p>
              <p className="text-2xl font-bold text-purple-800">{stats.positiveReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedReviews.length} avis sélectionné(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="approve">Approuver</option>
                <option value="reject">Rejeter</option>
                <option value="hide">Masquer</option>
                <option value="delete">Supprimer</option>
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
              onClick={() => setSelectedReviews([])}
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
          <option value="rejected">Rejetés</option>
          <option value="flagged">Signalés</option>
          <option value="hidden">Masqués</option>
          <option value="spam">Spam</option>
        </select>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toutes notes</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="rating">Trier par note</option>
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

      {/* Tableau des avis */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.length === filteredAndSortedReviews.length && filteredAndSortedReviews.length > 0}
                  onChange={selectAllReviews}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Client</th>
              <th className="py-2 px-4">Bateau</th>
              <th className="py-2 px-4">Note</th>
              <th className="py-2 px-4">Commentaire</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedReviews.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-[#AD7C59]">Aucun avis trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedReviews.map((review) => (
                <tr key={review.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => toggleReviewSelection(review.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      #{review.id}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{review.client?.name}</div>
                        <div className="text-sm text-gray-500">{review.client?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faShip} className="text-[#AD7C59]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{review.boat?.name}</div>
                        <div className="text-sm text-gray-500">{review.boat?.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getRatingStars(review.rating)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {review.comment || 'Aucun commentaire'}
                      </p>
                      {review.comment && review.comment.length > 100 && (
                        <button
                          onClick={() => handleDetail(review)}
                          className="text-xs text-[#AD7C59] hover:underline mt-1"
                        >
                          Voir plus...
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(review.status)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(review.createdAt)}</div>
                      {review.approvedAt && (
                        <div className="text-xs text-gray-500">
                          Approuvé: {formatDate(review.approvedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(review)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(review)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {review.status === 'pending' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                            onClick={() => handleApprove(review.id)}
                            disabled={actionLoading[review.id]}
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleReject(review)}
                            title="Rejeter"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        </>
                      )}

                      {review.status === 'approved' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                            onClick={() => handleFlag(review)}
                            title="Signaler"
                          >
                            <FontAwesomeIcon icon={faFlag} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white transition text-xs"
                            onClick={() => handleHide(review)}
                            title="Masquer"
                          >
                            <FontAwesomeIcon icon={faEyeSlash} />
                          </button>
                        </>
                      )}

                      {review.status === 'hidden' && (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleShow(review.id)}
                          disabled={actionLoading[review.id]}
                          title="Afficher"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition text-xs"
                        onClick={() => handleNotification(review)}
                        title="Envoyer notification"
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </button>

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(review.id)}
                        disabled={actionLoading[review.id]}
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