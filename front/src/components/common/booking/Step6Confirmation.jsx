const Step6Confirmation = ({ boat, startDate, endDate, passengers, totalPrice, email }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
    <p className="text-gray-600 mb-6">
      Un email a été envoyé à <strong>{email}</strong>.<br />
      Bateau : <strong>{boat.name}</strong><br />
      Dates : {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}<br />
      Total : <strong>{totalPrice}€</strong>
    </p>
    <button onClick={() => window.location.href = "/"} className="px-6 py-3 bg-mocha text-white rounded-md">
      Retour à l'accueil
    </button>
  </div>
);

export default Step6Confirmation;