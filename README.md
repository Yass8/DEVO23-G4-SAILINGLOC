# SailingLoc - Plateforme de Location de Voiliers

Plateforme fullstack moderna de gestion et location de voiliers, avec tableau de bord administrateur complet et intégration de paiement.

![Stack](https://img.shields.io/badge/Stack-SERN-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat-square)

---

## Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Développement](#-développement)

---

## Fonctionnalités

### Authentification & Sécurité
- Authentification JWT avec refresh tokens
- Hashage des mots de passe (bcrypt)
- CORS et CSRF protection (Helmet)
- Validation des données (express-validator)

### Gestion des Réservations
- Création et gestion des réservations
- Système de contrats numériques
- Suivi des statuts de réservation

### Paiements
- Intégration Stripe
- Support multi-devise
- Historique des transactions

### Gestion Utilisateurs
- Profils utilisateurs et propriétaires
- Système de rôles et permissions
- Notifications par email (Nodemailer)

### Gestion des Bateaux
- Catalogue de voiliers
- Galerie d'images
- Disponibilités et tarification
- Ports de départ

### Système d'Avis
- Avis et évaluations
- Notation des bateaux et propriétaires

### Dashboard Admin
- Interface de gestion complète
- Statistiques et métriques
- Gestion des utilisateurs, bateaux, réservations
- Design responsive (mobile/desktop)

---

## Architecture

### Backend (Node.js + Express)
```
back/
├── routes/              # Routes API RESTful
├── controllers/         # Logique métier
├── services/           # Services réutilisables
├── validators/         # Validation des données
├── middleware/         # CORS, Auth, etc.
├── models/             # Modèles Sequelize/ORM
└── tests/              # Tests unitaires & intégration
```

### Frontend (React + Vite)
```
front/
├── src/
│   ├── components/     # Composants réutilisables
│   │   └── admin/      # Composants d'administration
│   ├── pages/          # Pages principales
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Appels API
│   └── styles/         # Styles Tailwind CSS
└── public/             # Assets statiques
```

---

## Tech Stack

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Sequelize** - ORM
- **JWT** - Authentification
- **Stripe** - Paiements
- **Jest** - Tests unitaires
- **Swagger** - Documentation API

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - Client HTTP
- **React Router** - Navigation
- **React Select** - Composants formulaires
- **SweetAlert2** - Notifications
- **Stripe JS** - Intégration paiements

### DevOps
- **Docker Compose** - Containerisation
- **PostgreSQL** - Database container
- **Node.js** - App container

---

## Installation

### Prérequis
- Docker & Docker Compose
- Node.js 18+ (développement local)
- PostgreSQL 12+

### Avec Docker Compose (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/Yass8/DEVO23-G4-SAILINGLOC.git
cd DEVO23-G4-SAILINGLOC

# Démarrer les services
docker-compose up -d

# Backend disponible sur http://localhost:3000
# Frontend disponible sur http://localhost:5173
```

### Installation Locale

#### Backend
```bash
cd back

# Installer les dépendances
npm install

# Configuration .env
cp .env.example .env
# Éditer .env avec vos paramètres

# Migrations de base de données
npm run migrate

# Démarrage développement
npm run dev

# Démarrage production
npm start

# Tests
npm test
npm run test:cov
```

#### Frontend
```bash
cd front

# Installer les dépendances
npm install

# Démarrage développement
npm run dev

# Build production
npm build

# Linting
npm run lint
```

---

## Structure du Projet

### Routes API
L'API est structurée de manière **modulaire et RESTful**. Toutes les routes sont centralisées dans `routes/routes.js` et importent chaque groupe de routes dédié à une entité métier.

### Validateurs
Les validateurs garantissent l'intégrité des données avant traitement. Chaque route est protégée par des règles de validation personnalisées utilisant `express-validator`.

### Contrôleurs & Services
- **Contrôleurs** : Orchestrent le flux métier et reçoivent les requêtes validées
- **Services** : Encapsulent la logique métier réutilisable, séparation des responsabilités

### Modèles Sequelize
Définissent la structure de la base de données avec relations entre entités (Users, Boats, Reservations, etc.)

---

## API Documentation

Une documentation Swagger est disponible et auto-générée :

```bash
# Accès local
http://localhost:3000/api/docs
```

### Endpoints Principaux
- `GET /api/boats` - Liste les bateaux
- `POST /api/reservations` - Créer une réservation
- `GET /api/users/:id` - Profil utilisateur
- `POST /api/payments/stripe` - Initier paiement

---

## Configuration

### Variables d'Environnement

#### Backend (`.env`)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sailingloc
DB_USER=postgres
DB_PASSWORD=password

# Auth
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Frontend
FRONTEND_URL=http://localhost:5173

# Server
PORT=3000
NODE_ENV=development
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Développement

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nouvelle-fonctionnalite
git add .
git commit -m "feat: description"
git push origin feature/nouvelle-fonctionnalite
```

### Code Style
- ESLint configuré (Frontend & Backend)
- Prettier recommandé pour le formatting

```bash
# Frontend linting
cd front && npm run lint

# Backend tests
cd back && npm test
```

### Tests

#### Backend
```bash
npm test                # Tous les tests
npm run test:unit      # Tests unitaires uniquement
npm run test:watch     # Watch mode
npm run test:cov       # Coverage report
```

---

## Design & UI

**Palette de Couleurs** (Admin Panel)
-  Mocha: `#AD7C59` - Couleur principale
-  Slate Blue: `#4B6A88` - Éléments secondaires  
-  Pale Blue: `#87CEEB` - Accents
-  Sage Green: `#C1D0C4` - Éléments positifs

**Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## Équipe

Projet développé par le **Groupe 4** - DEVO23

---

## Support

Pour toute question ou signaler un bug :
- Créer une [issue](https://github.com/Yass8/DEVO23-G4-SAILINGLOC/issues)
- Consulter la documentation Swagger : `/api/docs`

---

## Roadmap

- [ ] Tests e2e avec Cypress
- [ ] PWA - Mode hors ligne
- [ ] Notifications en temps réel (WebSocket)
- [ ] Analytics et dashboard avancé
- [ ] Intégration CI/CD (GitHub Actions)
- [ ] Déploiement automatisé
