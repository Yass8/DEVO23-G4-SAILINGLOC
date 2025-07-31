
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnchor,
  faRuler,
  faUsers,
  faMoneyBill,
  faMapMarkerAlt,
  faCertificate,
  faEdit,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Simulation des photos
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
    "https://picsum.photos/seed/boat1/600/400",
    "https://picsum.photos/seed/boat2/600/400",
    "https://picsum.photos/seed/boat3/600/400",
    "https://picsum.photos/seed/boat4/600/400",
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
};

export default function VoirBateau() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % bateau.photos.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + bateau.photos.length) % bateau.photos.length);

  return (
    <div className="mx-3 p-4 space-y-6">
      {/* Carousel */}
      <div className="relative w-full h-64 md:h-96 rounded overflow-hidden shadow">
        <img
          src={bateau.photos[currentIndex]}
          alt={`Photo ${currentIndex + 1} de ${bateau.name}`}
          className="w-full h-full object-cover"
        />
        {/* Flèches */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-mocha/80 text-white rounded-[100%] p-2 px-3 hover:bg-mocha/50"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-2 -translate-y-1/2  bg-mocha/80 text-white rounded-[100%] p-2 px-3 hover:bg-mocha/50"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        {/* Indicateurs */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {bateau.photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ... reste du code inchangé ... */}

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{bateau.name}</h1>
          <p className="text-gray-600">
            {bateau.brand} • {bateau.model}
          </p>
        </div>
        <a
          href={`/my-space/boats/${id}/edit`}
          className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEdit} /> Modifier
        </a>
      </div>

      {/* Grille infos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fiche technique */}
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

        {/* Équipements */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Équipements</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            {bateau.equipment.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-sm text-gray-700">{bateau.description}</p>
      </div>

      {/* Documents officiels */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Documents officiels</h2>
        <ul className="space-y-2">
          {bateau.documents.map((doc) => (
            <li key={doc.type} className="flex justify-between items-center">
              <span>{doc.type}</span>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${doc.verified ? "text-green-600" : "text-red-600"}`}
              >
                {doc.verified ? "✅ Vérifié" : "❌ Non vérifié"}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Bouton retour */}
      <div>
        <a
          href="/my-space/boats"
          className="text-slate-blue hover:underline flex items-center gap-2"
        >
          ← Retour à mes bateaux
        </a>
      </div>
    </div>
  );
}