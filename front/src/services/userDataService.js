
// userDataService.js - Mock du service utilisateur

// Données mockées des utilisateurs
const mockUsers = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    roles: ['Administrateur'],
    active: true,
    createdAt: '2023-01-15T10:30:00Z',
    lastLogin: '2023-06-20T14:25:00Z',
    address: '12 Rue de la Paix, Paris',
    boats: 0,
    reservations: 5,
    documents: ['ID_CARD', 'LICENSE']
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    phone: '0698765432',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    roles: ['Propriétaire'],
    active: true,
    createdAt: '2023-02-10T09:15:00Z',
    lastLogin: '2023-06-18T11:20:00Z',
    address: '24 Avenue des Champs, Lyon',
    boats: 2,
    reservations: 0,
    totalEarned: 1250,
    documents: ['ID_CARD', 'BOAT_LICENSE']
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@example.com',
    phone: '0678912345',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    roles: ['Locataire'],
    active: true,
    createdAt: '2023-03-05T14:45:00Z',
    lastLogin: '2023-06-19T16:30:00Z',
    address: '5 Boulevard Voltaire, Marseille',
    boats: 0,
    reservations: 3,
    totalSpent: 450,
    documents: ['ID_CARD']
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Petit',
    email: 'sophie.petit@example.com',
    phone: '0687654321',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    roles: ['Locataire', 'Propriétaire'],
    active: false,
    createdAt: '2023-04-20T16:20:00Z',
    lastLogin: '2023-05-15T10:10:00Z',
    address: '8 Rue du Commerce, Lille',
    boats: 1,
    reservations: 2,
    totalSpent: 300,
    totalEarned: 600
  },
  {
    id: '5',
    firstName: 'Luc',
    lastName: 'Moreau',
    email: 'luc.moreau@example.com',
    phone: '0623456789',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    roles: ['Locataire'],
    active: true,
    createdAt: '2023-05-12T11:10:00Z',
    lastLogin: '2023-06-21T09:45:00Z',
    address: '15 Avenue Foch, Bordeaux',
    boats: 0,
    reservations: 1,
    totalSpent: 150
  }
];

// Système de listeners pour les mises à jour en temps réel
const listeners = new Set();

// Fonction pour notifier tous les listeners
const notifyListeners = () => {
  const currentUsers = getAllUsers();
  listeners.forEach(listener => listener(currentUsers));
};

// Fonction pour ajouter un listener
const addListener = (listener) => {
  listeners.add(listener);
  
  // Retourne une fonction pour se désabonner
  return () => listeners.delete(listener);
};

// Fonction pour obtenir tous les utilisateurs
const getAllUsers = () => {
  // Dans un vrai service, on ferait une requête API ici
  return [...mockUsers];
};

// Fonction pour mettre à jour le statut d'un utilisateur
const updateUserStatus = (userId, active) => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      active
    };
    
    notifyListeners();
    return true;
  }
  
  return false;
};

// Fonction pour mettre à jour un utilisateur
const updateUser = (updatedUser) => {
  const userIndex = mockUsers.findIndex(user => user.id === updatedUser.id);
  
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updatedUser
    };
    
    notifyListeners();
    return true;
  }
  
  return false;
};

// Fonction pour obtenir un utilisateur par son ID
const getUserById = (userId) => {
  return mockUsers.find(user => user.id === userId);
};

// Fonction pour ajouter un nouvel utilisateur
const addUser = (newUser) => {
  const userWithId = {
    ...newUser,
    id: `${mockUsers.length + 1}`,
    createdAt: new Date().toISOString(),
    active: true,
    lastLogin: new Date().toISOString()
  };
  
  mockUsers.push(userWithId);
  notifyListeners();
  return userWithId;
};

// Fonction pour supprimer un utilisateur
const deleteUser = (userId) => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    notifyListeners();
    return true;
  }
  
  return false;
};

// Export des fonctions du service
const userDataService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUser,
  addUser,
  deleteUser,
  addListener
};

export default userDataService;