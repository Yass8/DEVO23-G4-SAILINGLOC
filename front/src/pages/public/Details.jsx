// src/pages/Boats/Details.jsx
import { useState } from "react";
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import ScrollToTop from "../../components/common/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const mockBoat = {
  name: "Sunset Dream",
  brand: "Jeanneau",
  model: "Sun Odyssey 449",
  length: 13.5,
  engine_type: "Diesel",
  skipper_required: true,
  description:
    "Magnifique voilier idéal pour une croisière en Méditerranée. Parfait pour 10 personnes avec tout le confort nécessaire à bord.",
  max_passengers: 10,
  daily_price: 450,
  port: { name: "Port de Marseille" },
  boat_type: { name: "Voilier" },
  photos: [
    { photo_url: "https://images.unsplash.com/photo-1500514966906-fe367bfb0d0b", is_main: true },
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    "https://images.unsplash.com/photo-1581275868691-8f473e27c87b",
  ],
  equipments: ["GPS", "Douche", "Frigo", "Hi-Fi Bluetooth", "Annexe", "Paddle"],
  availabilities: [
    { start_date: "2025-09-01", end_date: "2025-09-10", status: "available" },
    { start_date: "2025-09-15", end_date: "2025-09-25", status: "booked" },
  ],
};

function Details() {
  const [mainImage, setMainImage] = useState(mockBoat.photos[0].photo_url);

  return (
    <>
      <ScrollToTop />
      <Header />
      <Banner />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne gauche : galerie */}
          <div className="lg:col-span-2">
            <img
              src={mainImage}
              alt={mockBoat.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {mockBoat.photos.map((photo, index) => (
                <img
                  key={index}
                  src={typeof photo === "string" ? photo : photo.photo_url}
                  alt={`${mockBoat.name} ${index + 1}`}
                  className="w-24 h-20 object-cover rounded-md cursor-pointer border-2 hover:border-yellow-500 transition"
                  onClick={() =>
                    setMainImage(typeof photo === "string" ? photo : photo.photo_url)
                  }
                />
              ))}
            </div>
          </div>

          {/* Colonne droite : infos + CTA */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{mockBoat.name}</h1>
            <p className="text-lg text-gray-600">
              {mockBoat.brand} • {mockBoat.model} • {mockBoat.length} m
            </p>
            <p className="text-2xl font-semibold text-yellow-700">
              {mockBoat.daily_price} € / jour
            </p>

            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Port :</strong> {mockBoat.port.name}</p>
              <p><strong>Type :</strong> {mockBoat.boat_type.name}</p>
              <p><strong>Capacité :</strong> {mockBoat.max_passengers} personnes</p>
              <p><strong>Moteur :</strong> {mockBoat.engine_type}</p>
              <p><strong>Skipper requis :</strong> {mockBoat.skipper_required ? "Oui" : "Non"}</p>
            </div>

            <button className="w-full bg-mocha text-sand py-3 rounded-lg font-semibold hover:bg-mocha/80 hover:text-white transition">
              <a href="/booking">Louer maintenant</a>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{mockBoat.description}</p>
        </div>

        {/* Équipements */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Équipements</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
            {mockBoat.equipments.map((eq, i) => (
              <li key={i} className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-blue" />
                {eq}
              </li>
            ))}
          </ul>
        </div>

        {/* Disponibilités */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Disponibilités</h2>
          <ul className="space-y-3">
            {mockBoat.availabilities.map((avail, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span>
                  Du <strong>{avail.start_date}</strong> au{" "}
                  <strong>{avail.end_date}</strong>
                </span>
                <span
                  className={`font-semibold ${
                    avail.status === "available"
                      ? "text-slate-blue"
                      : "text-red-600"
                  }`}
                >
                  {avail.status === "available" ? "Disponible" : "Réservé"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Details;