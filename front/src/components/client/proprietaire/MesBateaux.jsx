
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";

// Simule la réponse API
const boats = [
  {
    id: 1,
    name: "Sea Ray 240",
    type: "Speedboat",
    daily_price: 180,
    status: "available",
    photo_url: "/images/bavaria46cruiser.jpg",
    port: "Port de Nice",
  },
  {
    id: 2,
    name: "Lagoon 42",
    type: "Catamaran",
    daily_price: 350,
    status: "reserved",
    photo_url: "/images/catamaran.jpg",
    port: "Port de Cannes",
  },
];

export default function MesBateaux() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes bateaux</h1>
        <Link
          to="/my-space/boats/new"
          className="bg-mocha text-sand px-3 py-2 rounded flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Ajouter un bateau
        </Link>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {boats.map((boat) => (
          <div key={boat.id} className="bg-white rounded shadow overflow-hidden">
            <img
              src={boat.photo_url}
              alt={boat.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-2">
              <h2 className="font-bold">{boat.name}</h2>
              <p className="text-sm text-gray-600">{boat.type} • {boat.port}</p>
              <p className="text-lg font-semibold text-mocha mt-2">{boat.daily_price} €/jour</p>
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                  boat.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {boat.status === "available" ? "Disponible" : "En réservation"}
              </span>
              <div className="flex mt-2">
                <Link
                  to={`/my-space/boats/${boat.id}`}
                  className="flex-1 bg-mocha text-sand rounded hover:bg-mocha/90 text-center py-2 flex items-center justify-center gap-1"
                >
                  <FontAwesomeIcon icon={faEye} /> Voir
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {boats.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Aucun bateau pour le moment.</p>
          <Link
            to="/my-space/boats/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ajouter votre premier bateau
          </Link>
        </div>
      )}
    </div>
  );
}

// Composant helper pour stats (facultatif)
function Card({ icon, value, label, color }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3">
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}