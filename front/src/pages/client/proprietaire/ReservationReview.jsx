import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faEye,
  faFilePdf,
  faFileImage,
  faPaperclip,
  faCalendarCheck,
  faTimes,
  faIdCard,
  faFileAlt,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

const ReservationReview = () => {
  // Données simulées de la réservation
  const [reservation, setReservation] = useState({
    id: 'RES-2023-456',
    boatName: 'Bénéteau Oceanis 41',
    dates: '15/09/2023 - 22/09/2023',
    totalPrice: 2800,
    user: {
      name: 'Marie Dupont',
      email: 'marie.dupont@example.com',
      phone: '+33 6 12 34 56 78'
    },
    documents: [
      {
        id: 1,
        type: 'id_card',
        name: 'carte_identite.jpg',
        url: 'https://example.com/docs/id_card.jpg',
        isVerified: null,
        message: null
      },
      {
        id: 2,
        type: 'licence',
        name: 'permis_bateau.pdf',
        url: 'https://example.com/docs/licence.pdf',
        isVerified: null,
        message: null
      },
      {
        id: 3,
        type: 'insurance',
        name: 'assurance.pdf',
        url: 'https://example.com/docs/insurance.pdf',
        isVerified: null,
        message: null
      }
    ],
    status: 'pending_review' // pending_review, documents_rejected, approved
  });

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);

  const verifyDocument = (docId, status, message = '') => {
    setReservation(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === docId 
          ? { ...doc, isVerified: status, message } 
          : doc
      )
    }));
  };

  const approveReservation = () => {
    // Vérifier que tous les documents sont approuvés
    const allApproved = reservation.documents.every(doc => doc.isVerified === true);
    
    if (!allApproved) {
      alert('Vous devez approuver tous les documents avant de valider la réservation');
      return;
    }

    setReservation(prev => ({
      ...prev,
      status: 'approved'
    }));
    // Ici vous enverriez la confirmation au serveur
  };

  const rejectReservation = () => {
    setReservation(prev => ({
      ...prev,
      status: 'documents_rejected'
    }));
    // Ici vous enverriez le rejet au serveur
  };

  const getDocIcon = (docType) => {
    switch(docType) {
      case 'id_card': return faIdCard;
      case 'licence': return faFileAlt;
      case 'insurance': return faShieldAlt;
      default: return faPaperclip;
    }
  };

  const getFileIcon = (fileName) => {
    return fileName.endsWith('.pdf') ? faFilePdf : faFileImage;
  };

  const getStatusBadge = () => {
    switch(reservation.status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Acceptée</span>;
      case 'documents_rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Documents rejetés</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">En attente</span>;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Demande de réservation #{reservation.id}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">Informations sur la location</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Bateau:</span> {reservation.boatName}</p>
            <p><span className="font-medium">Dates:</span> {reservation.dates}</p>
            <p><span className="font-medium">Prix total:</span> {reservation.totalPrice} €</p>
            <p><span className="font-medium">Statut:</span> {getStatusBadge()}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Locataire</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Nom:</span> {reservation.user.name}</p>
            <p><span className="font-medium">Email:</span> {reservation.user.email}</p>
            <p><span className="font-medium">Téléphone:</span> {reservation.user.phone}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPaperclip} />
          Documents fournis
        </h3>
        
        <div className="space-y-3">
          {reservation.documents.map(doc => (
            <div key={doc.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={getDocIcon(doc.type)} className="text-mocha text-xl" />
                  <div>
                    <p className="font-medium">
                      {doc.type === 'id_card' ? 'Carte d\'identité' : 
                       doc.type === 'licence' ? 'Permis bateau' : 'Assurance'}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FontAwesomeIcon icon={getFileIcon(doc.name)} />
                      {doc.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setViewerOpen(true);
                    }}
                    className="text-slate-blue hover:text-mocha p-2"
                    title="Voir le document"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
              
              {doc.isVerified !== null && (
                <div className={`mt-2 p-2 rounded ${
                  doc.isVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={doc.isVerified ? faCheckCircle : faTimesCircle} />
                    <span>{doc.isVerified ? 'Document accepté' : 'Document refusé'}</span>
                  </div>
                  {doc.message && <p className="text-sm mt-1">Message: {doc.message}</p>}
                </div>
              )}
              
              {doc.isVerified === null && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => verifyDocument(doc.id, true)}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-100"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                    Accepter
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setRejectionMessage('');
                    }}
                    className="bg-red-50 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-100"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions finales */}
      {reservation.status === 'pending_review' && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendarCheck} />
            Décision finale
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={approveReservation}
              className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Valider la réservation
            </button>
            
            <button
              onClick={rejectReservation}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTimesCircle} />
              Refuser la réservation
            </button>
          </div>
        </div>
      )}

      {/* Modal de visualisation de document */}
      {viewerOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                {selectedDoc.type === 'id_card' ? 'Carte d\'identité' : 
                 selectedDoc.type === 'licence' ? 'Permis bateau' : 'Assurance'}
              </h3>
              <button 
                onClick={() => setViewerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              {selectedDoc.url.endsWith('.pdf') ? (
                <iframe 
                  src={selectedDoc.url} 
                  className="w-full h-full min-h-[70vh] border" 
                  title={selectedDoc.name}
                />
              ) : (
                <img 
                  src={selectedDoc.url} 
                  alt={selectedDoc.name} 
                  className="max-w-full max-h-[70vh] mx-auto block"
                />
              )}
            </div>
            
            <div className="border-t p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {selectedDoc.name}
                </span>
                <div className="flex gap-2">
                  <a 
                    href={selectedDoc.url} 
                    download
                    className="text-mocha hover:text-mocha-dark"
                  >
                    Télécharger
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de refus de document */}
      {selectedDoc && !viewerOpen && selectedDoc.isVerified === null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Pourquoi refusez-vous ce document ?
            </h3>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Message (optionnel)</label>
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-mocha focus:border-transparent"
                rows="3"
                placeholder="Ex: La photo est floue, le document est expiré..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  verifyDocument(selectedDoc.id, false, rejectionMessage);
                  setSelectedDoc(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationReview;