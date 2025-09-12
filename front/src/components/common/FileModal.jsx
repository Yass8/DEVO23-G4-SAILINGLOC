import React from 'react';

const FileModal = ({ 
  isOpen, 
  onClose, 
  fileUrl, 
  fileType = '' 
}) => {
  if (!isOpen || !fileUrl) return null;

  const BASE_API = import.meta.env.VITE_API_BASE_URL || '';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderFilePreview = () => {
    const fullUrl = `${BASE_API}${fileUrl}`;
    
    if (fileUrl.endsWith('.pdf')) {
      return (
        <iframe
          src={fullUrl}
          className="w-full h-96 rounded border"
          title="PDF"
        />
      );
    }
    
    if (['.jpg', '.jpeg', '.png', '.gif'].some(ext => 
      fileUrl.endsWith(ext)
    )) {
      return (
        <img
          src={fullUrl}
          alt="Aperçu"
          className="w-full max-h-96 object-contain rounded border"
        />
      );
    }
    
    return (
      <p className="text-gray-600">
        Aperçu non disponible pour ce type de fichier.
      </p>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          Fichier : {fileType?.replace('_', ' ') || 'Fichier'}
        </h3>
        
        {renderFilePreview()}
        
        <div className="flex justify-end gap-3 mt-4">
          <a
            href={`${BASE_API}${fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition"
          >
            Ouvrir dans une nouvelle fenêtre
          </a>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;