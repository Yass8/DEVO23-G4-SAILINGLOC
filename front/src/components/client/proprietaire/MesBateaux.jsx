import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import Preloader from "../../common/Preloader";
import { fetchUserBoats } from "../../../services/userServices";
import { getCurrentUser } from "../../../services/authService";

const BASE_API = import.meta.env.VITE_API_BASE_URL;
export default function MesBateaux() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoats();
  }, []);

  const loadBoats = async () => {
    try {
      const user = getCurrentUser();
      const data = await fetchUserBoats(user.id);
      setBoats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloader />;
  if (boats.length === 0)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">Aucun bateau pour le moment.</p>
        <Link to="/my-space/boats/new" className="bg-mocha text-sand px-6 py-2 rounded hover:bg-mocha/90">
          Ajouter votre premier bateau
        </Link>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes bateaux</h1>
        <Link to="/my-space/boats/new" className="bg-mocha text-sand px-3 py-2 rounded flex items-center gap-2 hover:bg-mocha/90">
          <FontAwesomeIcon icon={faPlus} />
          Ajouter un bateau
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">

        {boats.map((boat) => {
          const mainPhoto = boat.BoatPhotos?.find((p) => p.is_main)?.photo_url || "/images/default-boat.jpg";
          const full_path = `${BASE_API}${mainPhoto}`;
          return (
            <div key={boat.id} className="bg-white rounded shadow overflow-hidden">
              <img src={full_path} alt={boat.name} className="w-full h-48 object-cover" />
              <div className="p-2">
                <h2 className="font-bold">{boat.name}</h2>
                <p className="text-sm text-gray-600">{boat.BoatType?.name} • {boat.Port?.name}</p>
                <p className="text-lg font-semibold text-mocha mt-2">{boat.daily_price} €/jour</p>

                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded font-medium ${
                    boat.accepted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {boat.accepted ? "Accepté" : "En attente"}
                </span>

                <div className="flex mt-2">
                  <Link
                    to={`/my-space/boats/${boat.slug}`}
                    className="flex-1 bg-mocha text-sand rounded hover:bg-mocha/90 text-center py-2 flex items-center justify-center gap-1"
                  >
                    <FontAwesomeIcon icon={faEye} /> Voir
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}