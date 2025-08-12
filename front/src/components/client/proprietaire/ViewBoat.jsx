import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnchor,
  faRuler,
  faUsers,
  faMoneyBill,
  faMapMarkerAlt,
  faCertificate,
  faEdit,
  faCheckCircle,
  faTimesCircle,
  faTools,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const bateau = {
  id: 1,
  name: "Sea Ray 240",
  type: "Speedboat",
  brand: "Sea Ray",
  model: "240 Sundancer",
  length: 7.4,
  max_passengers: 8,
  daily_price: 180,
  description: "Bateau idéal pour sorties familiales ou entre amis.",
  photos: [
    "/images/bavaria46cruiser.jpg",
    "/images/boat2.jpg",
    "/images/boat3.jpg",
    "/images/boat4.jpg",
  ],
  port: "Port de Nice",
  engine_type: "Essence",
  skipper_required: false,
  immatriculation: "FR-BR12345",
  equipment: ["GPS", "Sondeur", "Radio VHF", "Douche de pont"],
  documents: [
    { type: "Assurance", url: "/docs/assurance.pdf", verified: true },
    { type: "Permis", url: "/docs/permis.pdf", verified: true },
  ],
  availabilities: [
    {
      id: 1,
      start_date: "2023-06-01",
      end_date: "2023-06-10",
      status: "booked"
    },
    {
      id: 2,
      start_date: "2023-06-11",
      end_date: "2023-06-20",
      status: "available"
    },
    {
      id: 3,
      start_date: "2023-06-21",
      end_date: "2023-06-30",
      status: "maintenance"
    },
    {
      id: 4,
      start_date: "2025-07-01",
      end_date: "2025-12-10",
      status: "booked"
    }
  ]
};

export default function VoirBateau() {
  const { id } = useParams();
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = principale

    // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour obtenir l'icône et la couleur selon le statut
  const getStatusInfo = (status) => {
    switch(status) {
      case 'available':
        return { icon: faCheckCircle, color: 'text-green-500' };
      case 'booked':
        return { icon: faTimesCircle, color: 'text-red-500' };
      case 'maintenance':
        return { icon: faTools, color: 'text-yellow-500' };
      default:
        return { icon: faCheckCircle, color: 'text-gray-500' };
    }
  };

  return (
    <div className="lg:mx-4 p-4 space-y-6">
      {/* PHOTO PRINCIPALE / SÉLECTIONNÉE */}
      <img
        src={bateau.photos[selectedIndex]}
        alt={`${bateau.name} - ${selectedIndex + 1}`}
        className="w-full h-64 md:h-96 object-cover rounded shadow"
      />
      {selectedIndex === 0 && (
        <p className="text-center text-sm font-semibold text-slate-blue">Photo principale</p>
      )}

      {/* MINIATURES */}
      <div className="flex gap-2 justify-center overflow-x-auto py-2">
        {bateau.photos.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`mini ${idx + 1}`}
            className={`w-24 h-16 object-cover rounded cursor-pointer border-2 shrink-0 ${
              idx === selectedIndex
                ? "border-slate-blue scale-100"
                : "border-gray-300 hover:border-mocha"
            }`}
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>

      {/* TITRE & BOUTON MODIFIER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{bateau.name}</h1>
          <p className="text-gray-600">
            {bateau.brand} • {bateau.model}
          </p>
        </div>
        <Link
          to={`/my-space/boats/${id}/edit`}
          className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEdit} /> Modifier
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Fiche technique</h2>
          <ul className="space-y-2 text-sm">
            <li><FontAwesomeIcon icon={faRuler} /> Longueur : {bateau.length} m</li>
            <li><FontAwesomeIcon icon={faUsers} /> Passagers max : {bateau.max_passengers}</li>
            <li><FontAwesomeIcon icon={faMoneyBill} /> Prix/jour : {bateau.daily_price} €</li>
            <li><FontAwesomeIcon icon={faAnchor} /> Moteur : {bateau.engine_type}</li>
            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Port : {bateau.port}</li>
            <li>
              <FontAwesomeIcon icon={faCertificate} /> Immatriculation :{" "}
              <span className="font-mono">{bateau.immatriculation}</span>
            </li>
            <li>
              Skipper obligatoire :{" "}
              <span className={bateau.skipper_required ? "text-red-600" : "text-green-600"}>
                {bateau.skipper_required ? "Oui" : "Non"}
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Équipements</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {bateau.equipment.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-sm text-gray-700">{bateau.description}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Documents officiels</h2>
        <ul className="space-y-2">
          {bateau.documents.map((doc) => (
            <li key={doc.type} className="flex justify-between items-center text-sm">
              <span>{doc.type}</span>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className={doc.verified ? "text-green-600" : "text-red-600"}>
                {doc.verified ? "✅ Vérifié" : "❌ Non vérifié"}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Nouveau bloc : Disponibilités */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          Disponibilités
        </h2>
        {/* Statut actuel */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Disponibilité actuelle :</h3>
          {(() => {
            const now = new Date();
            const currentAvailability = bateau.availabilities.find(avail => {
              const start = new Date(avail.start_date);
              const end = new Date(avail.end_date);
              return now >= start && now <= end;
            });

            if (currentAvailability) {
              const statusInfo = getStatusInfo(currentAvailability.status);
              return (
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={statusInfo.icon} 
                    className={`text-lg ${statusInfo.color}`} 
                  />
                  <span>
                    Ce bateau est actuellement 
                    <span className={`font-semibold ${statusInfo.color}`}>
                      {currentAvailability.status === 'available' && ' disponible '}
                      {currentAvailability.status === 'booked' && ' réservé '}
                      {currentAvailability.status === 'maintenance' && ' en maintenance '}
                    </span>
                    jusqu'au {formatDate(currentAvailability.end_date)}.
                  </span>
                </p>
              );
            } else {
              return (
                <p className="flex items-center gap-2 text-gray-500">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
                  <span>Aucune disponibilité enregistrée pour la période actuelle.</span>
                </p>
              );
            }
          })()}
        </div>
        {bateau.availabilities && bateau.availabilities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bateau.availabilities.map((availability) => {
                  const statusInfo = getStatusInfo(availability.status);
                  return (
                    <tr key={availability.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Du {formatDate(availability.start_date)} au {formatDate(availability.end_date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`flex items-center gap-1 text-sm ${statusInfo.color}`}>
                          <FontAwesomeIcon icon={statusInfo.icon} />
                          {availability.status === 'available' && 'Disponible'}
                          {availability.status === 'booked' && 'Réservé'}
                          {availability.status === 'maintenance' && 'Maintenance'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune disponibilité enregistrée</p>
        )}

        {/* Bouton pour gérer les disponibilités */}
        <div className="mt-4">
          <Link
            to={`/my-space/boats/${id}/availabilities`}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded text-mocha bg-mocha/10 hover:bg-mocha/20"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Gérer les disponibilités
          </Link>
        </div>
      </div>

      <Link to="/my-space/boats" className="text-slate-blue hover:underline flex items-center gap-2">
        ← Retour à mes bateaux
      </Link>
    </div>
  );
}