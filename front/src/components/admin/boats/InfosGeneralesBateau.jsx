import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip } from '@fortawesome/free-solid-svg-icons';

const InfosGeneralesBateau = ({ formData, errors, onInputChange, boatTypes, countries }) => {
  return (
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          onChange={onInputChange}
          rows="4"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Décrivez le bateau, ses caractéristiques, son histoire..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
    </div>
  );
};

export default InfosGeneralesBateau; 