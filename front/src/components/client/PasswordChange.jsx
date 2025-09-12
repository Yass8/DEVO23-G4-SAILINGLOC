import React, { useState, useEffect } from 'react';

const PasswordChange = ({ onSave, onCancel, serverErrors, email }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });
  
  const [focusedFields, setFocusedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effet pour synchroniser les erreurs serveur avec les champs
  useEffect(() => {
    if (serverErrors.length > 0) {
      const newErrors = {};
      
      serverErrors.forEach(error => {
        if (error.message.includes('ancien mot de passe') || error.message.toLowerCase().includes('oldpassword')) {
          newErrors.oldPassword = error.message;
        } else if (error.message.includes('mot de passe') && !error.message.includes('ancien')) {
          newErrors.password = error.message;
        } else if (error.message.includes('email')) {
          // L'email est géré automatiquement
          newErrors.general = error.message;
        }
      });
      
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
  }, [serverErrors]);

  const shouldFloat = (field) => focusedFields[field] || formData[field];
  const handleFocus = (field) => setFocusedFields((prev) => ({ ...prev, [field]: true }));
  const handleBlur = (field) => setFocusedFields((prev) => ({ ...prev, [field]: false }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Le mot de passe actuel est requis';
    }

    if (!formData.password) {
      newErrors.password = 'Le nouveau mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      
      const dataToSend = {
        email: email,
        oldPassword: formData.oldPassword,
        password: formData.password
      };
      
      await onSave(dataToSend);
      setFormData({
        oldPassword: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      // L'erreur est gérée dans le composant parent
      console.error(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: 'oldPassword',
      label: 'Mot de passe actuel',
      type: 'password',
      error: errors.oldPassword
    },
    {
      name: 'password',
      label: 'Nouveau mot de passe',
      type: 'password',
      error: errors.password
    },
    {
      name: 'confirmPassword',
      label: 'Confirmer le mot de passe',
      type: 'password',
      error: errors.confirmPassword
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'erreur général (comme l'email) */}
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {errors.general}
        </div>
      )}
      
      {fields.map((field) => (
        <div className="relative" key={field.name}>
          <label
            htmlFor={field.name}
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat(field.name)
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              field.error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={formData[field.name]}
            onChange={handleInputChange}
            onFocus={() => handleFocus(field.name)}
            onBlur={() => handleBlur(field.name)}
          />
          {field.error && (
            <p className="text-red-500 text-xs mt-1">{field.error}</p>
          )}
        </div>
      ))}
      
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Chargement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default PasswordChange;