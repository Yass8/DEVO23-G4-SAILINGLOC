import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faHourglassHalf,
  faCheckCircle,
  faTimesCircle,
  faUser,
  faShip
} from "@fortawesome/free-solid-svg-icons";
import { fetchUserReservations } from "../../../services/userServices";
import { getCurrentUser } from "../../../services/authService";
import Card from "./Card";
import Preloader from "../../common/Preloader";

export default function TenantDashboard() {
  const [stats, setStats] = useState({
    confirmedReservations: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    refusedRequests: 0,
  });
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      const user = getCurrentUser();
      const reservations = await fetchUserReservations(user.id);

      const confirmedReservations = reservations.filter(
        (r) => r.status === "confirmed" || r.status === "accepted"
      ).length;

      const pendingRequests = reservations.filter(
        (r) => r.status === "pending" || r.status === "waiting"
      ).length;

      const acceptedRequests = reservations.filter(
        (r) => r.status === "accepted"
      ).length;

      const refusedRequests = reservations.filter(
        (r) => r.status === "refused" || r.status === "cancelled"
      ).length;

      const formattedReservations = reservations.map((reservation) => ({
        reference: reservation.reference,
        boat: reservation.Boat?.name || `Bateau #${reservation.boat_id}`,
        dates: `${new Date(reservation.start_date).toLocaleDateString()} → ${new Date(
          reservation.end_date
        ).toLocaleDateString()}`,
        price: `${reservation.total_price} €`,
        status: reservation.status,
        boatId: reservation.boat_id,
      }));

      setUserReservations(formattedReservations);
      setStats({
        confirmedReservations,
        pendingRequests,
        acceptedRequests,
        refusedRequests,
      });
    } catch (error) {
      console.error("Erreur chargement données tenant:", error);
      setError("Impossible de charger les données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon icon={faUser} className="text-2xl text-mocha" />
        <h1 className="text-2xl font-bold">Tableau de Bord Locataire</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={faCalendarCheck} value={stats.confirmedReservations} label="Réservations confirmées" />
        <Card icon={faHourglassHalf} value={stats.pendingRequests} label="Demandes en attente" />
        <Card icon={faCheckCircle} value={stats.acceptedRequests} label="Demandes acceptées" />
        <Card icon={faTimesCircle} value={stats.refusedRequests} label="Demandes refusées" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/my-reservations" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
            Mes réservations
          </Link>
          <Link to="/my-reviews" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
            Mes avis
          </Link>
        </div>
      </div>

      <ReservationsSection reservations={userReservations} />
    </div>
  );
}

// Sous-composant pour les réservations
function ReservationsSection({ reservations }) {
  const filteredReservations = reservations.filter((r) =>
    ["pending", "confirmed"].includes(r.status)
  );

  if (filteredReservations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <FontAwesomeIcon icon={faShip} className="text-4xl text-mocha mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation en cours</h2>
        <p className="text-gray-600 pb-10">Vous n'avez pas de réservation en attente ou confirmée.</p>
        <Link
          to="/boats"
          className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition mt-3"
        >
          Découvrir les bateaux
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Réservations en cours</h2>
      <div className="space-y-4">
        {filteredReservations.slice(0, 5).map((reservation) => (
          <div key={reservation.reference} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{reservation.boat}</h3>
                <p className="text-gray-600 text-sm">{reservation.dates}</p>
                <p className="text-gray-700 font-medium">{reservation.price}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={reservation.status} />
                <Link
                  to={
                    reservation.status === "confirmed"
                      ? `/my-space/reservations/${reservation.reference}/details`
                      : `/my-space/reservations/${reservation.reference}/details`
                  }
                  className="text-sand bg-mocha hover:bg-mocha/90 text-sm block mt-5 rounded-sm p-2"
                >
                  {reservation.status === "confirmed" ? "Accéder au paiement" : "Voir détails"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredReservations.length > 5 && (
        <div className="mt-4 text-center">
          <Link to="/my-reservations" className="text-mocha hover:text-mocha-dark underline">
            Voir toutes mes réservations ({filteredReservations.length})
          </Link>
        </div>
      )}
    </div>
  );
}

// Sous-composant pour le badge de statut
function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "En attente" },
    confirmed: { color: "bg-sage-green", label: "Confirmé" },
    refused: { color: "bg-red-100 text-red-800", label: "Refusé" },
    cancelled: { color: "bg-red-100 text-red-800", label: "Annulé" },
    completed: { color: "bg-slate-blue text-sand", label: "Terminé" },
  };

  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}