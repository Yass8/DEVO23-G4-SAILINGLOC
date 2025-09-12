import React from 'react';

const PaymentFilters = ({ filters, onFilterChange, onSearchChange }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher
          </label>
          <input
            type="text"
            placeholder="Référence, client..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="completed">Complété</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>

        {/* Montant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={filters.amount}
            onChange={(e) => onFilterChange('amount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters; 