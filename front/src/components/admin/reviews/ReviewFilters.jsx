import React from 'react';

const ReviewFilters = ({ filters, onFilterChange, onSearchChange }) => {
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
            placeholder="Commentaire, utilisateur..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <select
            value={filters.rating}
            onChange={(e) => onFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
        </div>

        {/* Statut de réponse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Réponse
          </label>
          <select
            value={filters.hasResponse}
            onChange={(e) => onFilterChange('hasResponse', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="true">Avec réponse</option>
            <option value="false">Sans réponse</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date min.
          </label>
          <input
            type="date"
            value={filters.minDate}
            onChange={(e) => onFilterChange('minDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters; 