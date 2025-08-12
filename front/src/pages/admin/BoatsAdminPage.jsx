import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faShip, faSearch, faTrash, faEdit, faEye, faTimes, 
  faPlus, faCheck, faBan, faImage, faMapMarkerAlt,
  faCalendar, faEuroSign, faUser, faStar, faFilter, faSort,
  faDownload, faExclamationTriangle, faClock, faAnchor,
  faShieldAlt, faFileAlt, faCamera, faTags, faWrench,
  faCalendarCheck, faCalendarTimes, faCalendarPlus, faCalendarMinus,
  faTools, faOilCan, faCog, faExclamationCircle, faInfoCircle,
  faCheckCircle, faTimesCircle, faQuestionCircle, faHistory,
  faChartLine, faChartBar, faChartPie, faTable, faList,
  faThumbsUp, faThumbsDown, faFlag, faWarning, faLightbulb
} from "@fortawesome/free-solid-svg-icons";

// Service pour récupérer les bateaux (simulé)
const fetchBoats = async () => {
  // Données simulées
  return [
    { id: 1, name: 'Voilier Élégance', type: 'Voilier', status: 'available', owner: 'Jean Dupont', price: '200€/jour' },
    { id: 2, name: 'Catamaran Horizon', type: 'Catamaran', status: 'booked', owner: 'Marie Martin', price: '350€/jour' },
    { id: 3, name: 'Moteur Rapide', type: 'Bateau à moteur', status: 'maintenance', owner: 'Pierre Durand', price: '150€/jour' }
  ];
};

const updateBoat = async (id, data) => {
  console.log('Mise à jour du bateau:', id, data);
  return { success: true, message: 'Bateau mis à jour avec succès' };
};

const deleteBoat = async (id) => {
  console.log('Suppression du bateau:', id);
  return true;
};

const approveBoat = async (id) => {
  console.log('Approbation du bateau:', id);
  return { success: true, message: 'Bateau approuvé avec succès' };
};

const rejectBoat = async (id, reason) => {
  console.log('Rejet du bateau:', id, reason);
  return { success: true, message: 'Bateau rejeté avec succès' };
};

const suspendBoat = async (id, reason) => {
  console.log('Suspension du bateau:', id, reason);
  return { success: true, message: 'Bateau suspendu avec succès' };
};

const activateBoat = async (id) => {
  console.log('Activation du bateau:', id);
  return { success: true, message: 'Bateau activé avec succès' };
};

const scheduleMaintenance = async (id, maintenanceData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/boats/${id}/maintenance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(maintenanceData)
    });
    if (!response.ok) throw new Error('Erreur lors de la planification de maintenance');
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

export default function BoatsAdminPage() {
  const [boats, setBoats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [editBoat, setEditBoat] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    location: '', 
    capacity: '', 
    type: 'voilier',
    status: 'pending',
    brand: '',
    model: '',
    year: '',
    length: '',
    width: '',
    draft: '',
    engine: '',
    fuelType: '',
    features: [],
    insurance: '',
    registration: '',
    maintenanceDate: '',
    notes: '',
    ownerId: '',
    portId: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [detailBoat, setDetailBoat] = useState(null);
  const [rejectBoatModal, setRejectBoatModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendBoatModal, setSuspendBoatModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [maintenanceModal, setMaintenanceModal] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'preventive',
    description: '',
    scheduledDate: '',
    estimatedDuration: '',
    estimatedCost: '',
    priority: 'medium',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterMaintenance, setFilterMaintenance] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedBoats, setSelectedBoats] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    loadBoats();
  }, []);

  const loadBoats = async () => {
    setLoading(true);
    const data = await fetchBoats();
    setBoats(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce bateau ? Cette action est irréversible.")) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await deleteBoat(id);
    await loadBoats();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleEdit = (boat) => {
    setEditBoat(boat);
    setEditForm({
      name: boat.name || '',
      description: boat.description || '',
      price: boat.price || '',
      location: boat.location || '',
      capacity: boat.capacity || '',
      type: boat.type || 'voilier',
      status: boat.status || 'pending',
      brand: boat.brand || '',
      model: boat.model || '',
      year: boat.year || '',
      length: boat.length || '',
      width: boat.width || '',
      draft: boat.draft || '',
      engine: boat.engine || '',
      fuelType: boat.fuelType || '',
      features: boat.features || [],
      insurance: boat.insurance || '',
      registration: boat.registration || '',
      maintenanceDate: boat.maintenanceDate || '',
      notes: boat.notes || '',
      ownerId: boat.ownerId || '',
      portId: boat.portId || ''
    });
  };

  const closeEditModal = () => {
    setEditBoat(null);
    setEditForm({ 
      name: '', 
      description: '', 
      price: '', 
      location: '', 
      capacity: '', 
      type: 'voilier',
      status: 'pending',
      brand: '',
      model: '',
      year: '',
      length: '',
      width: '',
      draft: '',
      engine: '',
      fuelType: '',
      features: [],
      insurance: '',
      registration: '',
      maintenanceDate: '',
      notes: '',
      ownerId: '',
      portId: ''
    });
    setEditLoading(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    await updateBoat(editBoat.id, editForm);
    await loadBoats();
    closeEditModal();
  };

  const handleDetail = (boat) => setDetailBoat(boat);
  const closeDetail = () => setDetailBoat(null);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await approveBoat(id);
    await loadBoats();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleReject = (boat) => {
    setRejectBoatModal(boat);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setRejectBoatModal(null);
    setRejectReason('');
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Veuillez indiquer une raison de rejet');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [rejectBoatModal.id]: true }));
    await rejectBoat(rejectBoatModal.id, rejectReason);
    await loadBoats();
    closeRejectModal();
    setActionLoading((prev) => ({ ...prev, [rejectBoatModal.id]: false }));
  };

  const handleSuspend = (boat) => {
    setSuspendBoatModal(boat);
    setSuspendReason('');
  };

  const closeSuspendModal = () => {
    setSuspendBoatModal(null);
    setSuspendReason('');
  };

  const submitSuspend = async (e) => {
    e.preventDefault();
    if (!suspendReason.trim()) {
      alert('Veuillez indiquer une raison de suspension');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [suspendBoatModal.id]: true }));
    await suspendBoat(suspendBoatModal.id, suspendReason);
    await loadBoats();
    closeSuspendModal();
    setActionLoading((prev) => ({ ...prev, [suspendBoatModal.id]: false }));
  };

  const handleActivate = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    await activateBoat(id);
    await loadBoats();
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleMaintenance = (boat) => {
    setMaintenanceModal(boat);
    setMaintenanceForm({
      type: 'preventive',
      description: '',
      scheduledDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      priority: 'medium',
      notes: ''
    });
  };

  const closeMaintenanceModal = () => {
    setMaintenanceModal(null);
    setMaintenanceForm({
      type: 'preventive',
      description: '',
      scheduledDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      priority: 'medium',
      notes: ''
    });
  };

  const submitMaintenance = async (e) => {
    e.preventDefault();
    if (!maintenanceForm.description.trim() || !maintenanceForm.scheduledDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [maintenanceModal.id]: true }));
    await scheduleMaintenance(maintenanceModal.id, maintenanceForm);
    await loadBoats();
    closeMaintenanceModal();
    setActionLoading((prev) => ({ ...prev, [maintenanceModal.id]: false }));
  };

  const handleBulkAction = async () => {
    if (selectedBoats.length === 0 || !bulkAction) return;
    
    const action = window.confirm(`Voulez-vous vraiment ${bulkAction} ${selectedBoats.length} bateau(x) ?`);
    if (!action) return;

    setActionLoading((prev) => ({ ...prev, bulk: true }));
    
    try {
      for (const boatId of selectedBoats) {
        switch (bulkAction) {
          case 'approve':
            await approveBoat(boatId);
            break;
          case 'suspend':
            await updateBoat(boatId, { status: 'suspended' });
            break;
          case 'activate':
            await activateBoat(boatId);
            break;
          case 'delete':
            await deleteBoat(boatId);
            break;
        }
      }
      await loadBoats();
      setSelectedBoats([]);
      setBulkAction('');
    } catch (error) {
      alert('Erreur lors de l\'action en masse');
    } finally {
      setActionLoading((prev) => ({ ...prev, bulk: false }));
    }
  };

  const toggleBoatSelection = (boatId) => {
    setSelectedBoats(prev => 
      prev.includes(boatId) 
        ? prev.filter(id => id !== boatId)
        : [...prev, boatId]
    );
  };

  const selectAllBoats = () => {
    if (selectedBoats.length === filteredAndSortedBoats.length) {
      setSelectedBoats([]);
    } else {
      setSelectedBoats(filteredAndSortedBoats.map(b => b.id));
    }
  };

  // Filtrage et tri
  const filteredAndSortedBoats = boats
    .filter((boat) => {
      const matchesSearch = boat.name?.toLowerCase().includes(search.toLowerCase()) ||
                           boat.brand?.toLowerCase().includes(search.toLowerCase()) ||
                           boat.model?.toLowerCase().includes(search.toLowerCase()) ||
                           boat.location?.toLowerCase().includes(search.toLowerCase()) ||
                           boat.owner?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || boat.status === filterStatus;
      const matchesType = filterType === 'all' || boat.type === filterType;
      const matchesLocation = filterLocation === 'all' || boat.location === filterLocation;
      const matchesMaintenance = filterMaintenance === 'all' || 
        (filterMaintenance === 'due' && boat.maintenanceDate && new Date(boat.maintenanceDate) <= new Date()) ||
        (filterMaintenance === 'scheduled' && boat.maintenanceDate && new Date(boat.maintenanceDate) > new Date());
      
      return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesMaintenance;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'price':
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
          break;
        case 'name':
          aValue = a.name?.toLowerCase();
          bValue = b.name?.toLowerCase();
          break;
        case 'rating':
          aValue = parseFloat(a.rating) || 0;
          bValue = parseFloat(b.rating) || 0;
          break;
        case 'maintenance':
          aValue = new Date(a.maintenanceDate || 0);
          bValue = new Date(b.maintenanceDate || 0);
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
      'active': { text: 'Actif', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'suspended': { text: 'Suspendu', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'maintenance': { text: 'Maintenance', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'inactive': { text: 'Inactif', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      'rented': { text: 'En location', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
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
      'voilier': { text: 'Voilier', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      'moteur': { text: 'Moteur', class: 'bg-green-100 text-green-800 border-green-200' },
      'catamaran': { text: 'Catamaran', class: 'bg-purple-100 text-purple-800 border-purple-200' },
      'yacht': { text: 'Yacht', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'pneumatique': { text: 'Pneumatique', class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'jet-ski': { text: 'Jet-Ski', class: 'bg-pink-100 text-pink-800 border-pink-200' }
    };
    const config = typeConfig[type] || typeConfig['voilier'];
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getMaintenanceBadge = (maintenanceDate) => {
    if (!maintenanceDate) return null;
    
    const date = new Date(maintenanceDate);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return (
        <span className="inline-block px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
          En retard
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="inline-block px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
          <FontAwesomeIcon icon={faWarning} className="mr-1" />
          Bientôt dû
        </span>
      );
    } else {
      return (
        <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
          À jour
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const exportToCSV = () => {
    const csv = [
      ['ID', 'Nom', 'Type', 'Propriétaire', 'Localisation', 'Prix', 'Statut', 'Note', 'Maintenance', 'Date création'],
      ...filteredAndSortedBoats.map(b => [
        b.id,
        b.name,
        b.type,
        b.owner?.name || 'N/A',
        b.location,
        formatPrice(b.price),
        b.status,
        b.rating || 'N/A',
        b.maintenanceDate ? formatDate(b.maintenanceDate) : 'N/A',
        formatDate(b.createdAt)
      ])
    ].map(row => row.join(';')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bateaux.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = boats.length;
    const pending = boats.filter(b => b.status === 'pending').length;
    const approved = boats.filter(b => b.status === 'approved').length;
    const active = boats.filter(b => b.status === 'active').length;
    const maintenance = boats.filter(b => b.status === 'maintenance').length;
    const rented = boats.filter(b => b.status === 'rented').length;
    const revenue = boats.filter(b => b.status === 'rented').reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    
    return { total, pending, approved, active, maintenance, rented, revenue };
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-900">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#AD7C59] flex items-center gap-2">
          <FontAwesomeIcon icon={faShip} className="text-[#AD7C59]" /> Gestion des Bateaux
        </h1>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
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
            <FontAwesomeIcon icon={faShip} className="text-2xl text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total bateaux</p>
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
              <p className="text-sm text-green-600 font-medium">Actifs</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTools} className="text-2xl text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Maintenance</p>
              <p className="text-2xl font-bold text-purple-800">{stats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedBoats.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedBoats.length} bateau(x) sélectionné(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir une action</option>
                <option value="approve">Approuver</option>
                <option value="suspend">Suspendre</option>
                <option value="activate">Activer</option>
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
              onClick={() => setSelectedBoats([])}
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
          <option value="active">Actifs</option>
          <option value="suspended">Suspendus</option>
          <option value="maintenance">Maintenance</option>
          <option value="inactive">Inactifs</option>
          <option value="rented">En location</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Tous types</option>
          <option value="voilier">Voiliers</option>
          <option value="moteur">Moteurs</option>
          <option value="catamaran">Catamarans</option>
          <option value="yacht">Yachts</option>
          <option value="pneumatique">Pneumatiques</option>
          <option value="jet-ski">Jet-Skis</option>
        </select>

        <select
          value={filterMaintenance}
          onChange={(e) => setFilterMaintenance(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="all">Toute maintenance</option>
          <option value="due">Maintenance due</option>
          <option value="scheduled">Maintenance planifiée</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] focus:outline-none focus:ring-2 focus:ring-[#AD7C59]"
        >
          <option value="date">Trier par date</option>
          <option value="price">Trier par prix</option>
          <option value="name">Trier par nom</option>
          <option value="rating">Trier par note</option>
          <option value="maintenance">Trier par maintenance</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center gap-2 px-3 py-2 border border-[#AD7C59] rounded-lg text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition"
        >
          <FontAwesomeIcon icon={faSort} />
          {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
        </button>
      </div>

      {/* Tableau des bateaux */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left text-[#AD7C59]">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedBoats.length === filteredAndSortedBoats.length && filteredAndSortedBoats.length > 0}
                  onChange={selectAllBoats}
                  className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                />
              </th>
              <th className="py-2 px-4">Bateau</th>
              <th className="py-2 px-4">Propriétaire</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Localisation</th>
              <th className="py-2 px-4">Prix</th>
              <th className="py-2 px-4">Note</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Maintenance</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-[#AD7C59]">Chargement...</td>
              </tr>
            ) : filteredAndSortedBoats.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-[#AD7C59]">Aucun bateau trouvé.</td>
              </tr>
            ) : (
              filteredAndSortedBoats.map((boat) => (
                <tr key={boat.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedBoats.includes(boat.id)}
                      onChange={() => toggleBoatSelection(boat.id)}
                      className="rounded border-[#AD7C59] text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faShip} className="text-[#AD7C59] text-lg" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#AD7C59]">{boat.name}</div>
                        <div className="text-sm text-gray-500">{boat.brand} {boat.model}</div>
                        <div className="text-xs text-gray-400">Capacité: {boat.capacity} pers.</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-[#AD7C59]" />
                      <span>{boat.owner?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getTypeBadge(boat.type)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#AD7C59]" />
                      <span>{boat.location}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faEuroSign} className="text-[#AD7C59]" />
                      <span className="font-semibold">{formatPrice(boat.price)}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                      <span>{boat.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {getStatusBadge(boat.status)}
                  </td>
                  <td className="py-2 px-4">
                    {getMaintenanceBadge(boat.maintenanceDate)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDetail(boat)}
                        title="Voir le détail"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleEdit(boat)}
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      
                      {/* Actions selon le statut */}
                      {boat.status === 'pending' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                            onClick={() => handleApprove(boat.id)}
                            disabled={actionLoading[boat.id]}
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition text-xs"
                            onClick={() => handleReject(boat)}
                            title="Rejeter"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        </>
                      )}

                      {boat.status === 'suspended' && (
                        <button
                          className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition text-xs"
                          onClick={() => handleActivate(boat.id)}
                          disabled={actionLoading[boat.id]}
                          title="Activer"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                      {boat.status === 'active' && (
                        <>
                          <button
                            className="px-2 py-1 rounded border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition text-xs"
                            onClick={() => handleSuspend(boat)}
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                          <button
                            className="px-2 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition text-xs"
                            onClick={() => handleMaintenance(boat)}
                            title="Planifier maintenance"
                          >
                            <FontAwesomeIcon icon={faTools} />
                          </button>
                        </>
                      )}

                      <button
                        className="px-2 py-1 rounded border border-[#AD7C59] text-[#AD7C59] hover:bg-[#AD7C59] hover:text-white transition text-xs"
                        onClick={() => handleDelete(boat.id)}
                        disabled={actionLoading[boat.id]}
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