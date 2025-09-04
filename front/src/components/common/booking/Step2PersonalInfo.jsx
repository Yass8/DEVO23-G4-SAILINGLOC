export const Step2PersonalInfo = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  formErrors,
  prevStep,
  nextStep
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vos informations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            required
          />
          {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            required
          />
          {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            required
          />
          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            required
          />
          {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
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
          disabled={!firstName || !lastName || !email || !phone}
          className={`px-6 py-3 rounded-md transition-colors ${!firstName || !lastName || !email || !phone ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};