import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const PortModal = ({ port, isOpen, onClose, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    latitude: '',
    longitude: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (port && mode === 'edit') {
      setFormData({
        name: port.name || '',
        city: port.city || '',
        country: port.country || '',
        latitude: port.latitude ? parseFloat(port.latitude).toString() : '',
        longitude: port.longitude ? parseFloat(port.longitude).toString() : ''
      });
    } else {
      setFormData({
        name: '',
        city: '',
        country: '',
        latitude: '',
        longitude: ''
      });
    }
    setErrors({});
  }, [port, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du port est requis';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Le pays est requis';
    }
    
    if (formData.latitude && (isNaN(formData.latitude) || parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90)) {
      newErrors.latitude = 'La latitude doit être entre -90 et 90';
    }
    
    if (formData.longitude && (isNaN(formData.longitude) || parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180)) {
      newErrors.longitude = 'La longitude doit être entre -180 et 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };
      
      onSave(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#87CEEB] rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#4B6A88] text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#4B6A88]">
                {mode === 'add' ? 'Ajouter un Port' : 'Modifier le Port'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'add' ? 'Créez un nouveau port' : 'Modifiez les informations du port'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Port *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Port de Nice"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Nice"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un pays</option>
                <option value="Albanie">Albanie</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Andorre">Andorre</option>
                <option value="Arménie">Arménie</option>
                <option value="Autriche">Autriche</option>
                <option value="Azerbaïdjan">Azerbaïdjan</option>
                <option value="Belgique">Belgique</option>
                <option value="Biélorussie">Biélorussie</option>
                <option value="Bosnie-Herzégovine">Bosnie-Herzégovine</option>
                <option value="Bulgarie">Bulgarie</option>
                <option value="Chypre">Chypre</option>
                <option value="Croatie">Croatie</option>
                <option value="Danemark">Danemark</option>
                <option value="Espagne">Espagne</option>
                <option value="Estonie">Estonie</option>
                <option value="Finlande">Finlande</option>
                <option value="France">France</option>
                <option value="Géorgie">Géorgie</option>
                <option value="Grèce">Grèce</option>
                <option value="Hongrie">Hongrie</option>
                <option value="Irlande">Irlande</option>
                <option value="Islande">Islande</option>
                <option value="Italie">Italie</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Lettonie">Lettonie</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lituanie">Lituanie</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macédoine du Nord">Macédoine du Nord</option>
                <option value="Malte">Malte</option>
                <option value="Moldavie">Moldavie</option>
                <option value="Monaco">Monaco</option>
                <option value="Monténégro">Monténégro</option>
                <option value="Norvège">Norvège</option>
                <option value="Pays-Bas">Pays-Bas</option>
                <option value="Pologne">Pologne</option>
                <option value="Portugal">Portugal</option>
                <option value="République tchèque">République tchèque</option>
                <option value="Roumanie">Roumanie</option>
                <option value="Royaume-Uni">Royaume-Uni</option>
                <option value="Russie">Russie</option>
                <option value="Saint-Marin">Saint-Marin</option>
                <option value="Serbie">Serbie</option>
                <option value="Slovaquie">Slovaquie</option>
                <option value="Slovénie">Slovénie</option>
                <option value="Suède">Suède</option>
                <option value="Suisse">Suisse</option>
                <option value="Turquie">Turquie</option>
                <option value="Ukraine">Ukraine</option>
                <option value="Vatican">Vatican</option>
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent ${
                  errors.latitude ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: 43.7102"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent ${
                  errors.longitude ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: 7.2620"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#4B6A88] text-white rounded-md hover:bg-[#3B5A78] transition-colors"
            >
              {mode === 'add' ? 'Créer le Port' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortModal; 