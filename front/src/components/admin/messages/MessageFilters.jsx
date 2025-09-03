import React from 'react';

const MessageFilters = ({ filters, onFilterChange, onSearchChange }) => {
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
            placeholder="Contenu, expéditeur..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          />
        </div>

        {/* Statut de lecture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={filters.readStatus}
            onChange={(e) => onFilterChange('readStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="unread">Non lus</option>
            <option value="read">Lus</option>
          </select>
        </div>

        {/* Type d'utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type Utilisateur
          </label>
          <select
            value={filters.userType}
            onChange={(e) => onFilterChange('userType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="client">Locataire</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="admin">Administrateur</option>
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

export default MessageFilters; 