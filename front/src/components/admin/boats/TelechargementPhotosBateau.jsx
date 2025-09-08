import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPlus, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const TelechargementPhotosBateau = ({ formData, onPhotoChange, onPhotoRemove }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onPhotoChange(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onPhotoChange(files);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos du bateau</h2>
      
      <div className="space-y-4">
        {/* Zone de téléchargement */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#AD7C59] transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez vos photos ici ou cliquez pour sélectionner
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#AD7C59] bg-white border border-[#AD7C59] rounded-md hover:bg-[#AD7C59] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Ajouter des photos
          </label>
        </div>

        {/* Aperçu des photos */}
        {formData.photos.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Photos sélectionnées ({formData.photos.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => onPhotoRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Conseils pour les photos</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Utilisez des photos de haute qualité (minimum 1200x800 pixels)</li>
            <li>• Prenez des photos sous différents angles (extérieur, intérieur, pont)</li>
            <li>• Assurez-vous que les photos sont bien éclairées</li>
            <li>• Formats acceptés : JPG, PNG, WebP</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TelechargementPhotosBateau; 