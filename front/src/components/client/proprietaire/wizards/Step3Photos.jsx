import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload, faFilePdf, faFileWord, faFileExcel, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Step3Photos({ data, setData, mainIndex, setMainIndex, errors }) {
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [registrationFile, setRegistrationFile] = useState(null);

  // Mettre à jour les états locaux quand les fichiers changent
  useEffect(() => {
    setInsuranceFile(data.insurance_file);
  }, [data.insurance_file]);

  useEffect(() => {
    setRegistrationFile(data.registration_file);
  }, [data.registration_file]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setData({
        ...data,
        photos: [...data.photos, ...files]
      });
      if (data.photos.length === 0) setMainIndex(0);
    }
  };

  const handleInsuranceFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        insurance_file: file
      });
    }
  };

  const handleRegistrationFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({
        ...data,
        registration_file: file
      });
    }
  };

  const removeInsuranceFile = () => {
    setData({
      ...data,
      insurance_file: null
    });
  };

  const removeRegistrationFile = () => {
    setData({
      ...data,
      registration_file: null
    });
  };

  const removePhoto = (idx) => {
    const newPhotos = data.photos.filter((_, i) => i !== idx);
    setData({
      ...data,
      photos: newPhotos
    });
    if (idx === mainIndex) setMainIndex(Math.max(0, newPhotos.length - 1));
  };

  const getFileIcon = (file) => {
    if (!file) return faFilePdf;
    
    const type = file.type;
    if (type.includes('pdf')) return faFilePdf;
    if (type.includes('word') || type.includes('document')) return faFileWord;
    if (type.includes('excel') || type.includes('sheet')) return faFileExcel;
    if (type.includes('image')) return faFileImage;
    return faFilePdf;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-mocha">Photos et documents du bateau</h2>
      
      {/* Section Photos */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-mocha">Photos</h3>
        
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-mocha file:text-sand hover:file:bg-mocha-dark"
          />
          <p className="text-inherit">Séléctionne toutes les photos du bateau en même temps</p>
          
          {errors.photos && (
            <p className="text-sm text-red-500">{errors.photos}</p>
          )}

          {data.photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {data.photos.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx + 1}`}
                    className={`w-full h-32 object-cover rounded border-2 ${
                      idx === mainIndex ? "border-mocha" : "border-transparent"
                    }`}
                    onClick={() => setMainIndex(idx)}
                  />
                  
                  {idx === mainIndex && (
                    <span className="absolute top-1 left-1 bg-mocha text-white text-xs px-2 py-1 rounded">
                      Principale
                    </span>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section Documents */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-mocha">Documents obligatoires</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Assurance */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Assurance</h4>
            
            {insuranceFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={getFileIcon(insuranceFile)} 
                    className="text-mocha mr-2" 
                  />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {insuranceFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(insuranceFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeInsuranceFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (Max. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleInsuranceFile}
                  className="hidden"
                />
              </label>
            )}
            {errors.insurance_file && <p className="mt-1 text-sm text-red-500">{errors.insurance_file}</p>}
          </div>

          {/* Immatriculation */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Immatriculation</h4>
            
            {registrationFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={getFileIcon(registrationFile)} 
                    className="text-mocha mr-2" 
                  />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {registrationFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(registrationFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeRegistrationFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                  <p className="text-xs text-gray-400">PDF, JPG, PNG (Max. 5MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleRegistrationFile}
                  className="hidden"
                />
              </label>
            )}
            {errors.registration_file && <p className="mt-1 text-sm text-red-500">{errors.registration_file}</p>}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Ces documents sont obligatoires pour la mise en location de votre bateau. 
          Ils seront vérifiés par notre équipe avant la publication.
        </p>
      </div>
    </div>
  );
}