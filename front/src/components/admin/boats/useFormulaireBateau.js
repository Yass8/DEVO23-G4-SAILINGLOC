import { useState } from 'react';
import { getInitialBoatFormData } from './ValidationFormulaireBateau';

export const useFormulaireBateau = () => {
  const [formData, setFormData] = useState(getInitialBoatFormData());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEquipmentChange = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(item => item !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handlePhotoChange = (files) => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const handlePhotoRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData(getInitialBoatFormData());
    setErrors({});
  };

  const setFieldError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const clearFieldError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    handleInputChange,
    handleEquipmentChange,
    handlePhotoChange,
    handlePhotoRemove,
    resetForm,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
}; 