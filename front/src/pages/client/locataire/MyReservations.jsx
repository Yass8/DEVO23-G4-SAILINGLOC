// src/pages/client/reservations/MyReservations.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// 📦 Données mockées
const mockReservations = [
  {
    id: 1,
    start_date: "2025-08-10",
    end_date: "2025-08-17",
    total_price: 1200,
    status: "confirmed",
    boat: {
      name: "Océan Bleu",
      port: { name: "Port de La Rochelle" },
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5", is_main: true },
      ],
    },
  },
  {
    id: 2,
    start_date: "2025-09-01",
    end_date: "2025-09-05",
    total_price: 850,
    status: "pending",
    boat: {
      name: "Vent Marin",
      port: { name: "Port de Marseille" },
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", is_main: true },
      ],
    },
  },
  {
    id: 3,
    start_date: "2025-07-20",
    end_date: "2025-07-25",
    total_price: 950,
    status: "completed",
    boat: {
      name: "Étoile du Nord",
      port: { name: "Port de Nice" },
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9", is_main: true },
      ],
    },
  },
  {
    id: 4,
    start_date: "2025-08-02",
    end_date: "2025-08-05",
    total_price: 600,
    status: "cancelled",
    boat: {
      name: "Liberté",
      port: { name: "Port de Brest" },
      photos: [
        { photo_url: "https://images.unsplash.com/photo-1527431293370-0cd188ca5d15", is_main: true },
      ],
    },
  },
];

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simule un délai de chargement
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 800);
  }, []);

  const handleCancel = (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
    );
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "En attente";
      case "confirmed": return "Confirmée";
      case "cancelled": return "Annulée";
      case "completed": return "Terminée";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "confirmed": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      case "completed": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (reservations.length === 0)
    return <p className="text-center mt-10">Aucune réservation trouvée.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded shadow-md overflow-hidden">
            <img
              src={res.boat.photos[0]?.photo_url || "/images/default-boat.jpg"}
              alt={res.boat.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{res.boat.name}</h2>
              <p className="text-sm text-gray-600">{res.boat.port.name}</p>

              <div className="mt-2 text-sm text-gray-700">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Du <strong>{new Date(res.start_date).toLocaleDateString()}</strong> au{" "}
                <strong>{new Date(res.end_date).toLocaleDateString()}</strong>
              </div>

              <div className="mt-2 text-lg font-bold text-mocha">{res.total_price} €</div>

              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(res.status)}`}>
                  {getStatusLabel(res.status)}
                </span>
              </div>

              <div className="mt-4 flex justify-between">
                <Link
                  to={`/my-space/reservations/${res.id}`}
                  className="text-sm text-slate-blue hover:underline"
                >
                  Voir les détails
                </Link>

                {(res.status === "pending" || res.status === "confirmed") && (
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="text-sm text-red-600 hover:underline flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}