import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  faShip,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faDownload,
  faPlus,
  faImage,
  faUser,
  faCalendar,
  faEuroSign,
  faStar,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faBan,
  faCheck,
  faClock,
  faTimes,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import Preloader from '../../components/common/Preloader';

const BoatsAdmin = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPort, setFilterPort] = useState('all');
  const [selectedBoats, setSelectedBoats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalBoat, setModalBoat] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [boatsPerPage] = useState(10);

  const navigate = useNavigate();

  // Données simulées pour le développement
  useEffect(() => {
    const mockBoats = [
      {
        id: 1,
        name: 'Ocean Explorer',
        type: 'Voilier',
        port: 'Marseille',
        owner: {
          name: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78'
        },
        status: 'active',
        price: 150,
        rating: 4.8,
        reviews: 24,
        photos: 8,
        createdAt: '2024-01-15',
        lastReservation: '2024-01-20',
        totalReservations: 15,
        totalRevenue: 2250,
        verified: true
      },
      {
        id: 2,
        name: 'Sea Breeze',
        type: 'Catamaran',
        port: 'Nice',
        owner: {
          name: 'Marie Martin',
          email: 'marie.martin@email.com',
          phone: '+33 6 98 76 54 32'
        },
        status: 'pending',
        price: 200,
        rating: 4.5,
        reviews: 18,
        photos: 6,
        createdAt: '2024-01-10',
        lastReservation: '2024-01-18',
        totalReservations: 12,
        totalRevenue: 2400,
        verified: false
      },
      {
        id: 3,
        name: 'Blue Horizon',
        type: 'Moteur',
        port: 'Cannes',
        owner: {
          name: 'Pierre Bernard',
          email: 'pierre.bernard@email.com',
          phone: '+33 6 11 22 33 44'
        },
        status: 'suspended',
        price: 180,
        rating: 4.2,
        reviews: 31,
        photos: 12,
        createdAt: '2024-01-05',
        lastReservation: '2024-01-15',
        totalReservations: 28,
        totalRevenue: 5040,
        verified: true
      },
      {
        id: 4,
        name: 'Wind Spirit',
        type: 'Voilier',
        port: 'Toulon',
        owner: {
          name: 'Sophie Petit',
          email: 'sophie.petit@email.com',
          phone: '+33 6 55 66 77 88'
        },
        status: 'active',
        price: 120,
        rating: 4.9,
        reviews: 42,
        photos: 15,
        createdAt: '2024-01-12',
        lastReservation: '2024-01-22',
        totalReservations: 35,
        totalRevenue: 4200,
        verified: true
      },
      {
        id: 5,
        name: 'Royal Yacht',
        type: 'Yacht',
        port: 'Monaco',
        owner: {
          name: 'Lucas Moreau',
          email: 'lucas.moreau@email.com',
          phone: '+33 6 99 88 77 66'
        },
        status: 'active',
        price: 500,
        rating: 4.7,
        reviews: 15,
        photos: 20,
        createdAt: '2024-01-08',
        lastReservation: '2024-01-21',
        totalReservations: 8,
        totalRevenue: 4000,
        verified: true
      }
    ];

    setTimeout(() => {
      setBoats(mockBoats);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des bateaux
  const filteredBoats = boats.filter(boat => {
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boat.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boat.port.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || boat.status === filterStatus;
    const matchesType = filterType === 'all' || boat.type === filterType;
    const matchesPort = filterPort === 'all' || boat.port === filterPort;
    
    return matchesSearch && matchesStatus && matchesType && matchesPort;
  });

  // Pagination
  const indexOfLastBoat = currentPage * boatsPerPage;
  const indexOfFirstBoat = indexOfLastBoat - boatsPerPage;
  const currentBoats = filteredBoats.slice(indexOfFirstBoat, indexOfLastBoat);
  const totalPages = Math.ceil(filteredBoats.length / boatsPerPage);

  // Gestion de la sélection multiple
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBoats(currentBoats.map(boat => boat.id));
    } else {
      setSelectedBoats([]);
    }
  };

  const handleSelectBoat = (boatId, checked) => {
    if (checked) {
      setSelectedBoats([...selectedBoats, boatId]);
    } else {
      setSelectedBoats(selectedBoats.filter(id => id !== boatId));
    }
  };

  // Actions sur les bateaux
  const handleViewBoat = (boat) => {
    setModalBoat(boat);
    setShowModal(true);
  };

  const handleEditBoat = (boatId) => {
    Swal.fire({
      title: 'Modifier le bateau ?',
      text: "Vous allez être redirigé vers le formulaire d'édition",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#AD7C59',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/admin/sl/boats/${boatId}/edit`);
      }
    });
  };

  const handleDeleteBoat = (boatId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AD7C59',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setBoats(boats.filter(boat => boat.id !== boatId));
        setSelectedBoats(selectedBoats.filter(id => id !== boatId));
        
        Swal.fire(
          'Supprimé !',
          'Le bateau a été supprimé avec succès.',
          'success'
        );
      }
    });
  };

  const handleApproveBoat = (boatId) => {
    Swal.fire({
      title: 'Approuver le bateau ?',
      text: "Le bateau sera visible pour les utilisateurs",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, approuver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setBoats(boats.map(boat => 
          boat.id === boatId 
            ? { ...boat, status: 'active' }
            : boat
        ));
        
        Swal.fire(
          'Approuvé !',
          'Le bateau a été approuvé avec succès.',
          'success'
        );
      }
    });
  };

  const handleSuspendBoat = (boatId) => {
    Swal.fire({
      title: 'Suspendre le bateau ?',
      text: "Le bateau ne sera plus visible pour les utilisateurs",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F59E0B',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, suspendre',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        setBoats(boats.map(boat => 
          boat.id === boatId 
            ? { ...boat, status: 'suspended' }
            : boat
        ));
        
        Swal.fire(
          'Suspendu !',
          'Le bateau a été suspendu avec succès.',
          'success'
        );
      }
    });
  };

  const handleBulkAction = (action) => {
    if (selectedBoats.length === 0) return;

    let actionText = '';
    let actionIcon = '';
    let confirmColor = '';

    switch (action) {
      case 'approve':
        actionText = 'approuver';
        actionIcon = 'question';
        confirmColor = '#10B981';
        break;
      case 'suspend':
        actionText = 'suspendre';
        actionIcon = 'warning';
        confirmColor = '#F59E0B';
        break;
      case 'delete':
        actionText = 'supprimer';
        actionIcon = 'warning';
        confirmColor = '#EF4444';
        break;
      default:
        return;
    }

    Swal.fire({
      title: `Êtes-vous sûr ?`,
      text: `Vous allez ${actionText} ${selectedBoats.length} bateau(x)`,
      icon: actionIcon,
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Oui, ${actionText}`,
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        switch (action) {
          case 'approve':
            setBoats(boats.map(boat => 
              selectedBoats.includes(boat.id) 
                ? { ...boat, status: 'active' }
                : boat
            ));
            break;
          case 'suspend':
            setBoats(boats.map(boat => 
              selectedBoats.includes(boat.id) 
                ? { ...boat, status: 'suspended' }
                : boat
            ));
            break;
          case 'delete':
            setBoats(boats.filter(boat => !selectedBoats.includes(boat.id)));
            setSelectedBoats([]);
            break;
          default:
            break;
        }
        
        Swal.fire(
          'Action effectuée !',
          `${selectedBoats.length} bateau(x) ${actionText}(s) avec succès.`,
          'success'
        );
      }
    });
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Nom', 'Type', 'Port', 'Propriétaire', 'Statut', 'Prix', 'Note', 'Avis', 'Réservations', 'Revenus'];
    const csvContent = [
      headers.join(','),
      ...filteredBoats.map(boat => [
        boat.id,
        boat.name,
        boat.type,
        boat.port,
        boat.owner.name,
        boat.status,
        boat.price,
        boat.rating,
        boat.reviews,
        boat.totalReservations,
        boat.totalRevenue
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boats_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Composant pour le statut
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { color: 'bg-[var(--color-sage-green)] text-[var(--color-slate-blue)]', icon: faCheckCircle, label: 'Actif' },
      pending: { color: 'bg-[var(--color-pale-blue)] text-[var(--color-slate-blue)]', icon: faClock, label: 'En attente' },
      suspended: { color: 'bg-[var(--color-mocha)] text-white', icon: faBan, label: 'Suspendu' }
    };
    
    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Composant pour la vérification
  // Supprimé - plus de statuts secondaires

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/sl')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Retour au dashboard"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-slate-blue)]">Gestion des Bateaux</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez le catalogue des bateaux, validez les annonces et modérez le contenu
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => {
              console.log('Bouton Nouveau bateau cliqué');
              Swal.fire({
                title: 'Créer un nouveau bateau ?',
                text: "Vous allez être redirigé vers le formulaire de création",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#AD7C59',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Oui, continuer',
                cancelButtonText: 'Annuler'
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate('/admin/sl/boats/add');
                }
              });
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#AD7C59] hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nouveau bateau
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
              placeholder="Rechercher un bateau..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
            />
          </div>

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
          </select>

          {/* Filtre par type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les types</option>
            <option value="Voilier">Voilier</option>
            <option value="Catamaran">Catamaran</option>
            <option value="Moteur">Moteur</option>
            <option value="Yacht">Yacht</option>
          </select>

          {/* Filtre par port */}
          <select
            value={filterPort}
            onChange={(e) => setFilterPort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
          >
            <option value="all">Tous les ports</option>
            <option value="Marseille">Marseille</option>
            <option value="Nice">Nice</option>
            <option value="Cannes">Cannes</option>
            <option value="Toulon">Toulon</option>
            <option value="Monaco">Monaco</option>
          </select>

          {/* Actions en lot */}
          {selectedBoats.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-2 text-sm text-[var(--color-sage-green)] hover:text-[var(--color-slate-blue)]"
              >
                Approuver
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-2 text-sm text-[var(--color-mocha)] hover:text-[var(--color-slate-blue)]"
              >
                Suspendre
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 text-sm text-[var(--color-mocha)] hover:text-[var(--color-slate-blue)]"
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
              <FontAwesomeIcon icon={faShip} className="w-8 h-8 text-[#AD7C59]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total bateaux</dt>
                <dd className="text-lg font-medium text-gray-900">{boats.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8 text-[var(--color-sage-green)]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-[var(--color-slate-blue)] truncate">Bateaux actifs</dt>
                <dd className="text-lg font-medium text-[var(--color-slate-blue)]">{boats.filter(b => b.status === 'active').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faClock} className="w-8 h-8 text-[var(--color-pale-blue)]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-[var(--color-slate-blue)] truncate">En attente</dt>
                <dd className="text-lg font-medium text-[var(--color-slate-blue)]">{boats.filter(b => b.status === 'pending').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
                                  <FontAwesomeIcon icon={faStar} className="w-8 h-8 text-[#AD7C59]" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Moyenne notes</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {(boats.reduce((acc, boat) => acc + boat.rating, 0) / boats.length).toFixed(1)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Table des bateaux */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBoats.length === currentBoats.length && currentBoats.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bateau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix/Jour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBoats.map((boat) => (
                  <tr key={boat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBoats.includes(boat.id)}
                        onChange={(e) => handleSelectBoat(boat.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#AD7C59] focus:ring-[#AD7C59]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-[#AD7C59] flex items-center justify-center">
                            <FontAwesomeIcon icon={faShip} className="text-white text-lg" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {boat.name}
                          </div>
                          <div className="text-sm text-gray-500">{boat.type} • {boat.port}</div>
                          <div className="text-xs text-gray-400">
                            <FontAwesomeIcon icon={faImage} className="w-3 h-3 mr-1" />
                            {boat.photos} photos
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{boat.owner.name}</div>
                        <div className="text-sm text-gray-500">{boat.owner.email}</div>
                        <div className="text-xs text-gray-400">{boat.owner.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={boat.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {boat.price} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faStar} className="w-8 h-8 text-[#AD7C59]" />
                        <span className="text-lg font-semibold text-gray-900">{boat.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewBoat(boat)}
                          className="text-[#AD7C59] hover:text-[#9B6B47]"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditBoat(boat.id)}
                          className="text-[var(--color-slate-blue)] hover:text-[var(--color-mocha)]"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        {boat.status === 'pending' && (
                          <button
                            onClick={() => handleApproveBoat(boat.id)}
                            className="text-[var(--color-sage-green)] hover:text-[var(--color-slate-blue)]"
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {boat.status === 'active' && (
                          <button
                            onClick={() => handleSuspendBoat(boat.id)}
                            className="text-[var(--color-pale-blue)] hover:text-[var(--color-slate-blue)]"
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faBan} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBoat(boat.id)}
                          className="text-[var(--color-mocha)] hover:text-[var(--color-slate-blue)]"
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
            Affichage de {indexOfFirstBoat + 1} à {Math.min(indexOfLastBoat, filteredBoats.length)} sur {filteredBoats.length} résultats
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-[var(--color-slate-blue)] bg-white border border-[var(--color-slate-blue)] rounded-md hover:bg-[var(--color-slate-blue)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="px-3 py-2 text-sm font-medium text-[var(--color-slate-blue)] bg-white border border-[var(--color-slate-blue)] rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-[var(--color-slate-blue)] bg-white border border-[var(--color-slate-blue)] rounded-md hover:bg-[var(--color-slate-blue)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de détails bateau */}
      {showModal && modalBoat && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Détails du bateau</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations générales</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="text-sm text-gray-900">{modalBoat.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{modalBoat.type}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Port</label>
                      <p className="text-sm text-gray-900">{modalBoat.port}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix par jour</label>
                      <p className="text-sm text-gray-900">{modalBoat.price} €</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Note moyenne</label>
                      <div className="flex items-center">
                        <div className="flex items-center space-x-1 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon 
                              key={i} 
                              icon={faStar} 
                              className={`w-3 h-3 ${i < Math.floor(modalBoat.rating) ? 'text-[#AD7C59]' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-900">{modalBoat.rating} ({modalBoat.reviews} avis)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Propriétaire</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="text-sm text-gray-900">{modalBoat.owner.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{modalBoat.owner.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <p className="text-sm text-gray-900">{modalBoat.owner.phone}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-3 mt-6">Statistiques</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total réservations</label>
                      <p className="text-sm text-gray-900">{modalBoat.totalReservations}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Revenus totaux</label>
                      <p className="text-sm text-gray-900">{modalBoat.totalRevenue} €</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Photos</label>
                      <p className="text-sm text-gray-900">{modalBoat.photos}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-slate-blue)] bg-[var(--color-pale-blue)] border border-[var(--color-slate-blue)] rounded-md hover:bg-[var(--color-slate-blue)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mocha)]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleEditBoat(modalBoat.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-mocha)] border border-transparent rounded-md hover:bg-[var(--color-slate-blue)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-mocha)]"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoatsAdmin;
