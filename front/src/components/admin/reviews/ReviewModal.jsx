import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';

const ReviewModal = ({ review, isOpen, onClose, onRespond }) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (review && review.response) {
      setResponse(review.response);
    } else {
      setResponse('');
    }
  }, [review]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={`w-6 h-6 ${i <= rating ? 'text-[#AD7C59]' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response.trim()) {
      onRespond(review.id, response);
      onClose();
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Répondre à l'avis</h2>
            <p className="text-sm text-gray-600">Répondez au commentaire de l'utilisateur</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations de l'avis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#4B6A88] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{review.userName || 'Utilisateur'}</div>
                  <div className="text-sm text-gray-500">{review.boatName || 'Bateau'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <div className="text-sm text-gray-500 mt-1">({review.rating}/5)</div>
              </div>
            </div>
            <div className="text-gray-700">{review.comment}</div>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>

          {/* Formulaire de réponse */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre réponse *
              </label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B6A88] focus:border-transparent"
                placeholder="Tapez votre réponse ici..."
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4B6A88] text-white hover:bg-[#3B5A78] rounded-md transition-colors"
              >
                Envoyer la réponse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal; 