const Step3Documents = ({ identityFile, setIdentityFile, licenseFile, setLicenseFile, addressFile, setAddressFile, setStep }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Vos documents</h2>
    <p className="text-gray-600 mb-6">Pour finaliser votre réservation, veuillez fournir les documents suivants :</p>

    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pièce d'identité</label>
        <input type="file" onChange={(e) => setIdentityFile(e.target.files[0])} className="w-full p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Permis nautique</label>
        <input type="file" onChange={(e) => setLicenseFile(e.target.files[0])} className="w-full p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Justificatif de domicile</label>
        <input type="file" onChange={(e) => setAddressFile(e.target.files[0])} className="w-full p-2 border rounded-md" />
      </div>
    </div>

    <div className="flex justify-between mt-8">
      <button onClick={() => setStep(2)} className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">Retour</button>
      <button onClick={() => setStep(4)} className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium">Continuer</button>
    </div>
  </div>
);

export default Step3Documents;