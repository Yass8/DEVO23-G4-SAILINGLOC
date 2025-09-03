import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faDownload, faTrash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ContractRow = ({ contract, onView, onEdit, onDownload, onDelete, onStatusChange }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Actif' },
      completed: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Terminé' },
      cancelled: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Annulé' },
      expired: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Expiré' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      rental: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Location' },
      purchase: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Achat' },
      maintenance: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Maintenance' },
      insurance: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Assurance' }
    };
    
    const config = typeConfig[type] || typeConfig.rental;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <tr className="border-b hover:bg-[var(--color-pale-blue)] hover:bg-opacity-5">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-[#4B6A88]">{contract.contractNumber}</div>
          <div className="text-sm text-[#AD7C59]">Réservation: {contract.reservationId}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-[#4B6A88]">{contract.clientName}</div>
          <div className="text-sm text-gray-500">{contract.clientEmail}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-[#4B6A88]">{contract.boatName}</div>
          <div className="text-sm text-gray-500">{contract.boatOwner}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-[#4B6A88]">{formatDate(contract.startDate)}</div>
          <div className="text-sm text-gray-500">au {formatDate(contract.endDate)}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        {getTypeBadge(contract.type)}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(contract.status)}
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-[#AD7C59]">{formatCurrency(contract.totalAmount)}</div>
        <div className="text-sm text-gray-500">Caution: {formatCurrency(contract.deposit)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(contract)}
            className="p-2 text-[var(--color-slate-blue)] hover:bg-[var(--color-slate-blue)] hover:bg-opacity-20 hover:text-black rounded-lg transition-colors"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => onEdit(contract)}
            className="p-2 text-[var(--color-mocha)] hover:bg-[var(--color-mocha)] hover:bg-opacity-20 hover:text-black rounded-lg transition-colors"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDownload(contract)}
            className="p-2 text-[var(--color-slate-blue)] hover:bg-[var(--color-slate-blue)] hover:bg-opacity-20 hover:text-black rounded-lg transition-colors"
            title="Télécharger"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
          {contract.status === 'active' && (
            <button
              onClick={() => onStatusChange(contract.id, 'completed')}
              className="p-2 text-[var(--color-mocha)] hover:bg-[var(--color-mocha)] hover:bg-opacity-20 hover:text-black rounded-lg transition-colors"
              title="Marquer comme terminé"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          )}
          <button
            onClick={() => onDelete(contract.id)}
            className="p-2 text-[var(--color-slate-blue)] hover:bg-[var(--color-slate-blue)] hover:bg-opacity-20 hover:text-black rounded-lg transition-colors"
            title="Supprimer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ContractTable = ({ contracts, onView, onEdit, onDownload, onDelete, onStatusChange }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#87CEEB] bg-opacity-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Contrat / Réservation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Bateau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#87CEEB] divide-opacity-20">
            {contracts.map((contract) => (
              <ContractRow
                key={contract.id}
                contract={contract}
                onView={onView}
                onEdit={onEdit}
                onDownload={onDownload}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractTable; 