import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import {
  faShip,
  faArrowLeft,
  faSave,
  faTimes,
  faUpload,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const EditBoatAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    country: '',
    city: '',
    port: '',
    price: '',
    description: '',
    capacity: '',
    length: '',
    width: '',
    year: '',
    engine: '',
    fuelType: '',
    equipment: [],
    photos: []
  });

  const [errors, setErrors] = useState({});

  const boatTypes = [
    'Voilier',
    'Catamaran', 
    'Moteur',
    'Yacht',
    'Bateau à voile',
    'Bateau de pêche',
    'Bateau de croisière',
    'Bateau de sport'
  ];

  const countries = [
    'Albanie', 'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Biélorussie',
    'Bosnie-Herzégovine', 'Bulgarie', 'Chypre', 'Croatie', 'Danemark', 'Espagne',
    'Estonie', 'Finlande', 'France', 'Grèce', 'Hongrie', 'Irlande', 'Islande',
    'Italie', 'Kazakhstan', 'Kosovo', 'Lettonie', 'Liechtenstein', 'Lituanie',
    'Luxembourg', 'Macédoine du Nord', 'Malte', 'Moldavie', 'Monaco', 'Monténégro',
    'Norvège', 'Pays-Bas', 'Pologne', 'Portugal', 'République tchèque', 'Roumanie',
    'Royaume-Uni', 'Russie', 'Saint-Marin', 'Serbie', 'Slovaquie', 'Slovénie',
    'Suède', 'Suisse', 'Ukraine', 'Vatican'
  ];

  const fuelTypes = [
    'Essence',
    'Diesel',
    'Électrique',
    'Hybride',
    'Solaire',
    'Vent (voile)'
  ];

  const equipmentOptions = [
    'GPS',
    'VHF',
    'Sonar',
    'Pilote automatique',
    'Générateur',
    'Climatisation',
    'Cuisine équipée',
    'Cabines',
    'Douche',
    'WC',
    'Équipement de sécurité',
    'Équipement de pêche',
    'Équipement de plongée',
    'Tender',
    'Ancre électrique',
    'Winch électrique'
  ];

  // Charger les données du bateau
  useEffect(() => {
    // Simulation du chargement des données
    const mockBoatData = {
      name: 'Ocean Explorer',
      type: 'Voilier',
      country: 'France',
      city: 'Marseille',
      port: 'Vieux Port',
      price: '150',
      description: 'Magnifique voilier de 12 mètres',
      capacity: '8',
      length: '12.5',
      width: '4.2',
      year: '2020',
      engine: '2x 50 CV',
      fuelType: 'Diesel',
      equipment: ['GPS', 'VHF', 'Pilote automatique'],
      photos: []
    };

    setFormData(mockBoatData);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEquipmentChange = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(item => item !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du bateau est requis';
    if (!formData.type) newErrors.type = 'Le type de bateau est requis';
    if (!formData.country) newErrors.country = 'Le pays est requis';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    if (!formData.port.trim()) newErrors.port = 'Le port est requis';
    if (!formData.price) newErrors.price = 'Le prix est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.capacity) newErrors.capacity = 'La capacité est requise';
    if (!formData.length) newErrors.length = 'La longueur est requise';
    if (!formData.width) newErrors.width = 'La largeur est requise';
    if (!formData.year) newErrors.year = 'L\'année est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous ajouteriez la logique pour envoyer les données à votre API
      console.log('Données du bateau à modifier:', formData);
      
      Swal.fire({
        title: 'Modifié !',
        text: 'Le bateau a été modifié avec succès.',
        icon: 'success',
        confirmButtonColor: '#AD7C59'
      }).then(() => {
        // Redirection vers la liste des bateaux
        navigate('/admin/sl/boats');
      });
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la modification du bateau' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/sl/boats')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Retour à la liste"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-slate-blue)]">Modifier le bateau</h1>
            <p className="text-sm text-gray-500">Modifiez les informations du bateau</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/sl/boats')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="editBoatForm"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Modification...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <form id="editBoatForm" onSubmit={handleSubmit} className="space-y-8">
        {/* Informations générales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faShip} className="w-5 h-5 mr-2 text-[#AD7C59]" />
            Informations générales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du bateau *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Ocean Explorer"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bateau *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un type</option>
                {boatTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un pays</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Marseille"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port *
              </label>
              <input
                type="text"
                name="port"
                value={formData.port}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.port ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Vieux Port"
              />
              {errors.port && <p className="mt-1 text-sm text-red-600">{errors.port}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix par jour (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez le bateau, ses caractéristiques, son histoire..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        {/* Caractéristiques techniques */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques techniques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité (personnes) *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 8"
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longueur (m) *
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.length ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 12.5"
              />
              {errors.length && <p className="mt-1 text-sm text-red-600">{errors.length}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largeur (m) *
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.width ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 4.2"
              />
              {errors.width && <p className="mt-1 text-sm text-red-600">{errors.width}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année de construction *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 2020"
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moteur
              </label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
                placeholder="Ex: 2x 200 CV"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de carburant
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59]"
              >
                <option value="">Sélectionner</option>
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Équipements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {equipmentOptions.map(equipment => (
              <label key={equipment} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(equipment)}
                  onChange={() => handleEquipmentChange(equipment)}
                  className="h-4 w-4 text-[#AD7C59] focus:ring-[#AD7C59] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{equipment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos du bateau</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]">
                <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
                Ajouter des photos
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                Formats acceptés: JPG, PNG, GIF (max 5MB par image)
              </span>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message d'erreur global */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditBoatAdmin; 