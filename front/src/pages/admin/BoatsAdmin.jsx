import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faSpinner,
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
  faTimes
} from '@fortawesome/free-solid-svg-icons';

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
        verified: true,
        featured: true
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
        verified: false,
        featured: false
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
        verified: true,
        featured: false
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
        verified: true,
        featured: true
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
        verified: true,
        featured: true
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
    console.log('Éditer bateau:', boatId);
    // TODO: Implémenter l'édition
  };

  const handleDeleteBoat = (boatId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bateau ?')) {
      setBoats(boats.filter(boat => boat.id !== boatId));
      setSelectedBoats(selectedBoats.filter(id => id !== boatId));
    }
  };

  const handleApproveBoat = (boatId) => {
    setBoats(boats.map(boat => 
      boat.id === boatId 
        ? { ...boat, status: 'active' }
        : boat
    ));
  };

  const handleSuspendBoat = (boatId) => {
    setBoats(boats.map(boat => 
      boat.id === boatId 
        ? { ...boat, status: 'suspended' }
        : boat
    ));
  };

  const handleToggleFeatured = (boatId) => {
    setBoats(boats.map(boat => 
      boat.id === boatId 
        ? { ...boat, featured: !boat.featured }
        : boat
    ));
  };

  const handleBulkAction = (action) => {
    if (selectedBoats.length === 0) return;

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
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedBoats.length} bateau(x) ?`)) {
          setBoats(boats.filter(boat => !selectedBoats.includes(boat.id)));
          setSelectedBoats([]);
        }
        break;
      default:
        break;
    }
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
      active: { color: 'bg-green-100 text-green-800', icon: faCheckCircle, label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faClock, label: 'En attente' },
      suspended: { color: 'bg-red-100 text-red-800', icon: faBan, label: 'Suspendu' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Composant pour la vérification
  const VerificationBadge = ({ verified }) => {
    return verified ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 mr-1" />
        Vérifié
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 mr-1" />
        Non vérifié
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Bateaux</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez le catalogue des bateaux, validez les annonces et modérez le contenu
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
                className="px-3 py-2 text-sm text-green-600 hover:text-green-800"
              >
                Approuver
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
              <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Bateaux actifs</dt>
                <dd className="text-lg font-medium text-gray-900">{boats.filter(b => b.status === 'active').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faClock} className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">En attente</dt>
                <dd className="text-lg font-medium text-gray-900">{boats.filter(b => b.status === 'pending').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faStar} className="w-8 h-8 text-yellow-500" />
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
                            {boat.featured && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Vedette
                              </span>
                            )}
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
                      <div className="space-y-2">
                        <StatusBadge status={boat.status} />
                        <VerificationBadge verified={boat.verified} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {boat.price} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center space-x-1 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon 
                              key={i} 
                              icon={faStar} 
                              className={`w-3 h-3 ${i < Math.floor(boat.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-900">{boat.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({boat.reviews})</span>
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
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                        </button>
                        {boat.status === 'pending' && (
                          <button
                            onClick={() => handleApproveBoat(boat.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Approuver"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                        )}
                        {boat.status === 'active' && (
                          <button
                            onClick={() => handleSuspendBoat(boat.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Suspendre"
                          >
                            <FontAwesomeIcon icon={faBan} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleFeatured(boat.id)}
                          className={`${boat.featured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-800'}`}
                          title={boat.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                        >
                          <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBoat(boat.id)}
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
            Affichage de {indexOfFirstBoat + 1} à {Math.min(indexOfLastBoat, filteredBoats.length)} sur {filteredBoats.length} résultats
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
                              className={`w-3 h-3 ${i < Math.floor(modalBoat.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
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
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleEditBoat(modalBoat.id);
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
    </div>
  );
};

export default BoatsAdmin;
