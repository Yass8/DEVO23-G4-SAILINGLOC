import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faEuroSign,
  faFileContract,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faQuestionCircle,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

// 📦 Données mockées
const mockReservations = [
  {
    id: 1,
    start_date: "2025-08-10",
    end_date: "2025-08-17",
    total_price: 1200,
    status: "confirmed",
    payment_method: "CB",
    message: "Merci de nous accueillir avec le champagne au frais 😄",
    contract_url: null,
    boat: {
      name: "Océan Bleu",
      port: { name: "Port de La Rochelle", city: "La Rochelle", country: "France" },
      daily_price: 180,
      max_passengers: 8,
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5", is_main: true },
      ],
    },
    owner: {
      firstname: "Jean",
      lastname: "Martin",
      email: "jean.martin@example.com",
      phone: "+33 6 12 34 56 78",
    },
  },
  {
    id: 2,
    start_date: "2025-09-01",
    end_date: "2025-09-05",
    total_price: 850,
    status: "pending",
    payment_method: "PayPal",
    message: null,
    contract_url: null,
    boat: {
      name: "Vent Marin",
      port: { name: "Port de Marseille", city: "Marseille", country: "France" },
      daily_price: 170,
      max_passengers: 6,
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", is_main: true },
      ],
    },
    owner: {
      firstname: "Sophie",
      lastname: "Bernard",
      email: "sophie.bernard@example.com",
      phone: "+33 6 98 76 54 32",
    },
  },
];

export default function ReservationDetail() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const found = mockReservations.find((r) => r.id === parseInt(id));
      setReservation(found || null);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!reservation) return <p className="text-center mt-10">Réservation introuvable.</p>;

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return faCheckCircle;
      case "pending": return faQuestionCircle;
      case "cancelled": return faTimesCircle;
      case "completed": return faCheckCircle;
      default: return faQuestionCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "cancelled": return "text-red-600";
      case "completed": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed": return "Confirmée";
      case "pending": return "En attente";
      case "cancelled": return "Annulée";
      case "completed": return "Terminée";
      default: return status;
    }
  };

  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Détails de la réservation</h1>

      {/* Infos générales */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{reservation.boat.name}</h2>
          <span className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(reservation.status)}`}>
            <FontAwesomeIcon icon={getStatusIcon(reservation.status)} />
            {getStatusLabel(reservation.status)}
          </span>
        </div>

        <img
          src={reservation.boat.photos[0]?.photo_url}
          alt={reservation.boat.name}
          className="w-full h-64 object-cover rounded mb-4"
        />

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Dates :</strong></p>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Du {new Date(reservation.start_date).toLocaleDateString()} au {new Date(reservation.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p><strong>Prix total :</strong></p>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEuroSign} />
              {reservation.total_price} €
            </p>
          </div>
          <div>
            <p><strong>Port :</strong></p>
            <p className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {reservation.boat.port.name}, {reservation.boat.port.city}
            </p>
          </div>
          <div>
            <p><strong>Paiement :</strong></p>
            <p>{reservation.payment_method}</p>
          </div>
        </div>
      </div>

      {/* Propriétaire */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 flex gap-40">
        <div>
            <h3 className="text-lg font-semibold mb-2">Propriétaire</h3>
            <p><strong>{reservation.owner.firstname} {reservation.owner.lastname}</strong></p>
            <p>{reservation.owner.email}</p>
            <p>{reservation.owner.phone}</p>
        </div>
        <div className="">
            <h3 className="text-lg font-semibold mb-2">Contacter le propriétaire</h3>
            <Link
                to={`/my-space/reservations/${reservation.id}/chat`}
                className="inline-flex items-center gap-2 bg-slate-blue text-sand px-4 py-2 rounded hover:bg-slate-blue/90 transition"
            >
                <FontAwesomeIcon icon={faComments} />
                Envoyer un message à {reservation.owner.firstname}
            </Link>
        </div>
      </div>

      {/* Contrat */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        {reservation.contract_url ? (
          <a
            href={reservation.contract_url}
            download
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <FontAwesomeIcon icon={faFileContract} />
            Télécharger le contrat
          </a>
        ) : (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FontAwesomeIcon icon={faDownload} />
            Le contrat sera disponible ici une fois signé.
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link to="/my-space/reservations" className="text-slate-blue hover:underline">
          ← Retour à mes réservations
        </Link>
      </div>
    </div>
  );
}