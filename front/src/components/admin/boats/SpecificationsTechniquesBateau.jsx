import React from 'react';

const SpecificationsTechniquesBateau = ({ formData, errors, onInputChange, fuelTypes }) => {
  return (
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
  );
};

export default SpecificationsTechniquesBateau; 