import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShip,
  faUser,
  faFileInvoice,
  faLock,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { fetchReservationByReference } from "../../../services/reservationServices";
import Payment from "../Payment";
import { getMainPhotoUrl } from "../../../utils/mainPhoto";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV);

export default function TenantReservationDetail() {
  const { reference } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservationByReference(reference)
      .then((data) => {
        setReservation(data);
      })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) return <p className="text-center mt-10">Chargement…</p>;
  if (!reservation)
    return <p className="text-center mt-10">Réservation gta.</p>;

  const owner = reservation.Boat?.User;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Détail de ma réservation ·{" "}
        <span className="text-mocha">{reservation.reference}</span>
      </h1>

      {/* Bateau */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faShip} className="text-slate-blue" />
          Bateau
        </h2>
        <div className="flex flex-col md:flex-row gap-6">

          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${getMainPhotoUrl(reservation.Boat)}`}

            alt={reservation.Boat?.name}
            className="w-full md:w-64 h-40 object-cover rounded"
          />
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">{reservation.Boat?.name}</h3>
            <p className="text-gray-600">
              Prix journalier :{" "}
              <span className="font-medium">
                {reservation.Boat?.daily_price} €
              </span>
            </p>
            <p className="text-gray-600">
              Longueur :{" "}
              <span className="font-medium">{reservation.Boat?.length} m</span>
            </p>
            <p className="text-gray-600">
              Modèle :{" "}
              <span className="font-medium">{reservation.Boat?.model}</span>
            </p>
            <p className="text-gray-600">
              Marque :{" "}
              <span className="font-medium">{reservation.Boat?.brand}</span>
            </p>
            <p className="text-gray-600">
              Capacité :{" "}
              <span className="font-medium">
                {reservation.Boat?.max_pessengers} personnes
              </span>
            </p>
            <p className="text-gray-600">
              skipper :{" "}
              <span className="font-medium">
                {reservation.Boat?.skipper_required ? "Oui" : "Non"}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Propriétaire */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-slate-blue" />
          Propriétaire
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              Nom :{" "}
              <span className="font-medium">
                {owner?.firstname} {owner?.lastname}
              </span>
            </p>
            <p className="text-gray-600">
              Téléphone :{" "}
              <span className="font-medium">
                {owner?.phone || "Non renseigné"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              Email : <span className="font-medium">{owner?.email}</span>
            </p>
          </div>
          <div className="">
            <h3 className="text-lg font-semibold mb-2">
              Contacter le propriétaire
            </h3>
            <Link
              to={`/my-space/reservations/${reservation.reference}/chat`}
              className="inline-flex items-center gap-2 bg-slate-blue text-sand px-4 py-2 rounded hover:bg-slate-blue/90 transition"
            >
              <FontAwesomeIcon icon={faComments} />
              Envoyer un message à {owner?.firstname}
            </Link>
          </div>
        </div>
      </section>

      {/* Réservation */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileInvoice} className="text-slate-blue" />
          Réservation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Référence</p>
            <p className="font-medium">{reservation.reference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="font-medium">
              {new Date(reservation.start_date).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de fin</p>
            <p className="font-medium">
              {new Date(reservation.end_date).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </section>

      {reservation.status === "confirmed" && (
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="text-slate-blue" />
            Paiement
          </h2>
          <Elements stripe={stripePromise}>
            <Payment reservation={reservation} />
          </Elements>
        </section>
      )}
    </div>
  );
}
