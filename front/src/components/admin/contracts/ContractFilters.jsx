import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const ContractFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  typeFilter, 
  setTypeFilter, 
  dateFilter, 
  setDateFilter 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Rechercher un contrat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
          />
        </div>

        {/* Filtre par statut */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
        >
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="pending">En attente</option>
          <option value="active">Actif</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="expired">Expiré</option>
        </select>

        {/* Filtre par type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
        >
          <option value="all">Tous les types</option>
          <option value="rental">Location</option>
          <option value="purchase">Achat</option>
          <option value="maintenance">Maintenance</option>
          <option value="insurance">Assurance</option>
        </select>

        {/* Filtre par date */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-mocha)] focus:border-transparent"
        >
          <option value="all">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>
    </div>
  );
};

export default ContractFilters; 