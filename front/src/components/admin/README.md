# Composants d'Administration

Ce dossier contient les composants réutilisables pour l'interface d'administration de SailingLoc.

## 📁 Structure des Fichiers

### `AdminNavbar.jsx`
Barre de navigation supérieure de l'interface d'administration.

**Fonctionnalités :**
- Logo et titre de l'application
- Bouton de menu mobile (hamburger)
- Notifications, paramètres, profil utilisateur
- Bouton de déconnexion
- Positionnement responsive avec sidebar

**Props :**
- `sidebarOpen` : État d'ouverture du sidebar
- `setSidebarOpen` : Fonction pour contrôler l'état du sidebar

### `AdminSidebar.jsx`
Barre de navigation latérale avec menu de navigation.

**Fonctionnalités :**
- Logo et titre de l'administration
- Navigation vers toutes les pages admin
- Bouton de fermeture mobile
- Overlay pour mobile
- Footer avec informations utilisateur
- Positionnement responsive

**Props :**
- `sidebarOpen` : État d'ouverture du sidebar
- `setSidebarOpen` : Fonction pour contrôler l'état du sidebar

## 🎨 Design et Couleurs

**Palette de couleurs utilisée :**
- **Mocha** : `#AD7C59` - Couleur principale, éléments actifs
- **Slate Blue** : `#4B6A88` - Éléments secondaires
- **Pale Blue** : `#87CEEB` - Accents
- **Sage Green** : `#C1D0C4` - Éléments positifs

## 📱 Responsive Design

### **Desktop (sm et plus) :**
- Sidebar toujours visible (largeur fixe 256px)
- Navbar positionnée à gauche du sidebar
- Contenu principal avec marge gauche

### **Mobile :**
- Sidebar caché par défaut
- Bouton hamburger dans la navbar
- Overlay sombre lors de l'ouverture
- Sidebar en superposition

## 🔧 Utilisation

### **Dans AdminLayout.jsx :**
```jsx
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AdminNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="p-4 sm:ml-64 mt-16">
        {/* Contenu des pages */}
      </main>
    </div>
  );
}
```

## 🚀 Fonctionnalités

### **Navigation :**
- Tableau de bord (`/admin/sl`)
- Utilisateurs (`/admin/sl/users`)
- Bateaux (`/admin/sl/boats`)
- Réservations (`/admin/sl/reservations`)
- Contrats (`/admin/sl/contracts`)
- Paiements (`/admin/sl/payments`)
- Ports (`/admin/sl/ports`)
- Messages (`/admin/sl/messages`)
- Avis (`/admin/sl/reviews`)
- Paramètres (`/admin/sl/settings`)

### **Interactions :**
- Navigation active avec mise en surbrillance
- Transitions fluides
- Gestion des états mobile/desktop
- Accessibilité (labels, focus)

## 🔄 État et Gestion

### **État du Sidebar :**
- `sidebarOpen` : Boolean pour contrôler l'affichage
- `setSidebarOpen` : Fonction pour modifier l'état
- Gestion automatique du responsive

### **Transitions :**
- CSS transitions pour les animations
- Transform pour le slide du sidebar
- Overlay avec fade in/out

## 📝 Notes Techniques

- Utilisation de Tailwind CSS pour le styling
- Composants fonctionnels React avec hooks
- Gestion des props pour la communication parent-enfant
- Support complet du responsive design
- Intégration avec React Router pour la navigation 