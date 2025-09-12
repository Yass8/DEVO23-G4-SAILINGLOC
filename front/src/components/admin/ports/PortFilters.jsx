import React from 'react';

const PortFilters = ({ filters, onFilterChange, onSearchChange }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nom, ville, pays..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          />
        </div>

        {/* Filtre par pays */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Tous les pays</option>
            <option value="France">France</option>
            <option value="Italie">Italie</option>
            <option value="Espagne">Espagne</option>
            <option value="Grèce">Grèce</option>
            <option value="Croatie">Croatie</option>
            <option value="Malte">Malte</option>
            <option value="Monaco">Monaco</option>
          </select>
        </div>

        {/* Filtre par ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Toutes les villes</option>
            <option value="Nice">Nice</option>
            <option value="Cannes">Cannes</option>
            <option value="Saint-Tropez">Saint-Tropez</option>
            <option value="Monaco">Monaco</option>
            <option value="Antibes">Antibes</option>
            <option value="Marseille">Marseille</option>
            <option value="Toulon">Toulon</option>
          </select>
        </div>

        {/* Bouton d'ajout */}
        <div className="flex items-end">
          <button
            onClick={() => onFilterChange('showAddModal', true)}
            className="w-full px-4 py-2 bg-[#4B6A88] text-white rounded-md hover:bg-[#3B5A78] transition-colors"
          >
            Ajouter un Port
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortFilters; 