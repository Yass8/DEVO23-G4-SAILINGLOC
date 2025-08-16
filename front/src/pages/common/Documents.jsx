import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faTrash, 
  faCheckCircle,
  faTimesCircle,
  faClock,
  faIdCard,
  faFileAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

// Mock data basé sur le modèle UserDocument
const mockDocuments = [
  {
    id: 1,
    type: 'id_card',
    file_url: 'https://example.com/docs/id_card.jpg',
    is_verified: true,
    message: null,
    created_at: '2023-05-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'licence',
    file_url: 'https://example.com/docs/licence.pdf',
    is_verified: false,
    message: 'La photo n\'est pas lisible',
    created_at: '2023-06-20T14:45:00Z'
  },
  {
    id: 3,
    type: 'insurance',
    file_url: null,
    is_verified: null,
    message: null,
    created_at: null
  }
];

const documentTypes = {
  id_card: {
    name: 'Carte d\'identité',
    icon: faIdCard,
    description: 'Une copie recto-verso de votre pièce d\'identité valide'
  },
  licence: {
    name: 'Permis bateau',
    icon: faFileAlt,
    description: 'Votre permis bateau valide (si nécessaire pour la location)'
  },
  insurance: {
    name: 'Assurance',
    icon: faShieldAlt,
    description: 'Votre attestation d\'assurance couvrant la location'
  }
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 800);
  }, []);

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedDocType(docType);
      setSelectedFile(file);
      // Ici vous pourriez faire une prévisualisation si c'est une image
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedDocType) return;
    
    setUploading(true);
    
    // Simulation d'upload
    setTimeout(() => {
      const newDocument = {
        id: Math.max(...documents.map(d => d.id)) + 1,
        type: selectedDocType,
        file_url: URL.createObjectURL(selectedFile),
        is_verified: null,
        message: null,
        created_at: new Date().toISOString()
      };
      
      setDocuments(prev => prev.map(doc => 
        doc.type === selectedDocType ? newDocument : doc
      ));
      
      setSelectedFile(null);
      setSelectedDocType(null);
      setUploading(false);
    }, 1500);
  };

  const handleDelete = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    // Ici vous enverriez la demande de suppression au serveur
  };

  const getStatusInfo = (doc) => {
    if (doc.is_verified === true) {
      return { text: 'Validé', color: 'text-green-600', icon: faCheckCircle };
    }
    if (doc.is_verified === false) {
      return { text: 'Rejeté', color: 'text-red-600', icon: faTimesCircle };
    }
    return { text: 'En attente', color: 'text-yellow-600', icon: faClock };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des documents...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Mes Documents</h2>
      
      <div className="space-y-6">
        {Object.entries(documentTypes).map(([docType, docInfo]) => {
          const existingDoc = documents.find(doc => doc.type === docType);
          const statusInfo = existingDoc ? getStatusInfo(existingDoc) : null;
          
          return (
            <div key={docType} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon 
                    icon={docInfo.icon} 
                    className="text-xl text-mocha" 
                  />
                  <div>
                    <h3 className="font-semibold">{docInfo.name}</h3>
                    <p className="text-sm text-gray-600">{docInfo.description}</p>
                  </div>
                </div>
                
                {existingDoc?.is_verified === false && (
                  <div className="text-sm text-red-600">
                    {existingDoc.message}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {existingDoc?.file_url ? (
                  <>
                    <div className="flex items-center gap-3">
                      <a 
                        href={existingDoc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-blue hover:underline"
                      >
                        Voir le document
                      </a>
                      <span className={`flex items-center gap-1 text-sm ${statusInfo.color}`}>
                        <FontAwesomeIcon icon={statusInfo.icon} />
                        {statusInfo.text}
                      </span>
                      {existingDoc.created_at && (
                        <span className="text-sm text-gray-500">
                          Ajouté le {new Date(existingDoc.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded cursor-pointer transition">
                        <FontAwesomeIcon icon={faUpload} className="mr-1" />
                        Remplacer
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, docType)}
                          accept={docType === 'id_card' ? 'image/*' : '.pdf,.doc,.docx'}
                        />
                      </label>
                      <button
                        onClick={() => handleDelete(existingDoc.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-400 px-3 py-1 rounded transition"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500">Aucun document téléchargé</p>
                    <label className="bg-mocha hover:bg-mocha-dark text-white px-3 py-1 rounded cursor-pointer transition inline-flex items-center">
                      <FontAwesomeIcon icon={faUpload} className="mr-1" />
                      Télécharger
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, docType)}
                        accept={docType === 'id_card' ? 'image/*' : '.pdf,.doc,.docx'}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'upload */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirmer l'upload pour {documentTypes[selectedDocType]?.name}
            </h3>
            
            <div className="mb-4">
              <p className="font-medium">Fichier sélectionné :</p>
              <p className="truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setSelectedDocType(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-mocha text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {uploading ? 'Envoi en cours...' : 'Confirmer l\'upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;