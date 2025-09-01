const Step4Recap = ({ boat, startDate, endDate, passengers, firstName, lastName, email, phone, address, identityFile, licenseFile, addressFile, totalPrice, setStep }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Récapitulatif de votre réservation</h2>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h3 className="font-medium text-lg mb-4">Informations personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <p><strong>Prénom :</strong> {firstName}</p>
        <p><strong>Nom :</strong> {lastName}</p>
        <p><strong>Email :</strong> {email}</p>
        <p><strong>Téléphone :</strong> {phone}</p>
        <p><strong>Adresse :</strong> {address}</p>
      </div>

      <h3 className="font-medium text-lg mb-4 mt-6">Détails de la location</h3>
      <p><strong>Bateau :</strong> {boat.name}</p>
      <p><strong>Dates :</strong> {startDate?.toLocaleDateString()} au {endDate?.toLocaleDateString()}</p>
      <p><strong>Passagers :</strong> {passengers}</p>
      <p><strong>Port :</strong> {boat.port?.name}</p>

      <h3 className="font-medium text-lg mb-4 mt-6">Documents fournis</h3>
      <p>{identityFile?.name}</p>
      <p>{licenseFile?.name}</p>
      <p>{addressFile?.name}</p>

      <div className="border-t mt-6 pt-4 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{totalPrice}€</span>
      </div>
    </div>

    <div className="flex justify-between">
      <button onClick={() => setStep(3)} className="px-6 py-3 bg-gray-200 rounded-md">Retour</button>
      <button onClick={() => setStep(5)} className="px-6 py-3 bg-mocha text-white rounded-md">Procéder au paiement</button>
    </div>
  </div>
);

export default Step4Recap;