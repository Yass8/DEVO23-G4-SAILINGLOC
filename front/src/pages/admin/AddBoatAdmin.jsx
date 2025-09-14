import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Import des composants
import {
  LayoutAdminBateau,
  InfosGeneralesBateau,
  SpecificationsTechniquesBateau,
  EquipementsBateau,
  TelechargementPhotosBateau,
  validateBoatForm,
  getBoatTypes,
  getCountries,
  getFuelTypes,
  getEquipmentOptions,
  useFormulaireBateau
} from '../../components/admin/boats';

const AddBoatAdmin = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    loading,
    setLoading,
    handleInputChange,
    handleEquipmentChange,
    handlePhotoChange,
    handlePhotoRemove
  } = useFormulaireBateau();

  const boatTypes = getBoatTypes();
  const countries = getCountries();
  const fuelTypes = getFuelTypes();
  const equipmentOptions = getEquipmentOptions();



  const validateForm = () => {
    const { isValid, errors: validationErrors } = validateBoatForm(formData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Swal.fire({
        title: 'Erreur de validation',
        text: 'Veuillez corriger les erreurs dans le formulaire',
        icon: 'error',
        confirmButtonColor: '#AD7C59'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Swal.fire({
        title: 'Succès !',
        text: 'Le bateau a été créé avec succès',
        icon: 'success',
        confirmButtonColor: '#AD7C59'
      }).then(() => {
        navigate('/admin/sl/boats');
      });
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la création du bateau',
        icon: 'error',
        confirmButtonColor: '#AD7C59'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdminBateau
      title={
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/sl/boats')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Retour à la liste des bateaux"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          <span>Ajouter un nouveau bateau</span>
        </div>
      }
      subtitle="Créez un nouveau bateau dans le système"
      actions={
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/sl/boats')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="boatForm"
            disabled={loading}
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#AD7C59] border border-transparent rounded-md hover:bg-[#9B6B47] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création...
              </>
            ) : (
              'Créer le bateau'
            )}
          </button>
        </div>
      }
    >
      {/* Formulaire */}
      <form id="boatForm" className="space-y-6">
        {/* Informations générales */}
        <InfosGeneralesBateau
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          boatTypes={boatTypes}
          countries={countries}
        />
        
        {/* Caractéristiques techniques */}
        <SpecificationsTechniquesBateau
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          fuelTypes={fuelTypes}
        />
        
        {/* Équipements */}
        <EquipementsBateau
          formData={formData}
          onEquipmentChange={handleEquipmentChange}
          equipmentOptions={equipmentOptions}
        />
        
        {/* Photos */}
        <TelechargementPhotosBateau
          formData={formData}
          onPhotoChange={handlePhotoChange}
          onPhotoRemove={handlePhotoRemove}
        />
      </form>
    </LayoutAdminBateau>
  );
};

export default AddBoatAdmin; 