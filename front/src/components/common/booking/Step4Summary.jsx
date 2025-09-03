import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

export const Step4Summary = ({
  firstName,
  lastName,
  email,
  phone,
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
  nextStep
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Récapitulatif de votre réservation</h2>
      
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
            <FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
            <span className="text-sm">{identityFile?.name}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
            <span className="text-sm">{licenseFile?.name}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-500 mr-2" />
            <span className="text-sm">{addressFile?.name}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold">{totalPrice}€</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
        >
          Retour
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium transition-colors"
        >
          Procéder au paiement
        </button>
      </div>
    </div>
  );
};