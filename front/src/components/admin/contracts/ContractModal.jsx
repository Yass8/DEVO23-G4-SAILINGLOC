import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faEdit, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ContractModal = ({ contract, isOpen, onClose, onEdit, onDownload, onStatusChange }) => {
  if (!isOpen || !contract) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Actif' },
      completed: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Terminé' },
      cancelled: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Annulé' },
      expired: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Expiré' }
    };
    
    const config = statusConfig[contract.status] || statusConfig.active;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#87CEEB] border-opacity-20">
          <div>
            <h2 className="text-2xl font-bold text-[#AD7C59]">
              Détails du Contrat
            </h2>
            <p className="text-[#4B6A88] mt-1">
              {contract.contractNumber} - Réservation: {contract.reservationId}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onDownload(contract)}
              className="p-2 text-[#87CEEB] hover:bg-[#87CEEB] hover:bg-opacity-20 rounded-lg transition-colors"
              title="Télécharger"
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
            <button
              onClick={() => onEdit(contract)}
              className="p-2 text-[#AD7C59] hover:bg-[#AD7C59] hover:bg-opacity-20 rounded-lg transition-colors"
              title="Modifier"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#4B6A88] mb-2">Informations du Contrat</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Numéro:</span>
                    <span className="font-medium text-[#4B6A88]">{contract.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Réservation:</span>
                    <span className="font-medium text-[#AD7C59]">{contract.reservationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Type:</span>
                    {getTypeBadge(contract.type)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Statut:</span>
                    {getStatusBadge(contract.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Date de création:</span>
                    <span className="font-medium">{formatDate(contract.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#4B6A88] mb-2">Informations Financières</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Montant total:</span>
                    <span className="font-medium text-lg text-[#AD7C59]">
                      {formatCurrency(contract.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Caution:</span>
                    <span className="font-medium">{formatCurrency(contract.deposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B6A88]">Commission:</span>
                    <span className="font-medium">{formatCurrency(contract.commission)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client et Bateau */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4B6A88] mb-3">Informations Client</h3>
              <div className="bg-[#87CEEB] bg-opacity-10 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Nom:</span>
                  <span className="font-medium">{contract.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Email:</span>
                  <span className="font-medium">{contract.clientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Téléphone:</span>
                  <span className="font-medium">{contract.clientPhone || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Adresse:</span>
                  <span className="font-medium text-right max-w-xs">
                    {contract.clientAddress || 'Non renseignée'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#4B6A88] mb-3">Informations Bateau</h3>
              <div className="bg-[#87CEEB] bg-opacity-10 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Nom:</span>
                  <span className="font-medium">{contract.boatName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Propriétaire:</span>
                  <span className="font-medium">{contract.boatOwner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Port:</span>
                  <span className="font-medium">{contract.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Type:</span>
                  <span className="font-medium">{contract.boatType || 'Non spécifié'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Période et Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4B6A88] mb-3">Période de Location</h3>
              <div className="bg-[#87CEEB] bg-opacity-10 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Date de début:</span>
                  <span className="font-medium">{formatDate(contract.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Date de fin:</span>
                  <span className="font-medium">{formatDate(contract.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B6A88]">Durée:</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(contract.endDate) - new Date(contract.startDate)) / (1000 * 60 * 60 * 24))} jours
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#4B6A88] mb-3">Conditions Spéciales</h3>
              <div className="bg-[#87CEEB] bg-opacity-10 p-4 rounded-lg">
                <p className="text-[#4B6A88]">
                  {contract.specialConditions || 'Aucune condition spéciale spécifiée'}
                </p>
              </div>
            </div>
          </div>

          {/* Informations de réservation */}
          <div className="bg-[#AD7C59] bg-opacity-10 p-4 rounded-lg border-l-4 border-[#AD7C59]">
            <h3 className="text-lg font-semibold text-[#AD7C59] mb-3">Informations de Réservation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[#4B6A88] font-medium">Réservation confirmée le:</span>
                <span className="ml-2">{formatDate(contract.reservationConfirmedAt)}</span>
              </div>
              <div>
                <span className="text-[#4B6A88] font-medium">Contrat généré le:</span>
                <span className="ml-2">{formatDate(contract.contractGeneratedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          {contract.status === 'active' && (
            <div className="border-t border-[#87CEEB] border-opacity-20 pt-6">
              <h3 className="text-lg font-semibold text-[#4B6A88] mb-4">Actions Rapides</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => onStatusChange(contract.id, 'completed')}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#AD7C59] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Marquer comme terminé</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractModal; 