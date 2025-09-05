import { useState, useEffect } from "react";
import { isAuthenticated, isTokenValid, getCurrentUser } from "../../../services/authService";
import { fetchUserDocuments } from "../../../services/userServices";
import { faCheckCircle, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Step3Documents = ({
  identityFile,
  setIdentityFile,
  licenseFile,
  setLicenseFile,
  addressFile,
  setAddressFile,
  uploadProgress,
  formErrors,
  prevStep,
  nextStep,
  handleFileUpload,
}) => {
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState({});

  useEffect(() => {
    const loadUserDocuments = async () => {
      if (!isAuthenticated()) {
      return;
    }
    
    if (!isTokenValid()) {
      // Optionnel : déconnecter l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return;
    }
      

        try {
          setDocumentsLoading(true);
          const user = getCurrentUser();

          if (user && user.id) {
            const documents = await fetchUserDocuments(user.id);

            // Organiser les documents par type exact
            const organizedDocs = {
              id_card: documents.find((doc) => doc.type === "id_card"),
              licence: documents.find((doc) => doc.type === "licence"),
              cv: documents.find((doc) => doc.type === "cv"),
              proof_of_address: documents.find(
                (doc) => doc.type === "proof_of_address"
              ),
              insurance: documents.find((doc) => doc.type === "insurance"),
            };

            setExistingDocuments(organizedDocs);

            // Pré-remplir les fichiers si approuvés
            if (organizedDocs.id_card && organizedDocs.id_card.is_approved) {
              setIdentityFile({
                name:
                  organizedDocs.id_card.file_url.split("/").pop() ||
                  "Carte d'identité",
                url: organizedDocs.id_card.file_url,
              });
            }
            if (organizedDocs.licence && organizedDocs.licence.is_approved) {
              setLicenseFile({
                name:
                  organizedDocs.licence.file_url.split("/").pop() ||
                  "Permis nautique",
                url: organizedDocs.licence.file_url,
              });
            } else if (organizedDocs.cv && organizedDocs.cv.is_approved) {
              setLicenseFile({
                name:
                  organizedDocs.cv.file_url.split("/").pop() || "CV nautique",
                url: organizedDocs.cv.file_url,
              });
            }
            if (
              organizedDocs.proof_of_address &&
              organizedDocs.proof_of_address.is_approved
            ) {
              setAddressFile({
                name:
                  organizedDocs.proof_of_address.file_url.split("/").pop() ||
                  "Justificatif de domicile",
                url: organizedDocs.proof_of_address.file_url,
              });
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des documents:", error);
        } finally {
          setDocumentsLoading(false);
        }
      
    };

    loadUserDocuments();
  }, [setIdentityFile, setLicenseFile, setAddressFile]);
  
  if (documentsLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Vos documents</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha"></div>
          <span className="ml-3 text-gray-600">Chargement des documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vos documents</h2>
      <p className="text-gray-600 mb-6">Pour finaliser votre réservation, veuillez fournir les documents suivants :</p>
      
      {/* Affichage des documents existants approuvés */}
      {(existingDocuments.id_card?.is_approved || 
        existingDocuments.licence?.is_approved || 
        existingDocuments.cv?.is_approved ||
        existingDocuments.proof_of_address?.is_approved) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-green-800 mb-2">Documents déjà approuvés</h3>
          <div className="space-y-2">
            {existingDocuments.id_card?.is_approved && (
              <div className="flex items-center text-green-700">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                <span>Pièce d'identité approuvée</span>
              </div>
            )}
            {(existingDocuments.licence?.is_approved || existingDocuments.cv?.is_approved) && (
              <div className="flex items-center text-green-700">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                <span>Permis nautique/CV approuvé</span>
              </div>
            )}
            {existingDocuments.proof_of_address?.is_approved && (
              <div className="flex items-center text-green-700">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                <span>Justificatif de domicile approuvé</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Pièce d'identité - id_card */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pièce d'identité (Carte d'identité ou Passeport)
            {existingDocuments.id_card && (
              <span className={`ml-2 text-xs ${existingDocuments.id_card.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                ({existingDocuments.id_card.is_approved ? 'Approuvé' : 'En attente de validation'})
              </span>
            )}
          </label>
          
          {existingDocuments.id_card?.is_approved ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <span className="text-sm">Document déjà approuvé</span>
                </div>
                <a 
                  href={existingDocuments.id_card.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-mocha hover:text-mocha/80 text-sm"
                >
                  Voir le document
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-mocha">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faFileUpload} className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    {identityFile ? identityFile.name : "Cliquez pour télécharger"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG ou PNG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files[0], setIdentityFile, 'identity')}
                />
              </label>
            </div>
          )}
          
          {uploadProgress.identity > 0 && uploadProgress.identity < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-mocha h-2.5 rounded-full" 
                style={{ width: `${uploadProgress.identity}%` }}
              ></div>
            </div>
          )}
          {formErrors.identityFile && <p className="text-red-500 text-xs mt-1">{formErrors.identityFile}</p>}
        </div>

        {/* Permis nautique - licence ou cv */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permis nautique ou CV (Carte de Vocation)
            {(existingDocuments.licence || existingDocuments.cv) && (
              <span className={`ml-2 text-xs ${
                (existingDocuments.licence?.is_approved || existingDocuments.cv?.is_approved) ? 'text-green-600' : 'text-yellow-600'
              }`}>
                ({(existingDocuments.licence?.is_approved || existingDocuments.cv?.is_approved) ? 'Approuvé' : 'En attente de validation'})
              </span>
            )}
          </label>
          
          {(existingDocuments.licence?.is_approved || existingDocuments.cv?.is_approved) ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <span className="text-sm">Document déjà approuvé</span>
                </div>
                <a 
                  href={(existingDocuments.licence?.is_approved ? existingDocuments.licence.file_url : existingDocuments.cv?.file_url)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-mocha hover:text-mocha/80 text-sm"
                >
                  Voir le document
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-mocha">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faFileUpload} className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    {licenseFile ? licenseFile.name : "Cliquez pour télécharger"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG ou PNG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files[0], setLicenseFile, 'license')}
                />
              </label>
            </div>
          )}
          
          {uploadProgress.license > 0 && uploadProgress.license < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-mocha h-2.5 rounded-full" 
                style={{ width: `${uploadProgress.license}%` }}
              ></div>
            </div>
          )}
          {formErrors.licenseFile && <p className="text-red-500 text-xs mt-1">{formErrors.licenseFile}</p>}
        </div>

        {/* Justificatif de domicile - proof_of_address */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificatif de domicile (de moins de 3 mois)
            {existingDocuments.proof_of_address && (
              <span className={`ml-2 text-xs ${existingDocuments.proof_of_address.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                ({existingDocuments.proof_of_address.is_approved ? 'Approuvé' : 'En attente de validation'})
              </span>
            )}
          </label>
          
          {existingDocuments.proof_of_address?.is_approved ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                  <span className="text-sm">Document déjà approuvé</span>
                </div>
                <a 
                  href={existingDocuments.proof_of_address.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-mocha hover:text-mocha/80 text-sm"
                >
                  Voir le document
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-mocha">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faFileUpload} className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    {addressFile ? addressFile.name : "Cliquez pour télécharger"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG ou PNG (MAX. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files[0], setAddressFile, 'address')}
                />
              </label>
            </div>
          )}
          
          {uploadProgress.address > 0 && uploadProgress.address < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-mocha h-2.5 rounded-full" 
                style={{ width: `${uploadProgress.address}%` }}
              ></div>
            </div>
          )}
          {formErrors.addressFile && <p className="text-red-500 text-xs mt-1">{formErrors.addressFile}</p>}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
        >
          Retour
        </button>
        <button
          onClick={nextStep}
          disabled={
            (!identityFile && !existingDocuments.id_card?.is_approved) ||
            (!licenseFile && !existingDocuments.licence?.is_approved && !existingDocuments.cv?.is_approved) ||
            (!addressFile && !existingDocuments.proof_of_address?.is_approved)
          }
          className={`px-6 py-3 rounded-md transition-colors ${
            (!identityFile && !existingDocuments.id_card?.is_approved) ||
            (!licenseFile && !existingDocuments.licence?.is_approved && !existingDocuments.cv?.is_approved) ||
            (!addressFile && !existingDocuments.proof_of_address?.is_approved)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-mocha hover:bg-mocha/90'
          } text-white font-medium`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};