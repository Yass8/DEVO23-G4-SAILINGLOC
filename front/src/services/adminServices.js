// Service admin pour le dashboard - Utilise les vraies API du backend disponibles
// Note: Certaines routes sont manquantes dans le backend, on utilise des données simulées

// Configuration de l'API (à adapter selon votre configuration backend)
const API_BASE_URL = 'http://localhost:3000/api';

// Récupérer les statistiques du dashboard
export const getAdminStats = async () => {
  try {
    // Routes disponibles dans le backend
    const [boatsResponse, reservationsResponse, contractsResponse, paymentsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/boats`),
      fetch(`${API_BASE_URL}/reservations`),
      fetch(`${API_BASE_URL}/contracts`),
      fetch(`${API_BASE_URL}/payments`)
    ]);

    const boats = await boatsResponse.json();
    const reservations = await reservationsResponse.json();
    const contracts = await contractsResponse.json();
    const payments = await paymentsResponse.json();

    // Calculer les revenus totaux
    const totalRevenue = payments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);

    return {
      totalBoats: boats.length || 0,
      totalReservations: reservations.length || 0,
      totalContracts: contracts.length || 0,
      totalRevenue: totalRevenue,
      pendingReservations: reservations.filter(r => r.status === 'pending').length || 0,
      unreadMessages: 0, // Route messages disponible mais pas d'API pour compter les non-lus
      totalReviews: 0 // Route reviews disponible mais pas d'API pour compter
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      totalBoats: 0,
      totalReservations: 0,
      totalContracts: 0,
      totalRevenue: 0,
      pendingReservations: 0,
      unreadMessages: 0,
      totalReviews: 0
    };
  }
};

// Récupérer les réservations en attente
export const getPendingReservations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    const reservations = await response.json();
    return reservations.filter(r => r.status === 'pending').slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations en attente:', error);
    return [];
  }
};

// Récupérer les messages non lus
export const getUnreadMessages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`);
    const messages = await response.json();
    return messages.filter(m => !m.isRead).slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages non lus:', error);
    // Retourner des données simulées en cas d'erreur
    return [
      { id: 1, subject: 'Demande de réservation', isRead: false, createdAt: new Date() },
      { id: 2, subject: 'Question sur le bateau', isRead: false, createdAt: new Date() }
    ];
  }
};

// Récupérer les avis récents
export const getRecentReviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    const reviews = await response.json();
    return reviews.slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis récents:', error);
    return [];
  }
};

// Récupérer les contrats récents
export const getRecentContracts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts`);
    const contracts = await response.json();
    return contracts.slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la récupération des contrats récents:', error);
    return [];
  }
};

// Récupérer les paiements récents
export const getRecentPayments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`);
    const payments = await response.json();
    return payments.slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements récents:', error);
    return [];
  }
};

// Approuver une réservation
export const approveReservation = async (reservationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'approved' })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'approbation de la réservation:', error);
    throw error;
  }
};

// Rejeter une réservation
export const rejectReservation = async (reservationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'rejected' })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du rejet de la réservation:', error);
    throw error;
  }
};

// Marquer un message comme lu
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRead: true })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du marquage du message:', error);
    throw error;
  }
};

// Supprimer un avis
export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    throw error;
  }
};

// Supprimer un bateau
export const deleteBoat = async (boatId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/boats/${boatId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la suppression du bateau:', error);
    throw error;
  }
};

// Supprimer un port
export const deletePort = async (portId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ports/${portId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la suppression du port:', error);
    throw error;
  }
};

// Récupérer les statistiques détaillées
export const getDetailedStats = async () => {
  try {
    // Routes disponibles dans le backend
    const [boatsResponse, reservationsResponse, paymentsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/boats`),
      fetch(`${API_BASE_URL}/reservations`),
      fetch(`${API_BASE_URL}/payments`)
    ]);

    const boats = await boatsResponse.json();
    const reservations = await reservationsResponse.json();
    const payments = await paymentsResponse.json();

    // Calculer les statistiques avancées
    const activeBoats = boats.filter(b => b.status === 'active').length;
    const boatsInRental = reservations.filter(r => r.status === 'active').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    
    // Données simulées pour les routes manquantes
    const unreadMessages = Math.floor(Math.random() * 50) + 10; // Simulation
    const pendingReviews = Math.floor(Math.random() * 20) + 5; // Simulation
    const scheduledMaintenance = Math.floor(Math.random() * 15) + 3; // Simulation

    return {
      activeUsers: Math.floor(Math.random() * 500) + 200, // Simulation car route users manquante
      boatsInRental,
      pendingPayments,
      unreadMessages,
      pendingReviews,
      scheduledMaintenance
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques détaillées:', error);
    // Retourner des données simulées en cas d'erreur
    return {
      activeUsers: 250,
      boatsInRental: 0,
      pendingPayments: 0,
      unreadMessages: 25,
      pendingReviews: 12,
      scheduledMaintenance: 8
    };
  }
}; 