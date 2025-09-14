import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShip,
  faCalendarCheck,
  faHourglassHalf,
  faEnvelope,
  faUserTie,
  faCamera,
  faChartLine,
  faMagic
} from "@fortawesome/free-solid-svg-icons";
import { fetchUserBoats } from "../../../services/userServices";
import { fetchBoatReservations } from "../../../services/reservationServices";
import { getCurrentUser } from "../../../services/authService";
import Card from "../Card";
import Preloader from "../../common/Preloader";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    boats: 0,
    confirmedReservations: 0,
    pendingRequests: 0,
    unreadMessages: 0
  });
  const [pendingDemands, setPendingDemands] = useState([]);
  const [userBoats, setUserBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    try {
      const user = getCurrentUser();

      // Récupérer tous les bateaux du propriétaire
      const boats = await fetchUserBoats(user.id);
      setUserBoats(boats);

      // Récupérer toutes les réservations de tous ses bateaux
      const allReservations = [];

      for (const boat of boats) {
        const reservations = await fetchBoatReservations(boat.id);
        allReservations.push(...reservations);
      }

      // Filtrer les réservations en attente
      const pendingReservations = allReservations.filter(r =>
        r.status === 'pending' || r.status === 'waiting'
      );

      // 4. Filtrer les réservations confirmées
      const confirmedReservations = allReservations.filter(r =>
        r.status === 'confirmed' || r.status === 'accepted'
      );

      // 5. Formater les demandes en attente pour l’affichage
      const pendingDetails = pendingReservations.slice(0, 5).map(res => ({
        reference: res.reference,
        boat: res.Boat?.name || `Bateau #${res.boat_id}`,
        locataire: res.User?.firstname  + " " + res.User?.lastname || `Utilisateur #${res.user_id}`,
        dates: `${new Date(res.start_date).toLocaleDateString()} → ${new Date(res.end_date).toLocaleDateString()}`,
        price: `${res.total_price} €`,
        status: res.status
      }));

      setPendingDemands(pendingDetails);

      // 6. Mettre à jour les stats
      setStats({
        boats: boats.length,
        confirmedReservations: confirmedReservations.length,
        pendingRequests: pendingReservations.length,
        unreadMessages: 0
      });

    } catch (error) {
      console.error('Erreur chargement données owner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Preloader />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faUserTie} className="text-2xl text-mocha" />
        <h1 className="text-2xl font-bold">Tableau de Bord Propriétaire</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={faShip} value={stats.boats} label="Bateaux actifs" />
        <Card icon={faCalendarCheck} value={stats.confirmedReservations} label="Réservations confirmées" />
        <Card icon={faHourglassHalf} value={stats.pendingRequests} label="Demandes en attente" />
        <Card icon={faEnvelope} value={stats.unreadMessages} label="Messages non lus" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/my-space/boats/new" className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition">
            Ajouter un bateau
          </Link>
          <Link to="/my-space/boats" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
            Gérer mes bateaux
          </Link>
          {stats.pendingRequests > 0 && (
            <Link to="/my-space/reservations" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition">
              Voir les demandes ({stats.pendingRequests})
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {pendingDemands.length > 0 ? (
          <PendingDemandsSection demands={pendingDemands} totalPending={stats.pendingRequests} />
        ) : (
          <NoPendingDemandsSection stats={stats} userBoats={userBoats} />
        )}

        {userBoats.length > 0 && (
          <UserBoatsSection boats={userBoats} />
        )}
      </div>
    </div>
  );
}

// Sous-composant : demandes en attente
function PendingDemandsSection({ demands, totalPending }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Demandes récentes en attente</h2>
      <ul className="space-y-4">
        {demands.map((d) => (
          <li key={d.reference} className="border rounded-lg p-4 space-y-2">
            <p><strong>Bateau : </strong> {d.boat}</p>
            <p><strong>Locataire : </strong> {d.locataire}</p>
            <p><strong>Dates : </strong> {d.dates}</p>
            <p><strong>Prix : </strong> {d.price}</p>
            <div className="flex gap-2">
              <Link
                to={`/my-space/reservations/${d.reference}`}
                className="bg-mocha text-white px-3 py-1 rounded hover:bg-mocha-dark transition"
              >
                Voir détails
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {totalPending > 5 && (
        <div className="mt-4 text-center">
          <Link to="/reservations" className="text-mocha hover:text-mocha-dark underline">
            Voir toutes les demandes ({totalPending})
          </Link>
        </div>
      )}
    </div>
  );
}

// Sous-composant : aucune demande en attente
function NoPendingDemandsSection({ stats, userBoats }) {
  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <FontAwesomeIcon icon={faShip} className="text-4xl text-mocha mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune demande en attente</h2>
        <p className="text-gray-600 mb-4">
          Vous n'avez actuellement aucune demande de réservation en attente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FontAwesomeIcon icon={faCamera} className="text-mocha mb-2" />
            <h3 className="font-semibold text-sm mb-1">Photos qualité</h3>
            <p className="text-xs text-gray-500">Ajoutez des photos professionnelles</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-mocha mb-2" />
            <h3 className="font-semibold text-sm mb-1">Disponibilités</h3>
            <p className="text-xs text-gray-500">Maintenez votre calendrier à jour</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <FontAwesomeIcon icon={faChartLine} className="text-mocha mb-2" />
            <h3 className="font-semibold text-sm mb-1">Analyse marché</h3>
            <p className="text-xs text-gray-500">Adaptez vos tarifs saisonniers</p>
          </div>
        </div>
      </div>

      {stats.confirmedReservations > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="text-mocha" />
            Vue d'ensemble
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{stats.confirmedReservations}</div>
              <p className="text-xs text-blue-800">Réservations confirmées</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{stats.boats}</div>
              <p className="text-xs text-green-800">Bateaux actifs</p>
            </div>
          </div>
        </div>
      )}

      {userBoats.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMagic} className="text-mocha" />
            Optimisation recommandée
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userBoats.slice(0, 2).map((boat) => (
              <div key={boat.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-800">{boat.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{boat.location}</p>
                <Link
                  to={`/my-space/boats/${boat.slug}/edit`}
                  className="inline-block mt-2 text-mocha hover:text-mocha-dark text-sm font-medium"
                >
                  Optimiser cette annonce
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Sous-composant : mes bateaux
function UserBoatsSection({ boats }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Mes bateaux</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boats.slice(0, 3).map((boat) => (
          <div key={boat.id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{boat.name}</h3>
            <p className="text-gray-600 text-sm">{boat.type}</p>
            <p className="text-gray-600 text-sm">{boat.location}</p>
            <Link
              to={`/my-space/boats/${boat.slug}`}
              className="text-mocha hover:text-mocha-dark text-sm underline mt-2 block"
            >
              Voir détails
            </Link>
          </div>
        ))}
      </div>
      {boats.length > 3 && (
        <div className="mt-4 text-center">
          <Link to="/my-space/boats" className="text-mocha hover:text-mocha-dark underline">
            Voir tous mes bateaux ({boats.length})
          </Link>
        </div>
      )}
    </div>
  );
}