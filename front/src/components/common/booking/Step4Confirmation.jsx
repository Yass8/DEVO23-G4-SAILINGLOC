import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faClock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const Step4Confirmation = ({
  firstName,
  lastName,
  email,
  phone,
  birthDate,
  address,
  boat,
  startDate,
  endDate,
  days,
  passengers,
  identityFile,
  licenseFile,
  addressFile,
  totalPrice,
  prevStep,
  handleSubmit,
  isLoading,
  formErrors
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Confirmation de votre demande</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center text-slate-blue mb-4">
          <FontAwesomeIcon icon={faClock} className="text-xl mr-3" />
          <div>
            {/* <h3 className="font-semibold">Demande en attente d'approbation</h3> */}
            <p className="text-sm text-slate-blue mt-1">
              Votre demande de réservation sera examinée par le propriétaire. 
              Vous recevrez un email pour finaliser le paiement une fois approuvée.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md mt-4">
          <p className="text-sm text-gray-600">
            <FontAwesomeIcon icon={faCheckCircle} className="text-mocha mr-2" />
            Aucun paiement ne sera effectué avant l'approbation du propriétaire
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-medium text-lg mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Prénom</p>
            <p className="font-medium">{firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-medium">{lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Téléphone</p>
            <p className="font-medium">{phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date de naissance</p>
            <p className="font-medium">{birthDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Adresse</p>
            <p className="font-medium">{address}</p>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mb-4 mt-6">Détails de la location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Bateau</p>
            <p className="font-medium">{boat.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dates</p>
            <p className="font-medium">
              {startDate?.toLocaleDateString()} au {endDate?.toLocaleDateString()} ({days} jours)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Passagers</p>
            <p className="font-medium">{passengers} {passengers === 1 ? 'personne' : 'personnes'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Port</p>
            <p className="font-medium">{boat.port?.name}</p>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mb-4 mt-6">Documents fournis</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-mocha mr-2" />
            <span className="text-sm">{identityFile?.name || "Pièce d'identité"}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-mocha mr-2" />
            <span className="text-sm">{licenseFile?.name || "Permis nautique/CV"}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-mocha mr-2" />
            <span className="text-sm">{addressFile?.name || "Justificatif de domicile"}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total à régler après approbation</span>
            <span className="text-xl font-bold">{totalPrice.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {formErrors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{formErrors.submit}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={isLoading}
          className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Envoi en cours...
            </>
          ) : (
            "Confirmer la demande"
          )}
        </button>
      </div>
    </div>
  );
};