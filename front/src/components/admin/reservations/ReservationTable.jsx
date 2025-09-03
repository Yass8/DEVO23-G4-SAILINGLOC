import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faCheck, 
  faTimes, 
  faShip, 
  faCalendarAlt 
} from '@fortawesome/free-solid-svg-icons';

const ReservationRow = ({ reservation, onView, onStatusChange }) => {
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

  const handleConfirm = () => {
    console.log('Bouton Confirmer cliqué pour la réservation:', reservation.id);
    if (onStatusChange) {
      onStatusChange(reservation.id, 'confirmed');
    } else {
      console.error("onStatusChange n'est pas défini");
    }
  };

  const handleCancel = () => {
    console.log('Bouton Annuler cliqué pour la réservation:', reservation.id);
    if (onStatusChange) {
      onStatusChange(reservation.id, 'cancelled');
    } else {
      console.error("onStatusChange n'est pas défini");
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-[var(--color-mocha)] flex items-center justify-center">
              <FontAwesomeIcon icon={faShip} className="text-white" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{reservation.boatName}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{reservation.clientName}</div>
        <div className="text-sm text-gray-500">{reservation.clientEmail}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[var(--color-mocha)]" />
          {new Date(reservation.startDate).toLocaleDateString('fr-FR')}
        </div>
        <div className="text-sm text-gray-500">
          au {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-medium">{reservation.totalPrice} €</div>
        <div className="text-sm text-gray-500">Dépôt: {reservation.deposit} €</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(reservation)}
            className="text-[var(--color-slate-blue)] hover:text-[var(--color-mocha)] p-1 transition-colors"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          
          <button
            onClick={handleConfirm}
            className="text-[var(--color-sage-green)] hover:text-[var(--color-slate-blue)] p-1 transition-colors disabled:opacity-50"
            title="Confirmer"
            disabled={reservation.status === 'confirmed'}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-900 p-1 transition-colors disabled:opacity-50"
            title="Annuler"
            disabled={reservation.status === 'cancelled'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ReservationTable = ({ reservations, onView, onStatusChange }) => {
  console.log('ReservationTable reçu:', { reservations, onStatusChange });
  
  const tableHeaders = ['Réservation', 'Client', 'Dates', 'Statut', 'Montant', 'Actions'];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              onView={onView}
              onStatusChange={onStatusChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable; 