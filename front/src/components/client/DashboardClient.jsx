
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShip,
  faCalendarCheck,
  faHourglassHalf,
  faCheckCircle,
  faTimesCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Simule le rôle pour l'instant
const userRole = "proprietaire"; // ou "locataire"

const demandes = [
  {
    id: 1,
    boat: "Sea Ray 240",
    locataire: "Jean Dupont",
    dates: "5 → 12 août 2025",
    price: "1 400 €",
    status: "pending", // pending | accepted | refused
  },
    {
    id: 2,
    boat: "Bénéteau Oceanis 45",
    locataire: "Marie Curie",
    dates: "10 → 15 août 2025",
    price: "2 000 €",
    status: "pending", // pending | accepted | refused
    },
    {
    id: 3,
    boat: "Jeanneau Sun Odyssey 349",
    locataire: "Pierre Martin",
    dates: "20 → 25 août 2025",
    price: "1 800 €",
    status: "accepted", // pending | accepted | refused 
    },
        
];

export default function DashboardClient() {
  const [demandesState, setDemandesState] = useState(demandes);

  

  if (userRole === "proprieaire") {
    return (
      <div className="space-y-6">
        {/* Stats proprio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card icon={faShip} value={3} label="Bateaux actifs" />
          <Card icon={faCalendarCheck} value={5} label="Réservations confirmées" />
          <Card icon={faHourglassHalf} value={demandesState.filter(d => d.status === "pending").length} label="Demandes en attente" />
          <Card icon={faEnvelope} value={2} label="Messages non lus" color="text-purple-500" />
        </div>

        {/* Demandes en attente */}
        {demandesState.filter(d => d.status === "pending").length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Demandes en attente</h2>
            <ul className="space-y-4">
              {demandesState
                .filter((d) => d.status === "pending")
                .map((d) => (
                  <li key={d.id} className="border rounded-lg p-4 space-y-2">
                    <p><strong>Bateau :</strong> {d.boat}</p>
                    <p><strong>Locataire :</strong> {d.locataire}</p>
                    <p><strong>Dates :</strong> {d.dates}</p>
                    <p><strong>Prix :</strong> {d.price}</p>
                    <div className="flex gap-2">
                      <button
                        className="bg-mocha text-sand px-3 py-1 rounded"
                      >
                        Voir détails
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Vue locataire
  return (
    <div className="space-y-6">
      {/* Stats locataire */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={faCalendarCheck} value={2} label="Réservations confirmées" />
        <Card icon={faHourglassHalf} value={1} label="Demandes envoyées" />
        <Card icon={faCheckCircle} value={0} label="Demandes acceptées" />
        <Card icon={faTimesCircle} value={0} label="Demandes refusées" />
      </div>

      {/* Demandes envoyées */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Mes demandes envoyées</h2>
        <ul className="space-y-4">
          {demandesState.map((d) => (
            <li key={d.id} className="border rounded-lg p-4">
              <p><strong>Bateau :</strong> {d.boat}</p>
              <p><strong>Dates :</strong> {d.dates}</p>
              <p>
                <strong>Statut :</strong>{" "}
                {d.status === "pending" && <span className="text-yellow-600">En attente</span>}
                {d.status === "accepted" && <span className="text-green-600">Acceptée</span>}
                {d.status === "refused" && <span className="text-red-600">Refusée</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
}

// Composant réutilisable Card
function Card({ icon, value, label }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3">
      <FontAwesomeIcon icon={icon} className="text-2xl text-slate-blue" />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}