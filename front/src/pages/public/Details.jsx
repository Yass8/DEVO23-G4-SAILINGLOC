// src/pages/Boats/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import ScrollToTop from "../../components/common/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchBoatBySlug, fetchBoatPhotos } from "../../services/boatServices";

function Details() {
  const { slug } = useParams();
  const [boat, setBoat] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const api_base_url = import.meta.env.VITE_API_BASE_URL
  
  const buildImageUrl = (path) => `${api_base_url}${path}`;

  useEffect(() => {
    fetchBoatBySlug(`/${slug}`)
      .then((data) => {
        setBoat(data);
        return fetchBoatPhotos(data.id);
      })
      .then((pics) => {
        setPhotos(pics);
        setMainImage(pics.find(p => p.is_main)?.photo_url || pics[0]?.photo_url || "/placeholder.jpg");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Chargement…</p>;
  if (!boat) return <p className="text-center mt-10">Bateau introuvable.</p>;

  return (
    <>
      <ScrollToTop />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Galerie */}
          <div className="lg:col-span-2">
            <img
              src={buildImageUrl(mainImage)}
              alt={boat.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {photos.map((photo) => (
                <img
                  key={photo.id}
                  src={buildImageUrl(photo.photo_url)}
                  alt={`${boat.name} ${photo.id}`}
                  className="w-24 h-20 object-cover rounded-md cursor-pointer border-2 hover:border-yellow-500 transition"
                  onClick={() => setMainImage(photo.photo_url)}
                />
              ))}
            </div>
          </div>

          {/* Infos */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{boat.name}</h1>
            <p className="text-lg text-gray-600">
              {boat.brand} • {boat.model} • {boat.length} m
            </p>
            <p className="text-2xl font-semibold text-yellow-700">
              {boat.daily_price} € / jour
            </p>

            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Port :</strong> {boat.Port?.name}</p>
              <p><strong>Type :</strong> {boat.BoatType?.name}</p>
              <p><strong>Capacité :</strong> {boat.max_passengers} personnes</p>
              <p><strong>Moteur :</strong> {boat.engine_type}</p>
              <p><strong>Skipper requis :</strong> {boat.skipper_required ? "Oui" : "Non"}</p>
            </div>

            <button className="w-full bg-mocha text-sand py-3 rounded-lg font-semibold hover:bg-mocha/80 hover:text-white transition">
              <a href={`/booking/${boat.slug}`}>Louer maintenant</a>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{boat.description}</p>
        </div>

        {/* Équipements */}
        {boat.BoatEquipments?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Équipements</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
              {boat.BoatEquipments.map((eq) => (
                <li key={eq.id} className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-slate-blue" />
                  {eq.equipment_name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disponibilités */}
        {boat.Availabilities?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Disponibilités</h2>
            <ul className="space-y-3">
              {boat.Availabilities.map((avail) => (
                <li
                  key={avail.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <span>
                    Du <strong>{new Date(avail.start_date).toLocaleDateString('fr-FR')}</strong> au{" "}
                    <strong>{new Date(avail.end_date).toLocaleDateString('fr-FR')}</strong>
                  </span>

                  <span
                    className={`font-semibold ${
                      avail.status === "available"
                        ? "text-slate-blue"
                        : "text-red-400"
                    }`}
                  >
                    {avail.status === "available" ? "Disponible" : "Réservé"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Details;