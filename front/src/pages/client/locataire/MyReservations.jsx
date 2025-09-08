import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { fetchUserReservations } from "../../../services/userServices";
import { getCurrentUser } from "../../../services/authService";
import {
  SuccessAlert,
  GeneralConfirmation,
} from "../../../components/common/SweetAlertComponents";
import { updateReservation } from "../../../services/reservationServices";
import Preloader from "../../../components/common/Preloader";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const user = getCurrentUser();
      const data = await fetchUserReservations(user.id);
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const isConfirmed = await GeneralConfirmation({
      title: "Annuler la réservation",
      text: "Voulez-vous vraiment annuler cette réservation ?",
      confirmButtonText: "Oui, annuler",
    });

    if (isConfirmed) {
      try {
        await updateReservation(id, { status: "cancelled" });
        await SuccessAlert("Annulée", "Votre réservation a été annulée.");
        loadReservations();
      } catch (err) {
        alert("Erreur lors de l'annulation.");
        console.error(err);
      }
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "cancelled":
        return "Annulée";
      case "completed":
        return "Terminée";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-mocha bg-yellow-100";
      case "confirmed":
        return "text-green-600 bg-sage-green";
      case "cancelled":
        return "text-sand bg-red-400";
      case "completed":
        return "text-sand bg-pale-blue";
      default:
        return "text-sand bg-slate-blue";
    }
  };

  if (loading) return <Preloader />;
  if (reservations.length === 0)
    return (
      <div className="text-center mt-10">
        <p>Aucune réservation trouvée.</p>
        <Link to="/boats" className="text-mocha underline">
          Découvrir nos bateaux
        </Link>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((res) => {
          const mainPhoto =
            res.Boat?.BoatPhotos?.find((p) => p.is_main)?.photo_url ||
            "/images/default-boat.jpg";
          return (
            <div
              key={res.id}
              className="bg-white rounded shadow-md overflow-hidden"
            >
              <img
                src={mainPhoto}
                alt={res.Boat?.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{res.Boat?.name}</h2>
                <p className="text-sm text-gray-600">{res.Boat?.Port?.name}</p>

                <div className="mt-2 text-sm text-gray-700">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Du{" "}
                  <strong>
                    {new Date(res.start_date).toLocaleDateString()}
                  </strong>{" "}
                  au{" "}
                  <strong>{new Date(res.end_date).toLocaleDateString()}</strong>
                </div>

                <div className="mt-2 text-lg font-bold text-mocha">
                  {res.total_price} €
                </div>

                <div className="mt-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      res.status
                    )}`}
                  >
                    {getStatusLabel(res.status)}
                    {res.status === "confirmed" && " - en attente de paiement"}
                  </span>
                </div>

                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/my-space/reservations/${res.reference}/details`}
                    className="text-sm text-slate-blue hover:underline"
                  >
                    Voir les détails
                  </Link>

                  {(res.status === "pending" || res.status === "confirmed") && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="text-sm text-red-400 hover:underline flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
