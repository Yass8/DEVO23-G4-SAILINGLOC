import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faShip, 
  faCalendarCheck, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faClock, 
  faCheckCircle, 
  faTimesCircle, 
  faSpinner,
  faEdit,
  faTrash,
  faEye,
  faStar,
  faEuroSign,
  faCalendarAlt,
  faAnchor,
  faRuler,
  faUsers,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { 
  ActivationConfirmation, 
  SuccessAlert, 
  ErrorAlert 
} from '../../components/common/SweetAlertComponents';
import userDataService from '../../services/userDataService';

const DetailsUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab] = useState('profile');

  // Récupérer l'ID depuis l'URL directement
  const userId = window.location.pathname.split('/').pop();
  
  console.log('DetailsUsers - userId extrait:', userId, 'Type:', typeof userId);
  console.log('URL complète:', window.location.pathname);

  // Charger l'utilisateur depuis le service
  useEffect(() => {
    const loadUser = () => {
      // Vérifier que le service est prêt
      if (!userDataService.getAllUsers || userDataService.getAllUsers().length === 0) {
        console.log('Service pas encore prêt, attente...');
        setTimeout(loadUser, 100);
        return;
      }

      const userData = userDataService.getUserById(userId);
      console.log('Tentative de chargement de l\'utilisateur:', userId, 'Données trouvées:', userData);
      
      if (userData) {
        // Données simulées pour les réservations (si locataire)
        const mockReservations = [
          {
            id: 1,
            boatName: 'Bateau de Plaisance',
            port: 'Port de Nice',
            startDate: '2024-02-15',
            endDate: '2024-02-20',
            status: 'Terminée',
            totalPrice: 300,
            rating: 5
          },
          {
            id: 2,
            boatName: 'Voilier Classique',
            port: 'Port de Marseille',
            startDate: '2024-01-10',
            endDate: '2024-01-15',
            status: 'Terminée',
            totalPrice: 450,
            rating: 4
          },
          {
            id: 3,
            boatName: 'Catamaran Luxe',
            port: 'Port de Cannes',
            startDate: '2024-03-01',
            endDate: '2024-03-05',
            status: 'En cours',
            totalPrice: 600,
            rating: null
          }
        ];

        // Données simulées pour les bateaux (si propriétaire)
        const mockBoats = [
          {
            id: 1,
            name: 'Bateau de Plaisance',
            type: 'Moteur',
            length: '12m',
            capacity: 8,
            port: 'Port de Nice',
            status: 'Disponible',
            totalEarnings: 1500,
            totalReservations: 12,
            rating: 4.8
          },
          {
            id: 2,
            name: 'Voilier Classique',
            type: 'Voilier',
            length: '15m',
            capacity: 6,
            port: 'Port de Marseille',
            status: 'En maintenance',
            totalEarnings: 800,
            totalReservations: 8,
            rating: 4.6
          }
        ];

        setUser({
          ...userData,
          reservations: mockReservations,
          boats: mockBoats,
          // Déduire isOwner et isRenter des rôles
          isOwner: userData.roles.includes('Propriétaire'),
          isRenter: userData.roles.includes('Locataire')
        });
      } else {
        console.log('Aucun utilisateur trouvé pour l\'ID:', userId);
        console.log('Utilisateurs disponibles:', userDataService.getAllUsers());
      }
    };

    // Charger l'utilisateur au montage
    loadUser();

    // Écouter les changements
    const unsubscribe = userDataService.addListener(() => {
      loadUser();
    });

    return unsubscribe;
  }, [userId]);

  // Fonction pour activer/désactiver l'utilisateur
  const handleToggleStatus = async () => {
    try {
      const action = user.active ? 'deactivate' : 'activate';
      const confirmed = await ActivationConfirmation(action, 1, 'utilisateur');
      
      if (confirmed) {
        userDataService.updateUserStatus(user.id, !user.active);
        SuccessAlert(
          `Utilisateur ${user.active ? 'désactivé' : 'activé'} !`,
          `Le compte a été ${user.active ? 'désactivé' : 'activé'} avec succès.`
        );
      }
    } catch (error) {
      ErrorAlert('Erreur !', 'Impossible de modifier le statut de l\'utilisateur.');
    }
  };

  // Composant pour le badge de rôle
  const RoleBadge = ({ roles }) => {
    const roleConfig = {
      Locataire: { color: 'bg-[#4B6A88] text-white', icon: faUser },
      Propriétaire: { color: 'bg-[#4B6A88] text-white', icon: faShip },
      Administrateur: { color: 'bg-[#AD7C59] text-white', icon: faCog }
    };
    
    if (!Array.isArray(roles)) {
      roles = [roles]; // Fallback pour la compatibilité
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => {
          const config = roleConfig[role] || roleConfig.Locataire;
          return (
            <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              <FontAwesomeIcon icon={config.icon} className="w-3 h-3 mr-1" />
              {role}
            </span>
          );
        })}
      </div>
    );
  };

  // Composant pour le badge de statut
  const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      active 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <FontAwesomeIcon 
        icon={active ? faCheckCircle : faTimesCircle} 
        className="w-4 h-4 mr-2" 
      />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );

  

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f0e9] p-6">
        {/* Bouton retour */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/sl/users')}
            className="flex items-center space-x-2 text-[#4B6A88] hover:text-[#3A5A7A] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            <span>Retour à la liste des utilisateurs</span>
          </button>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FontAwesomeIcon icon={faUser} className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Utilisateur non trouvé</h2>
            <p className="text-gray-500 mb-4">L'utilisateur avec l'ID {userId} n'existe pas ou n'a pas pu être chargé.</p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>ID recherché: {userId}</p>
              <p>Utilisateurs disponibles: {userDataService.getAllUsers().length}</p>
            </div>
            <button
              onClick={() => navigate('/admin/sl/users')}
              className="mt-4 bg-[#AD7C59] hover:bg-[#8B6B4A] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Détails de l'utilisateur
            </h1>
            <p className="text-gray-500">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <StatusBadge active={user.active} />
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              user.active
                ? 'bg-[#4B6A88] text-white hover:bg-[#3A5A77]'
                : 'bg-[#C1D0C4] text-[#4B6A88] hover:bg-[#B0C0B3]'
            }`}
          >
            {user.active ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-[#AD7C59] text-[#AD7C59]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profil
          </button>
          {user.roles?.includes('Locataire') && (
            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-[#AD7C59] text-[#AD7C59]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Réservations ({user.reservations.length})
            </button>
          )}
          {user.roles?.includes('Propriétaire') && (
            <button
              onClick={() => setActiveTab('boats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'boats'
                  ? 'border-[#AD7C59] text-[#AD7C59]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bateaux ({user.boats.length})
            </button>
          )}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Nom complet :</span>
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Téléphone :</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Adresse :</span>
                    <span className="font-medium">{user.address}</span>
                  </div>
                </div>
              </div>

              {/* Informations du compte */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Rôle :</span>
                    <RoleBadge roles={user.roles} />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Statut :</span>
                    <StatusBadge active={user.active} />
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Membre depuis :</span>
                    <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Dernière connexion :</span>
                    <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {user.roles?.includes('Locataire') && (
              <div className="bg-[#87CEEB]/10 p-4 rounded-lg border border-[#87CEEB]/20">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarCheck} className="w-8 h-8 text-[#87CEEB]" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#4B6A88]">Total réservations</p>
                      <p className="text-2xl font-bold text-[#4B6A88]">{user.reservations.length}</p>
                    </div>
                  </div>
                </div>
              )}
              
                          {user.roles?.includes('Propriétaire') && (
              <div className="bg-[#C1D0C4]/10 p-4 rounded-lg border border-[#C1D0C4]/20">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faShip} className="w-8 h-8 text-[#C1D0C4]" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#4B6A88]">Total bateaux</p>
                      <p className="text-2xl font-bold text-[#4B6A88]">{user.boats.length}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#AD7C59]/10 p-4 rounded-lg border border-[#AD7C59]/20">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faEuroSign} className="w-8 h-8 text-[#AD7C59]" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#4B6A88]">Total dépensé</p>
                    <p className="text-2xl font-bold text-[#4B6A88]">{user.totalSpent} €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Réservations (si locataire) */}
        {activeTab === 'reservations' && user.roles?.includes('Locataire') && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Historique des réservations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bateau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Port
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.boatName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reservation.port}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === 'Terminée' 
                            ? 'bg-[#C1D0C4] text-[#4B6A88]' 
                            : reservation.status === 'En cours'
                            ? 'bg-[#87CEEB] text-[#4B6A88]'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.totalPrice} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reservation.rating ? (
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{reservation.rating}/5</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Pas encore noté</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Bateaux (si propriétaire) */}
        {activeTab === 'boats' && user.roles?.includes('Propriétaire') && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mes bateaux</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bateau
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Port
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réservations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.boats.map((boat) => (
                    <tr key={boat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{boat.name}</div>
                        <div className="text-sm text-gray-500">{boat.length} • {boat.capacity} pers.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{boat.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{boat.port}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          boat.status === 'Disponible' 
                            ? 'bg-[#C1D0C4] text-[#4B6A88]' 
                            : 'bg-[#AD7C59] text-white'
                        }`}>
                          {boat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{boat.totalReservations}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{boat.totalEarnings} €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{boat.rating}/5</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsUsers;