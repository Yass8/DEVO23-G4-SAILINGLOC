import Swal from 'sweetalert2';

// Composant pour la suppression avec confirmation
export const DeleteConfirmation = async (title = 'Êtes-vous sûr ?', text = 'Cette action est irréversible.') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  });
  
  return result.isConfirmed;
};

// Composant pour la confirmation générale
export const GeneralConfirmation = async (title = 'Confirmation', text = 'Voulez-vous continuer ?', confirmText = 'Confirmer', cancelText = 'Annuler') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#AD7C59',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true
  });
  
  return result.isConfirmed;
};

// Composant pour le succès
export const SuccessAlert = (title = 'Succès !', text = 'Opération réussie.') => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK'
  });
};

export const SuccessAlert2 = (title = 'Succès !', text = 'Opération réussie.') => {
  return Swal.fire({          
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#10b981',
    confirmButtonText: 'OK'
  });
};

// Composant pour l'erreur
export const ErrorAlert = (title = 'Erreur !', text = 'Une erreur est survenue.') => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK'
  });
};

// Composant pour l'information
export const InfoAlert = (title = 'Information', text = 'Information importante.') => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'info',
    confirmButtonColor: '#3b82f6',
    confirmButtonText: 'OK'
  });
};

// Composant pour la suppression en lot
export const BulkDeleteConfirmation = async (count, itemName = 'éléments') => {
  const result = await Swal.fire({
    title: 'Suppression en lot',
    text: `Êtes-vous sûr de vouloir supprimer ${count} ${itemName} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: `Oui, supprimer ${count}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true
  });
  
  return result.isConfirmed;
};

// Composant pour la confirmation d'activation/désactivation
export const ActivationConfirmation = async (action, count = 1, itemName = 'utilisateur') => {
  const actionText = action === 'activate' ? 'activer' : 'désactiver';
  const actionTitle = action === 'activate' ? 'Activation' : 'Désactivation';
  
  const result = await Swal.fire({
    title: actionTitle,
    text: `Êtes-vous sûr de vouloir ${actionText} ${count} ${itemName} ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#AD7C59',
    cancelButtonColor: '#6b7280',
    confirmButtonText: `Oui, ${actionText}`,
    cancelButtonText: 'Annuler',
    reverseButtons: true
  });
  
  return result.isConfirmed;
}; 