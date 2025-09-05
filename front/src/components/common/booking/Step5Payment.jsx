import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLock, 
  faInfoCircle, 
  faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";
import { CardElement } from "@stripe/react-stripe-js";

export const Step5Payment = ({
  firstName,
  lastName,
  email,
  phone,
  totalPrice,
  paymentError,
  processing,
  isLoading,
  cardComplete,
  setCardComplete,
  formErrors,
  prevStep,
  handleSubmit,
  stripe,
  elements
}) => {
  // Style personnalisé pour l'élément de carte Stripe
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
      
      {/* Avertissement si Stripe n'est pas configuré */}
      {!import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 mr-2 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Mode démonstration</p>
            <p className="text-sm text-yellow-700">Le paiement n'est pas réellement traité car les clés Stripe ne sont pas configurées.</p>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
        <FontAwesomeIcon icon={faLock} className="text-mocha mr-2 mt-1" />
        <p className="text-sm text-slate-blue">
          <span className="font-semibold">Paiement sécurisé</span> - Toutes vos informations sont cryptées et sécurisées.
        </p>
      </div>
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-3">Informations de carte bancaire</label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement 
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        <div className="flex mt-2">
          <FontAwesomeIcon icon={faCcVisa} size="1x" className="text-slate-blue" />
          <FontAwesomeIcon icon={faCcMastercard} size="1x" className="mx-2 text-slate-blue" />
          <FontAwesomeIcon icon={faCcAmex} size="1x" className="text-slate-blue" />
        </div>
      </div>
      
      {paymentError && (
        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-700 text-sm">{paymentError}</p>
        </div>
      )}
      
      <div className="flex items-start mb-6">
        <FontAwesomeIcon icon={faInfoCircle} className="text-mocha mr-2 mt-1" />
        <p className="text-sm text-slate-blue font-bold">
          Votre carte ne sera débitée qu'après confirmation de la réservation par le propriétaire.
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={!stripe || !cardComplete || processing}
          className={`px-6 py-3 rounded-md flex items-center justify-center transition-colors ${!stripe || !cardComplete || processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium min-w-[200px]`}
        >
          {(processing || isLoading) ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement...
            </>
          ) : (
            `Payer ${totalPrice}€`
          )}
        </button>
      </div>
    </div>
  );
};

{/* <Step5Payment
                  totalPrice={totalPrice}
                  paymentError={paymentError}
                  processing={processing}
                  isLoading={isLoading}
                  cardComplete={cardComplete}
                  setCardComplete={setCardComplete}
                  formErrors={formErrors}
                  prevStep={prevStep}
                  handleSubmit={handleSubmit}
                  stripe={stripe}
                  elements={elements}
                /> */}