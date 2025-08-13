# Composants SweetAlert2 Réutilisables

Ce dossier contient des composants JSX réutilisables basés sur SweetAlert2 pour gérer les alertes et confirmations dans l'application.

## 📦 Installation

Assurez-vous d'avoir SweetAlert2 installé :

```bash
npm install sweetalert2
```

## 🚀 Composants Disponibles

### 1. `DeleteConfirmation`
Confirmation de suppression avec style d'avertissement.

```jsx
import { DeleteConfirmation } from './SweetAlertComponents';

const handleDelete = async () => {
  const confirmed = await DeleteConfirmation(
    'Supprimer cet utilisateur ?',
    'Cette action est irréversible.'
  );
  
  if (confirmed) {
    // Logique de suppression
  }
};
```

### 2. `GeneralConfirmation`
Confirmation générale personnalisable.

```jsx
import { GeneralConfirmation } from './SweetAlertComponents';

const confirmed = await GeneralConfirmation(
  'Modifier les paramètres ?',
  'Voulez-vous appliquer ces modifications ?',
  'Appliquer',
  'Annuler'
);
```

### 3. `SuccessAlert`
Alerte de succès.

```jsx
import { SuccessAlert } from './SweetAlertComponents';

SuccessAlert('Succès !', 'Opération réussie.');
```

### 4. `ErrorAlert`
Alerte d'erreur.

```jsx
import { ErrorAlert } from './SweetAlertComponents';

ErrorAlert('Erreur !', 'Une erreur est survenue.');
```

### 5. `InfoAlert`
Alerte d'information.

```jsx
import { InfoAlert } from './SweetAlertComponents';

InfoAlert('Information', 'Information importante.');
```

### 6. `BulkDeleteConfirmation`
Confirmation de suppression en lot.

```jsx
import { BulkDeleteConfirmation } from './SweetAlertComponents';

const confirmed = await BulkDeleteConfirmation(5, 'utilisateurs');
```

### 7. `ActivationConfirmation`
Confirmation d'activation/désactivation.

```jsx
import { ActivationConfirmation } from './SweetAlertComponents';

const confirmed = await ActivationConfirmation('activate', 3, 'utilisateurs');
```

## 🎨 Personnalisation

Tous les composants utilisent la palette de couleurs du projet :

- **Couleur principale** : `#AD7C59` (mocha)
- **Couleur d'erreur** : `#ef4444` (rouge)
- **Couleur de succès** : `#10b981` (vert)
- **Couleur d'information** : `#3b82f6` (bleu)
- **Couleur d'annulation** : `#6b7280` (gris)

## 📱 Utilisation dans les Composants

```jsx
import React from 'react';
import { DeleteConfirmation, SuccessAlert } from './SweetAlertComponents';

const MyComponent = () => {
  const handleDeleteUser = async (userId) => {
    const confirmed = await DeleteConfirmation(
      'Supprimer cet utilisateur ?',
      'Cette action supprimera définitivement le compte.'
    );
    
    if (confirmed) {
      try {
        // Appel API de suppression
        await deleteUser(userId);
        SuccessAlert('Utilisateur supprimé !', 'Le compte a été supprimé avec succès.');
      } catch (error) {
        ErrorAlert('Erreur !', 'Impossible de supprimer l\'utilisateur.');
      }
    }
  };

  return (
    <button onClick={() => handleDeleteUser(123)}>
      Supprimer
    </button>
  );
};
```

## 🔧 Fonctionnalités

- **Async/Await** : Tous les composants de confirmation retournent une Promise
- **Personnalisation** : Textes et couleurs personnalisables
- **Responsive** : S'adapte à tous les écrans
- **Accessibilité** : Support des lecteurs d'écran
- **Internationalisation** : Prêt pour la traduction

## 📝 Exemples Complets

Consultez le fichier `SweetAlertExamples.jsx` pour des exemples d'utilisation complets de tous les composants. 