import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Step3Photos({ data, setData, mainIndex, setMainIndex, errors }) {
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

  const removePhoto = (idx) => {
    const newPhotos = data.photos.filter((_, i) => i !== idx);
    setData({
      ...data,
      photos: newPhotos
    });
    if (idx === mainIndex) setMainIndex(Math.max(0, newPhotos.length - 1));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Photos du bateau</h2>
      
      <div className="space-y-2">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-mocha file:text-sand hover:file:bg-mocha-dark"
        />
        
        {errors.photos && (
          <p className="text-sm text-red-500">{errors.photos}</p>
        )}

        {data.photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
  );
}