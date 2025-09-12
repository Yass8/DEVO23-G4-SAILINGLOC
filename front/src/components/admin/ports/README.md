# Page Admin des Ports

## Vue d'ensemble

La page admin des ports permet de gérer tous les ports de la plateforme SAILINGLOC. Elle est basée sur le modèle backend `Port` et offre des fonctionnalités complètes de gestion.

## Composants

### PortHeader
- Affiche le titre "Gestion des Ports" avec la couleur slate-blue `#4B6A88`
- Indicateur "Système actif" avec animation

### PortFilters
- **Recherche** : Recherche par nom, ville ou pays
- **Filtre par pays** : Sélection parmi les pays disponibles
- **Filtre par ville** : Sélection parmi les villes disponibles
- **Bouton d'ajout** : Ouvre le modal de création d'un nouveau port

### PortTable
- **Colonnes** :
  - Port (nom + ID)
  - Localisation (ville + pays)
  - Coordonnées (latitude + longitude)
  - Bateaux (nombre de bateaux associés)
  - Actions (voir, modifier, supprimer)
- **Icônes** : `faMapMarkerAlt` pour les ports, `faShip` pour les bateaux
- **Couleurs** : Utilise la palette de couleurs personnalisée

### PortPagination
- Navigation entre les pages avec affichage intelligent
- Informations sur le nombre d'éléments affichés
- Boutons Précédent/Suivant

### PortModal
- **Mode Ajout** : Création d'un nouveau port
- **Mode Édition** : Modification d'un port existant
- **Validation** : Vérification des champs obligatoires et des coordonnées
- **Champs** :
  - Nom du port (obligatoire)
  - Ville (obligatoire)
  - Pays (obligatoire, liste déroulante)
  - Latitude (optionnel, validation -90 à 90)
  - Longitude (optionnel, validation -180 à 180)

## Fonctionnalités

### CRUD Complet
- **Create** : Ajout de nouveaux ports via le modal
- **Read** : Affichage de tous les ports avec filtres et pagination
- **Update** : Modification des ports existants
- **Delete** : Suppression des ports avec confirmation

### Filtrage et Recherche
- Recherche textuelle sur nom, ville et pays
- Filtrage par pays et ville
- Combinaison des filtres

### Gestion des Erreurs
- Validation des formulaires
- Messages d'erreur contextuels
- Gestion des erreurs API (futur)

## Modèle de Données

Basé sur le modèle backend `Port` :
```javascript
{
  id: Number,
  name: String (requis),
  city: String (requis),
  country: String (requis),
  latitude: Decimal(10,8) (optionnel),
  longitude: Decimal(11,8) (optionnel),
  createdAt: Date,
  updatedAt: Date,
  Boats: Array (relation OneToMany)
}
```

## Intégration Backend

### Routes API
- `GET /ports` - Liste des ports
- `POST /ports/new` - Création d'un port
- `GET /ports/:id/show` - Détails d'un port
- `PUT /ports/:id/edit` - Modification d'un port
- `DELETE /ports/:id/delete` - Suppression d'un port

### Authentification
- Toutes les routes nécessitent une authentification
- Création, modification et suppression réservées aux admins

## Palette de Couleurs

- **Slate-blue** : `#4B6A88` (titres, boutons principaux)
- **Mocha** : `#AD7C59` (boutons d'édition, accents)
- **Pale-blue** : `#87CEEB` (arrière-plans, icônes)
- **Sage-green** : `#9CAF88` (réservé pour d'autres éléments)

## Responsive Design

- Grille adaptative pour les filtres
- Tableau avec défilement horizontal sur mobile
- Modal responsive avec gestion du scroll

## Évolutions Futures

- Intégration avec l'API backend
- Carte interactive pour visualiser les ports
- Import/export de données
- Gestion des images de ports
- Statistiques d'utilisation des ports 