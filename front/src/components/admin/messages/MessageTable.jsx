import React from 'react';

const MessageTable = ({ messages, currentPage, itemsPerPage, onViewDetails, onMarkAsRead, onDelete }) => {
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

  const getUserTypeBadge = (userType) => {
    const typeConfig = {
      client: { color: 'bg-[#87CEEB] bg-opacity-20 text-black', text: 'Locataire' },
      proprietaire: { color: 'bg-[#AD7C59] bg-opacity-20 text-black', text: 'Propriétaire' },
      admin: { color: 'bg-[#4B6A88] bg-opacity-20 text-black', text: 'Admin' }
    };
    
    const config = typeConfig[userType] || typeConfig.client;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = messages.slice(startIndex, endIndex);

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expéditeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destinataire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contenu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Réservation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMessages.map((message) => (
              <tr key={message.id} className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#4B6A88] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {message.senderName ? message.senderName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {message.senderName || 'Utilisateur'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUserTypeBadge(message.senderType || 'client')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#87CEEB] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {message.receiverName ? message.receiverName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {message.receiverName || 'Utilisateur'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getUserTypeBadge(message.receiverType || 'client')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {truncateContent(message.content)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {message.reservationId ? (
                    <div className="text-sm text-gray-900">
                      {message.reservationId}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Aucune</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getReadStatusBadge(message.is_read)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewDetails(message)}
                      className="text-[#4B6A88] hover:text-[#3B5A78] transition-colors"
                      title="Voir les détails"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {!message.is_read && (
                      <button
                        onClick={() => onMarkAsRead(message.id)}
                        className="text-[#10B981] hover:text-[#059669] transition-colors"
                        title="Marquer comme lu"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(message.id)}
                      className="text-[#4B6A88] hover:text-[#3B5A78] transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {currentMessages.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Aucun message trouvé
          </h3>
          <p className="text-sm text-gray-500">
            Aucun message ne correspond aux critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageTable; 