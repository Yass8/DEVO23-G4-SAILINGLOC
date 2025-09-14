import React from 'react';

const PaymentModal = ({ payment, isOpen, onClose, onStatusChange, onDelete }) => {
  if (!isOpen || !payment) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'En attente' },
      completed: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Complété' },
      failed: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Échoué' },
      refunded: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Remboursé' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      credit_card: { color: 'bg-purple-100 text-purple-800', text: 'Carte de crédit', icon: '💳' },
      paypal: { color: 'bg-blue-100 text-blue-800', text: 'PayPal', icon: '🔵' },
      bank_transfer: { color: 'bg-gray-100 text-gray-800', text: 'Virement bancaire', icon: '🏦' }
    };
    
    const config = methodConfig[method] || methodConfig.credit_card;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#AD7C59]">
              Détails du Paiement
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mt-4 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Informations du Paiement
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Référence:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.reference}</p>
                  </div>
                  {payment.transaction_id && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">ID Transaction:</span>
                      <p className="text-sm text-gray-900 mt-1 font-mono">{payment.transaction_id}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-700">Statut:</span>
                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Méthode:</span>
                    <div className="mt-1">{getMethodBadge(payment.method)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Montants
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Montant Total:</span>
                    <p className="text-2xl font-bold text-[#AD7C59] mt-1">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Commission:</span>
                    <p className="text-lg font-semibold text-[#4B6A88] mt-1">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payment.commission_amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Net Propriétaire:</span>
                    <p className="text-lg font-semibold text-[#88B0A1] mt-1">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payment.amount - payment.commission_amount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de la réservation */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Informations de la Réservation
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">ID Réservation:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.reservationId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Bateau:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.boatName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Propriétaire:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.boatOwner}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Période:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(payment.startDate).toLocaleDateString('fr-FR')} - {new Date(payment.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations du client */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Informations du Client
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nom:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.clientName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-sm text-gray-900 mt-1">{payment.clientEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Dates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Créé le:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(payment.createdAt).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {payment.updatedAt !== payment.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Modifié le:</span>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(payment.updatedAt).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {payment.status === 'pending' && (
                <button
                  onClick={() => onStatusChange(payment.id, 'completed')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Marquer comme complété
                </button>
              )}
              
              {payment.status === 'completed' && (
                <button
                  onClick={() => onStatusChange(payment.id, 'refunded')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Marquer comme remboursé
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onDelete(payment.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4B6A88] hover:bg-[#3B5A78] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B6A88] transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Supprimer
              </button>
              
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B6A88] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 