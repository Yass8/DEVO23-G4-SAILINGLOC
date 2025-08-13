import React from 'react';
import { 
  DeleteConfirmation, 
  GeneralConfirmation, 
  SuccessAlert, 
  ErrorAlert, 
  InfoAlert,
  BulkDeleteConfirmation,
  ActivationConfirmation
} from './SweetAlertComponents';

// Composant d'exemple pour montrer l'utilisation des SweetAlerts
const SweetAlertExamples = () => {
  
  // Exemple de suppression simple
  const handleDelete = async () => {
    const confirmed = await DeleteConfirmation(
      'Supprimer cet utilisateur ?',
      'Cette action supprimera définitivement le compte.'
    );
    
    if (confirmed) {
      // Logique de suppression
      console.log('Suppression confirmée');
      SuccessAlert('Utilisateur supprimé !', 'Le compte a été supprimé avec succès.');
    }
  };

  // Exemple de confirmation générale
  const handleGeneralAction = async () => {
    const confirmed = await GeneralConfirmation(
      'Modifier les paramètres ?',
      'Voulez-vous appliquer ces modifications ?',
      'Appliquer',
      'Annuler'
    );
    
    if (confirmed) {
      // Logique de modification
      console.log('Modification confirmée');
      SuccessAlert('Modifications appliquées !', 'Les paramètres ont été mis à jour.');
    }
  };

  // Exemple de suppression en lot
  const handleBulkDelete = async () => {
    const count = 5;
    const confirmed = await BulkDeleteConfirmation(count, 'utilisateurs');
    
    if (confirmed) {
      // Logique de suppression en lot
      console.log(`Suppression de ${count} utilisateurs confirmée`);
      SuccessAlert('Suppression en lot réussie !', `${count} utilisateurs ont été supprimés.`);
    }
  };

  // Exemple d'activation/désactivation
  const handleActivation = async (action) => {
    const confirmed = await ActivationConfirmation(action, 3, 'utilisateurs');
    
    if (confirmed) {
      // Logique d'activation/désactivation
      const actionText = action === 'activate' ? 'activés' : 'désactivés';
      console.log(`3 utilisateurs ${actionText}`);
      SuccessAlert(
        action === 'activate' ? 'Utilisateurs activés !' : 'Utilisateurs désactivés !',
        `3 utilisateurs ont été ${actionText} avec succès.`
      );
    }
  };

  // Exemple d'erreur
  const handleError = () => {
    ErrorAlert('Erreur de connexion', 'Impossible de se connecter au serveur.');
  };

  // Exemple d'information
  const handleInfo = () => {
    InfoAlert('Maintenance prévue', 'Le système sera indisponible demain de 2h à 4h du matin.');
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Exemples d'utilisation des SweetAlerts</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Suppression
        </button>
        
        <button
          onClick={handleGeneralAction}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirmation
        </button>
        
        <button
          onClick={handleBulkDelete}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Suppression en lot
        </button>
        
        <button
          onClick={() => handleActivation('activate')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Activation
        </button>
        
        <button
          onClick={() => handleActivation('deactivate')}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Désactivation
        </button>
        
        <button
          onClick={handleError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Erreur
        </button>
        
        <button
          onClick={handleInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Information
        </button>
      </div>
    </div>
  );
};

export default SweetAlertExamples; 