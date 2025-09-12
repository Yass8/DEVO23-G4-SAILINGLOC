import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload, faFileImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Step3Photos({ data, setData, mainIndex, setMainIndex, errors }) {
  const [insuranceFile, setInsuranceFile] = useState(data.insurance_file);
  const [registrationFile, setRegistrationFile] = useState(data.registration_file);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setData({
        ...data,
        photos: [...data.photos, ...files],
      });
      if (data.photos.length === 0) setMainIndex(0);
    }
  };

  const handleInsurance = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, insurance_file: file });
      setInsuranceFile(file);
    }
  };

  const handleRegistration = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, registration_file: file });
      setRegistrationFile(file);
    }
  };

  const removePhoto = (idx) => {
    const newPhotos = data.photos.filter((_, i) => i !== idx);
    setData({ ...data, photos: newPhotos });
    if (idx === mainIndex) setMainIndex(Math.max(0, newPhotos.length - 1));
  };

  const removeFile = (type) => {
    if (type === "insurance") {
      setData({ ...data, insurance_file: null });
      setInsuranceFile(null);
    } else {
      setData({ ...data, registration_file: null });
      setRegistrationFile(null);
    }
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const FileCard = ({ file, onRemove }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={faFileImage} className="text-mocha" />
        <div>
          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
          <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-mocha">Photos et documents du bateau</h2>

      {/* --- PHOTOS --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-mocha">Photos du bateau</h3>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
          <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Cliquez ou glissez vos photos ici</p>
          <p className="text-xs text-gray-400">JPG, PNG (max 5 Mo)</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotos}
            className="hidden"
          />
        </label>

        {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}

        {/* Aperçu des photos */}
        {data.photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.photos.map((file, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className={`w-full h-32 object-cover rounded border-2 cursor-pointer ${
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
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bouton ajouter d'autres photos */}
        {data.photos.length > 0 && (
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-mocha text-mocha rounded hover:bg-mocha hover:text-white cursor-pointer transition">
            <FontAwesomeIcon icon={faUpload} />
            Ajouter d'autres photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotos}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* --- DOCUMENTS --- */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-mocha">Documents obligatoires</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Assurance */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Assurance</h4>
            {insuranceFile ? (
              <FileCard
                file={insuranceFile}
                onRemove={() => removeFile("insurance")}
              />
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
                <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG (max 5 Mo)</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleInsurance}
                  className="hidden"
                />
              </label>
            )}
            {errors.insurance_file && (
              <p className="mt-1 text-sm text-red-500">{errors.insurance_file}</p>
            )}
          </div>

          {/* Immatriculation */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Immatriculation</h4>
            {registrationFile ? (
              <FileCard
                file={registrationFile}
                onRemove={() => removeFile("registration")}
              />
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
                <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Cliquez pour télécharger</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG (max 5 Mo)</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleRegistration}
                  className="hidden"
                />
              </label>
            )}
            {errors.registration_file && (
              <p className="mt-1 text-sm text-red-500">{errors.registration_file}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Ces documents sont obligatoires pour la mise en location de votre bateau. Ils seront vérifiés avant publication.
        </p>
      </div>
    </div>
  );
}