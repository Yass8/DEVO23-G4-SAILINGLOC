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
import { 
  fetchUserById, 
  updateUser,
  fetchUserBoats,
  fetchUserReservations,
  fetchUserDocuments
} from '../../services/userServices';
import Preloader from '../../components/common/Preloader';

const DetailsUsers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Fonction pour transformer les données de l'API
  const transformUserData = (apiUser) => {
    return {
      id: apiUser.id.toString(),
      firstName: apiUser.firstname,
      lastName: apiUser.lastname,
      email: apiUser.email,
      phone: apiUser.phone || '',
      avatar: apiUser.photo || `https://ui-avatars.com/api/?name=${apiUser.firstname}+${apiUser.lastname}&background=4B6A88&color=fff`,
      roles: apiUser.roles || [],
      active: apiUser.is_active,
      createdAt: apiUser.created_at,
      lastLogin: apiUser.updated_at,
      address: apiUser.address || '',
      boats: [],
      reservations: [],
      documents: [],
      totalSpent: 0,
      totalEarned: 0
    };
  };

  // Charger l'utilisateur depuis l'API
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        console.log('�� Chargement des détails pour l\'utilisateur:', id);
        
        // Charger les détails complets de l'utilisateur
        const [userDetails, boats, reservations, documents] = await Promise.all([
          fetchUserById(id),
          fetchUserBoats(id).catch(err => {
            console.warn('⚠️ Erreur boats:', err);
            return [];
          }),
          fetchUserReservations(id).catch(err => {
            console.warn('⚠️ Erreur reservations:', err);
            return [];
          }),
          fetchUserDocuments(id).catch(err => {
            console.warn('⚠️ Erreur documents:', err);
            return [];
          })
        ]);

        // Transformer les données
        const transformedUser = transformUserData(userDetails);
        const userWithDetails = {
          ...transformedUser,
          boats: boats || [],
          reservations: reservations || [],
          documents: documents || [],
          // Calculer les totaux
          totalSpent: reservations?.reduce((sum, res) => sum + (res.total_price || 0), 0) || 0,
          totalEarned: boats?.reduce((sum, boat) => sum + (boat.total_earnings || 0), 0) || 0,
          // Déduire isOwner et isRenter des rôles
          isOwner: transformedUser.roles.includes('Propriétaire'),
          isRenter: transformedUser.roles.includes('Locataire')
        };

        console.log('✅ Détails chargés:', userWithDetails);
        setUser(userWithDetails);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des détails:', error);
        ErrorAlert('Erreur !', `Impossible de charger les détails: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  // Fonction pour activer/désactiver l'utilisateur
  const handleToggleStatus = async () => {
    try {
      const action = user.active ? 'deactivate' : 'activate';
      const confirmed = await ActivationConfirmation(action, 1, 'utilisateur');
      
      if (confirmed) {
        const userData = { is_active: !user.active };
        await updateUser(user.id, userData);
        
        // Mettre à jour l'état local
        setUser(prev => ({ ...prev, active: !prev.active }));
        
        SuccessAlert(
          `Utilisateur ${user.active ? 'désactivé' : 'activé'} !`,
          `Le compte a été ${user.active ? 'désactivé' : 'activé'} avec succès.`
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error);
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
      roles = [roles];
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

  // Afficher le preloader pendant le chargement
  if (loading) {
    return <Preloader />;
  }

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
            <p className="text-gray-500 mb-4">L'utilisateur avec l'ID {id} n'existe pas ou n'a pas pu être chargé.</p>
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
                    <span className="font-medium">{user.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Adresse :</span>
                    <span className="font-medium">{user.address || 'Non renseignée'}</span>
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
                  {user.reservations.length > 0 ? (
                    user.reservations.map((reservation, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reservation.boat_name || 'Bateau'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.port_name || 'Port'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(reservation.start_date).toLocaleDateString('fr-FR')} - {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reservation.status === 'completed' 
                              ? 'bg-[#C1D0C4] text-[#4B6A88]' 
                              : reservation.status === 'active'
                              ? 'bg-[#87CEEB] text-[#4B6A88]'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status === 'completed' ? 'Terminée' : 
                             reservation.status === 'active' ? 'En cours' : reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{reservation.total_price || 0} €</div>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        Aucune réservation trouvée
                      </td>
                    </tr>
                  )}
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
                  {user.boats.length > 0 ? (
                    user.boats.map((boat, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{boat.name || 'Bateau'}</div>
                          <div className="text-sm text-gray-500">{boat.length || 'N/A'} • {boat.capacity || 'N/A'} pers.</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{boat.type || 'Type inconnu'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{boat.port_name || 'Port inconnu'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            boat.is_available 
                              ? 'bg-[#C1D0C4] text-[#4B6A88]' 
                              : 'bg-[#AD7C59] text-white'
                          }`}>
                            {boat.is_available ? 'Disponible' : 'Indisponible'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{boat.total_reservations || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{boat.total_earnings || 0} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{boat.rating || 'N/A'}/5</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Aucun bateau trouvé
                      </td>
                    </tr>
                  )}
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