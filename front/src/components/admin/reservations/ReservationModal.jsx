import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ReservationModal = ({ reservation, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !reservation) return null;

  const getStatusInfo = (status) => {
    const statusConfig = {
      confirmed: { text: 'Confirmée', color: 'bg-[var(--color-sage-green)] text-[var(--color-slate-blue)]' },
      pending: { text: 'En attente', color: 'bg-[var(--color-pale-blue)] text-[var(--color-slate-blue)]' },
      cancelled: { text: 'Annulée', color: 'bg-[var(--color-sage-green)] text-[var(--color-slate-blue)]' },
      completed: { text: 'Terminée', color: 'bg-[var(--color-pale-blue)] text-[var(--color-slate-blue)]' }
    };
    return statusConfig[status] || { text: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
  };

  const statusInfo = getStatusInfo(reservation.status);

  const reservationDetails = [
    { label: 'Bateau', value: reservation.boatName },
    { label: 'Client', value: reservation.clientName, subValue: reservation.clientEmail },
    { 
      label: 'Dates', 
      value: `Du ${new Date(reservation.startDate).toLocaleDateString('fr-FR')} au ${new Date(reservation.endDate).toLocaleDateString('fr-FR')}` 
    },
    { 
      label: 'Statut', 
      customValue: (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      )
    },
    { label: 'Total', value: `${reservation.totalPrice} €`, subValue: `Dépôt: ${reservation.deposit} €` },
    { label: 'Port', value: reservation.port },
    { label: 'Propriétaire', value: reservation.boatOwner }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header du modal */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Détails de la réservation</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          {/* Contenu du modal */}
          <div className="space-y-3">
            {reservationDetails.map(({ label, value, subValue, customValue }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {customValue || (
                  <>
                    <div className="text-gray-900">{value}</div>
                    {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => onStatusChange(reservation.id, 'confirmed')}
              className="px-4 py-2 bg-[var(--color-sage-green)] text-[var(--color-slate-blue)] rounded hover:bg-opacity-90"
            >
              Confirmer
            </button>
            <button
              onClick={() => onStatusChange(reservation.id, 'cancelled')}
              className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Annuler
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal; 