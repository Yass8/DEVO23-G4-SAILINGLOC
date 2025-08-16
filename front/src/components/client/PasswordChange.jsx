import React, { useState } from 'react';

const PasswordChange = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [focusedFields, setFocusedFields] = useState({});

  const shouldFloat = (field) => focusedFields[field] || formData[field];
  const handleFocus = (field) => setFocusedFields((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setFocusedFields((prev) => ({ ...prev, [field]: false }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => {
        const labels = ['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'];
        return (
          <div className="relative" key={field}>
            <label
              htmlFor={field}
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat(field)
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              {labels[index]}
            </label>
            <input
              id={field}
              name={field}
              type="password"
              className="w-full p-3 border rounded focus:outline-none focus:ring-1 border-gray-300 focus:ring-mocha"
              value={formData[field]}
              onChange={handleInputChange}
              onFocus={() => handleFocus(field)}
              onBlur={() => handleBlur(field)}
            />
          </div>
        );
      })}
      <div className="flex justify-end gap-2">
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
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default PasswordChange;