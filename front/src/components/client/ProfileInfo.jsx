import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';

const ProfileInfo = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...userData });
  const [imagePreview, setImagePreview] = useState(null);
  const [focusedFields, setFocusedFields] = useState({});

  const shouldFloat = (field) => focusedFields[field] || formData[field];
  const handleFocus = (field) => setFocusedFields((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setFocusedFields((prev) => ({ ...prev, [field]: false }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderAvatar = () => {
    const imageSrc = imagePreview || userData.photo;
    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-mocha"
        />
      );
    }
    return (
      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
        {userData.firstname[0]}
        {userData.lastname[0]}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          {renderAvatar()}
          <label className="absolute bottom-0 right-0 bg-slate-blue text-white p-2 rounded-full shadow hover:bg-slate-blue-dark transition cursor-pointer">
            <FontAwesomeIcon icon={faCamera} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        {(imagePreview || userData.photo) && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          >
            <FontAwesomeIcon icon={faTrash} />
            Supprimer la photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="relative">
          <label
            htmlFor="firstname"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('firstname')
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Prénom*
          </label>
          <input
            id="firstname"
            name="firstname"
            className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
            value={formData.firstname}
            onChange={handleInputChange}
            onFocus={() => handleFocus('firstname')}
            onBlur={() => handleBlur('firstname')}
          />
        </div>

        {/* Nom */}
        <div className="relative">
          <label
            htmlFor="lastname"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('lastname')
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Nom*
          </label>
          <input
            id="lastname"
            name="lastname"
            className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
            value={formData.lastname}
            onChange={handleInputChange}
            onFocus={() => handleFocus('lastname')}
            onBlur={() => handleBlur('lastname')}
          />
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <label
          htmlFor="email"
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat('email')
              ? '-top-2 text-xs bg-white px-1 text-mocha'
              : 'top-3 text-gray-500'
          }`}
        >
          Email*
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
          value={formData.email}
          onChange={handleInputChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
        />
      </div>

      {/* Téléphone */}
      <div className="relative">
        <label
          htmlFor="phone"
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat('phone')
              ? '-top-2 text-xs bg-white px-1 text-mocha'
              : 'top-3 text-gray-500'
          }`}
        >
          Téléphone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
          value={formData.phone}
          onChange={handleInputChange}
          onFocus={() => handleFocus('phone')}
          onBlur={() => handleBlur('phone')}
        />
      </div>

      {/* Adresse */}
      <div className="relative">
        <label
          htmlFor="address"
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat('address')
              ? '-top-2 text-xs bg-white px-1 text-mocha'
              : 'top-3 text-gray-500'
          }`}
        >
          Adresse
        </label>
        <input
          id="address"
          name="address"
          className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
          value={formData.address}
          onChange={handleInputChange}
          onFocus={() => handleFocus('address')}
          onBlur={() => handleBlur('address')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
};

export default ProfileInfo;