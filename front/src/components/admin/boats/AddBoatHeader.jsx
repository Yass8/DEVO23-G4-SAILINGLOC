import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AddBoatHeader = ({ loading, onSave }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/sl/boats')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-slate-blue)]">Ajouter un nouveau bateau</h1>
          <p className="text-sm text-gray-500">Créez un nouveau bateau dans le système</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/admin/sl/boats')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
        >
          Annuler
        </button>
        <button
          type="submit"
          form="boatForm"
          disabled={loading}
          onClick={onSave}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Création...
            </>
          ) : (
            <>
              Créer le bateau
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddBoatHeader; 