import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Preloader from '../../components/common/Preloader';
import {
  faShip,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faSearch,
  faFilter,
  faArrowLeft,
  faImage,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { 
  fetchBoatTypes, 
  createBoatType, 
  updateBoatType, 
  deleteBoatType 
} from '../../services/boatTypeSevices';

const BASE_API = import.meta.env.VITE_API_BASE_URL;


const BoatTypesAdmin = () => {
  const navigate = useNavigate();
  const [boatTypes, setBoatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBoatType, setSelectedBoatType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [filters, setFilters] = useState({
    search: '',
    showAddModal: false
  });
  const [modalData, setModalData] = useState({
    name: '',
    photo: null,
    photoPreview: null
  });

  // Filtrage des types de bateaux
  const filteredBoatTypes = useMemo(() => {
    return boatTypes.filter(boatType => {
      const matchesSearch = !filters.search || 
        boatType.name.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });
  }, [boatTypes, filters]);

  // Pagination
  const paginatedBoatTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBoatTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBoatTypes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBoatTypes.length / itemsPerPage);

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    if (key === 'showAddModal') {
      setModalMode('add');
      setSelectedBoatType(null);
      setModalData({
        name: '',
        photo: null,
        photoPreview: null
      });
      setIsModalOpen(true);
      return;
    }
    
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewDetails = useCallback((boatType) => {
    setSelectedBoatType(boatType);
    setModalMode('view');
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((boatType) => {
    setSelectedBoatType(boatType);
    setModalMode('edit');
    setModalData({
      name: boatType.name,
      photo: null,
      photoPreview: boatType.photo_url
    });
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (boatTypeId) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Êtes-vous sûr de vouloir supprimer ce type de bateau ? Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      });

      if (result.isConfirmed) {
        // Appel API pour supprimer le type de bateau
        await deleteBoatType(boatTypeId);
        
        // Mise à jour locale de l'état
        setBoatTypes(prev => prev.filter(boatType => boatType.id !== boatTypeId));
        
        if (selectedBoatType?.id === boatTypeId) {
          setIsModalOpen(false);
          setSelectedBoatType(null);
        }

        await Swal.fire({
          title: 'Supprimé !',
          text: 'Le type de bateau a été supprimé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      Swal.fire({
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la suppression.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [selectedBoatType]);

  const handleSaveBoatType = useCallback(async (boatTypeData) => {
    try {
      if (modalMode === 'add') {
        // Créer un nouveau type de bateau via API
        const newBoatType = await createBoatType(boatTypeData, boatTypeData.photo);
        setBoatTypes(prev => [...prev, newBoatType]);
        
        await Swal.fire({
          title: 'Type créé !',
          text: 'Le type de bateau a été créé avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        // Mettre à jour le type de bateau existant via API
        const updatedBoatType = await updateBoatType(selectedBoatType.id, boatTypeData, boatTypeData.photo);
        setBoatTypes(prev => prev.map(boatType => 
          boatType.id === selectedBoatType.id ? updatedBoatType : boatType
        ));
        
        await Swal.fire({
          title: 'Type mis à jour !',
          text: 'Le type de bateau a été modifié avec succès.',
          icon: 'success',
          confirmButtonColor: '#10B981',
          timer: 2000,
          timerProgressBar: true
        });
      }
      
      setIsModalOpen(false);
      setSelectedBoatType(null);
      setModalMode('add');
      setModalData({
        name: '',
        photo: null,
        photoPreview: null
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Swal.fire({
        title: 'Erreur',
        text: error.message || 'Une erreur est survenue lors de la sauvegarde.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  }, [modalMode, selectedBoatType]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBoatType(null);
    setModalMode('add');
    setModalData({
      name: '',
      photo: null,
      photoPreview: null
    });
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setModalData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Chargement des données depuis l'API
  useEffect(() => {
    const loadBoatTypes = async () => {
      setLoading(true);
      try {
        const boatTypesData = await fetchBoatTypes();
        setBoatTypes(boatTypesData);
      } catch (error) {
        console.error('Erreur lors du chargement des types de bateaux:', error);
        Swal.fire({
          title: 'Erreur',
          text: error.message || 'Impossible de charger les types de bateaux',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      } finally {
        setLoading(false);
      }
    };

    loadBoatTypes();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/sl/boats')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Retour à la liste des bateaux"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-slate-blue)]">Types de bateaux</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les différents types de bateaux disponibles dans le système
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
              onClick={() => handleFilterChange('showAddModal', true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-slate-blue)] hover:bg-[#3a556f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nouveau type
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un type..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400 w-4 h-4" />
            <span className="text-sm text-gray-500">
              {filteredBoatTypes.length} type(s) trouvé(s)
            </span>
          </div>
        </div>
      </div>

      {/* Liste des types de bateaux */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBoatTypes.map((boatType) => (
                  <tr key={boatType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-2xl">
                        <FontAwesomeIcon icon={faShip} className="w-6 h-6 text-[var(--color-slate-blue)]" />
                      </div>
                      <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{boatType.name}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      {boatType.photo_url ? (
                        <div className="flex items-center">
                          <img
                            src={`${BASE_API}${boatType.photo_url}`}
                            alt={boatType.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="ml-2 text-sm text-gray-500">Photo disponible</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <FontAwesomeIcon icon={faImage} className="w-4 h-4 mr-2" />
                          <span className="text-sm">Aucune photo</span>
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(boatType.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                          onClick={() => handleViewDetails(boatType)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(boatType)}
                        className="text-[var(--color-slate-blue)] hover:text-[var(--color-mocha)]"
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => handleDelete(boatType.id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredBoatTypes.length)}
                  </span>{' '}
                  sur <span className="font-medium">{filteredBoatTypes.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-[var(--color-slate-blue)] border-[var(--color-slate-blue)] text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour ajouter/modifier/voir un type */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {modalMode === 'add' ? 'Nouveau type de bateau' : 
                     modalMode === 'edit' ? 'Modifier le type' : 'Détails du type'}
                </h3>
                <button
                    onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
                {modalMode === 'view' ? (
                  // Mode visualisation
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom du type</label>
                      <p className="text-sm text-gray-900">{selectedBoatType?.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      {selectedBoatType?.photo_url ? (
                        <img
                          src={`${BASE_API}${selectedBoatType.photo_url}`}
                          alt={selectedBoatType.name}
                          className="h-32 w-32 rounded-lg object-cover"
                        />
                      ) : (
                        <p className="text-sm text-gray-500">Aucune photo</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedBoatType?.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Mode création/édition
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveBoatType(modalData);
                  }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du type *</label>
                    <input
                      type="text"
                      name="name"
                      value={modalData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                        placeholder="Ex: Voilier, Catamaran, Moteur..."
                    />
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {modalData.photoPreview ? (
                  <div>
                              <img
                                src={modalData.photoPreview}
                                alt="Preview"
                                className="mx-auto h-24 w-24 object-cover rounded-lg"
                              />
                              <p className="text-xs text-gray-500 mt-2">Nouvelle photo sélectionnée</p>
                  </div>
                          ) : selectedBoatType?.photo_url ? (
                  <div>
                              <img
                                src={`${BASE_API}${selectedBoatType.photo_url}`}
                                alt="Photo actuelle"
                                className="mx-auto h-24 w-24 object-cover rounded-lg"
                              />
                              <p className="text-xs text-gray-500 mt-2">Photo actuelle</p>
                  </div>
                          ) : (
                  <div>
                              <FontAwesomeIcon icon={faImage} className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="text-xs text-gray-500 mt-2">Aucune photo</p>
                            </div>
                          )}
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="photo-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[var(--color-slate-blue)] hover:text-[#3a556f] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[var(--color-slate-blue)]"
                            >
                              <span>Choisir une photo</span>
                    <input
                                id="photo-upload"
                                name="photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 2MB</p>
                  </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                        onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-slate-blue)] border border-transparent rounded-md hover:bg-[#3a556f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
                  >
                        <FontAwesomeIcon icon={modalMode === 'edit' ? faSave : faPlus} className="w-4 h-4 mr-2" />
                        {modalMode === 'edit' ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default BoatTypesAdmin;