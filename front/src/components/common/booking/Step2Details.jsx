const Step2Details = ({ firstName, setFirstName, lastName, setLastName, email, setEmail, phone, setPhone, address, setAddress, setStep }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-6">Vos informations</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3 border rounded-md" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border rounded-md" />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
      <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-md" />
    </div>

    <div className="flex justify-between">
      <button onClick={() => setStep(1)} className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium">Retour</button>
      <button onClick={() => setStep(3)} className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium">Continuer</button>
    </div>
  </div>
);

export default Step2Details;