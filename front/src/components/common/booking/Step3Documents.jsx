import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

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
  handleFileUpload
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vos documents</h2>
      <p className="text-gray-600 mb-6">Pour finaliser votre réservation, veuillez fournir les documents suivants :</p>
      
      <div className="space-y-6">
        {/* Pièce d'identité */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pièce d'identité (Carte d'identité ou Passeport)
          </label>
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

        {/* Permis nautique */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permis nautique ou CV (Carte de Vocation)
          </label>
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

        {/* Justificatif de domicile */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificatif de domicile (de moins de 3 mois)
          </label>
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
          disabled={!identityFile || !licenseFile || !addressFile}
          className={`px-6 py-3 rounded-md transition-colors ${!identityFile || !licenseFile || !addressFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};