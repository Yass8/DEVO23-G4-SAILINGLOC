import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Preloader from '../../components/common/Preloader';
import {
  faShip,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
  faTags,
  faSearch,
  faFilter,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

const BoatTypesAdmin = () => {
  const navigate = useNavigate();
  const [boatTypes, setBoatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [modalData, setModalData] = useState({
    name: '',
    description: '',
    category: '',
    features: [],
    minPrice: '',
    maxPrice: '',
    minCapacity: '',
    maxCapacity: '',
    minLength: '',
    maxLength: ''
  });

  // Données simulées pour le développement
  useEffect(() => {
    const mockBoatTypes = [
      {
        id: 1,
        name: 'Voilier',
        description: 'Bateau propulsé principalement par la force du vent',
        category: 'Voile',
        features: ['Voiles', 'Mât', 'Quille', 'Gouvernail'],
        minPrice: 80,
        maxPrice: 300,
        minCapacity: 2,
        maxCapacity: 12,
        minLength: 6,
        maxLength: 25,
        boatCount: 45,
        active: true,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        name: 'Catamaran',
        description: 'Bateau à deux coques parallèles offrant stabilité et espace',
        category: 'Voile',
        features: ['Deux coques', 'Large pont', 'Stabilité', 'Vitesse'],
        minPrice: 120,
        maxPrice: 500,
        minCapacity: 4,
        maxCapacity: 20,
        minLength: 8,
        maxLength: 30,
        boatCount: 28,
        active: true,
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        name: 'Moteur',
        description: 'Bateau propulsé par un ou plusieurs moteurs',
        category: 'Moteur',
        features: ['Moteur', 'Hélice', 'Réservoir', 'Cockpit'],
        minPrice: 100,
        maxPrice: 400,
        minCapacity: 3,
        maxCapacity: 15,
        minLength: 7,
        maxLength: 20,
        boatCount: 67,
        active: true,
        createdAt: '2024-01-05'
      },
      {
        id: 4,
        name: 'Yacht',
        description: 'Bateau de luxe avec équipements haut de gamme',
        category: 'Luxe',
        features: ['Luxe', 'Équipements premium', 'Cabines', 'Services'],
        minPrice: 300,
        maxPrice: 2000,
        minCapacity: 6,
        maxCapacity: 30,
        minLength: 15,
        maxLength: 50,
        boatCount: 23,
        active: true,
        createdAt: '2024-01-12'
      },
      {
        id: 5,
        name: 'Bateau de pêche',
        description: 'Bateau spécialement conçu pour la pêche',
        category: 'Spécialisé',
        features: ['Équipement pêche', 'Stabilité', 'Espace stockage', 'Résistance'],
        minPrice: 60,
        maxPrice: 200,
        minCapacity: 2,
        maxCapacity: 8,
        minLength: 5,
        maxLength: 12,
        boatCount: 34,
        active: true,
        createdAt: '2024-01-08'
      }
    ];

    setTimeout(() => {
      setBoatTypes(mockBoatTypes);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    'Voile',
    'Moteur', 
    'Luxe',
    'Spécialisé',
    'Sport',
    'Croisière',
    'Traditionnel'
  ];

  const features = [
    'Voiles', 'Mât', 'Quille', 'Gouvernail', 'Deux coques', 'Large pont',
    'Stabilité', 'Vitesse', 'Moteur', 'Hélice', 'Réservoir', 'Cockpit',
    'Luxe', 'Équipements premium', 'Cabines', 'Services', 'Équipement pêche',
    'Espace stockage', 'Résistance', 'GPS', 'VHF', 'Sonar', 'Pilote automatique'
  ];

  const filteredBoatTypes = boatTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || type.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddType = () => {
    setEditingType(null);
    setModalData({
      name: '',
      description: '',
      category: '',
      features: [],
      minPrice: '',
      maxPrice: '',
      minCapacity: '',
      maxCapacity: '',
      minLength: '',
      maxLength: ''
    });
    setShowModal(true);
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setModalData({
      name: type.name,
      description: type.description,
      category: type.category,
      features: [...type.features],
      minPrice: type.minPrice.toString(),
      maxPrice: type.maxPrice.toString(),
      minCapacity: type.minCapacity.toString(),
      maxCapacity: type.maxCapacity.toString(),
      minLength: type.minLength.toString(),
      maxLength: type.maxLength.toString()
    });
    setShowModal(true);
  };

  const handleDeleteType = (typeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de bateau ?')) {
      setBoatTypes(boats => boats.filter(type => type.id !== typeId));
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    
    if (editingType) {
      // Mise à jour
      setBoatTypes(types => types.map(type => 
        type.id === editingType.id 
          ? { ...type, ...modalData }
          : type
      ));
    } else {
      // Création
      const newType = {
        id: Date.now(),
        ...modalData,
        boatCount: 0,
        active: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBoatTypes(types => [...types, newType]);
    }
    
    setShowModal(false);
    setEditingType(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
            onClick={handleAddType}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-slate-blue)] hover:bg-[#3a556f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Nouveau type
          </button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

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
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caractéristiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix (€/jour)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bateaux
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBoatTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-2xl">
                        <FontAwesomeIcon icon={faShip} className="w-6 h-6 text-[var(--color-slate-blue)]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {type.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {type.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {feature}
                        </span>
                      ))}
                      {type.features.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          +{type.features.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {type.minPrice} - {type.maxPrice} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {type.minCapacity} - {type.maxCapacity} pers.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {type.boatCount} bateau(x)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditType(type)}
                        className="text-[var(--color-slate-blue)] hover:text-[var(--color-mocha)]"
                        title="Modifier"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
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

      {/* Modal pour ajouter/modifier un type */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingType ? 'Modifier le type' : 'Nouveau type de bateau'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du type *</label>
                    <input
                      type="text"
                      name="name"
                      value={modalData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                      placeholder="Ex: Voilier"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                    <select
                      name="category"
                      value={modalData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix min (€/jour)</label>
                    <input
                      type="number"
                      name="minPrice"
                      value={modalData.minPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix max (€/jour)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={modalData.maxPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacité min (pers.)</label>
                    <input
                      type="number"
                      name="minCapacity"
                      value={modalData.minCapacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                      placeholder="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacité max (pers.)</label>
                    <input
                      type="number"
                      name="maxCapacity"
                      value={modalData.maxCapacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                      placeholder="10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={modalData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                    placeholder="Description du type de bateau..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caractéristiques</label>
                  <textarea
                    name="features"
                    value={modalData.features.join(', ')}
                    onChange={(e) => setModalData(prev => ({
                      ...prev,
                      features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                    }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-slate-blue)] focus:border-[var(--color-slate-blue)]"
                    placeholder="Entrez les caractéristiques séparées par des virgules (ex: GPS, VHF, Voiles, Moteur)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Séparez chaque caractéristique par une virgule
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-slate-blue)] border border-transparent rounded-md hover:bg-[#3a556f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-slate-blue)]"
                  >
                    <FontAwesomeIcon icon={editingType ? faSave : faPlus} className="w-4 h-4 mr-2" />
                    {editingType ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoatTypesAdmin; 