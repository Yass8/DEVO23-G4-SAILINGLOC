import React from 'react';

const MessageModal = ({ message, isOpen, onClose, onMarkAsRead, onDelete }) => {
  if (!isOpen || !message) return null;

  const getUserTypeBadge = (userType) => {
    const typeConfig = {
      client: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Locataire' },
      proprietaire: { color: 'bg-[#AD7C59] bg-opacity-20 text-black', text: 'Propriétaire' },
      admin: { color: 'bg-[#4B6A88] bg-opacity-20 text-black', text: 'Administrateur' }
    };
    
    const config = typeConfig[userType] || typeConfig.client;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getReadStatusBadge = (isRead) => {
    if (isRead) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#87CEEB] bg-opacity-20 text-black">
          Lu
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EF4444] bg-opacity-20 text-black">
          Non lu
        </span>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#4B6A88]">
              Détails du Message
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
                  Expéditeur
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#4B6A88] rounded-full flex items-center justify-center text-white text-lg font-medium">
                      {message.senderName ? message.senderName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {message.senderName || 'Utilisateur'}
                      </div>
                      <div className="mt-1">
                        {getUserTypeBadge(message.senderType || 'client')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Destinataire
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#87CEEB] rounded-full flex items-center justify-center text-white text-lg font-medium">
                      {message.receiverName ? message.receiverName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {message.receiverName || 'Utilisateur'}
                      </div>
                      <div className="mt-1">
                        {getUserTypeBadge(message.receiverType || 'client')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu du message */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Contenu du Message
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>

            {/* Informations de la réservation */}
            {message.reservationId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Réservation Associée
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">ID Réservation:</span> {message.reservationId}
                  </div>
                </div>
              </div>
            )}

            {/* Statut et dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Statut
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {getReadStatusBadge(message.is_read)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Date d'Envoi
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-900">
                    {new Date(message.createdAt).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              {!message.is_read && (
                <button
                  onClick={() => onMarkAsRead(message.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#10B981] hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Marquer comme lu
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onDelete(message.id)}
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

export default MessageModal; 