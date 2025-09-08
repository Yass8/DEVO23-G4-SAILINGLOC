import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnchor, faRuler, faUsers, faMoneyBill, faMapMarkerAlt, faCertificate,
  faEdit, faCheckCircle, faTimesCircle, faTools, faCalendarAlt, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { fetchBoatBySlug } from "../../../services/boatServices";
import FileModal from "../../../components/common/FileModal";
import { getCurrentUser } from "../../../services/authService";
import Preloader from "../../common/Preloader";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ViewBoat() {
  const { slug } = useParams();
  const [boat, setBoat] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [equipments, setEquipments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, url: "", type: "" });

  useEffect(() => {
    loadBoat();
  }, [slug]);

  const loadBoat = async () => {
  try {
    const user = getCurrentUser();
    const data = await fetchBoatBySlug(slug); 

    if (data.user_id !== user.id) return navigate("/my-space/boats");

    setBoat(data);
    setPhotos(data.BoatPhotos);                
    setEquipments(data.BoatEquipments);        
    setAvailabilities(data.Availabilities);     

    const idx = data.BoatPhotos.findIndex(p => p.is_main);
    setMainIndex(idx === -1 ? 0 : idx);
  } catch (err) {
    console.error(err);
    navigate("/my-space/boats");
  } finally {
    setLoading(false);
  }
};

  const navigate = useNavigate();
  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR");

  const getStatusInfo = (status) => {
    switch (status) {
      case "available": return { icon: faCheckCircle, color: "text-green-500" };
      case "booked": return { icon: faTimesCircle, color: "text-red-500" };
      case "maintenance": return { icon: faTools, color: "text-yellow-500" };
      default: return { icon: faCheckCircle, color: "text-gray-500" };
    }
  };

  const openModal = (url, type) => setModal({ isOpen: true, url, type });
  const closeModal = () => setModal({ isOpen: false, url: "", type: "" });

  if (loading) return <Preloader />;
  if (!boat) return <p className="text-center mt-10">Bateau introuvable.</p>;

  const mainPhoto = photos[mainIndex]?.photo_url || "/placeholder.jpg";

  return (
    <div className="lg:mx-4 p-4 space-y-6">
      {/* Photo principale */}
      <img src={`${API_BASE}${mainPhoto}`} alt={`${boat.name}`} className="w-full h-64 md:h-96 object-cover rounded shadow" />
      {photos[mainIndex]?.is_main && (
        <p className="text-center text-sm font-semibold text-slate-blue">Photo principale</p>
      )}

      {/* Miniatures */}
      <div className="flex gap-2 justify-center overflow-x-auto py-2">
        {photos.map((p, idx) => (
          <img
            key={p.id}
            src={`${API_BASE}${p.photo_url}`}
            alt={`mini ${idx + 1}`}
            className={`w-24 h-16 object-cover rounded cursor-pointer border-2 shrink-0 ${
              idx === mainIndex ? "border-slate-blue scale-100" : "border-gray-300 hover:border-mocha"
            }`}
            onClick={() => setMainIndex(idx)}
          />
        ))}
      </div>

      {/* Titre + bouton Modifier */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{boat.name}</h1>
          <p className="text-gray-600">{boat.brand} • {boat.model}</p>
        </div>
        <Link to={`/my-space/boats/${slug}/edit`} className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90 flex items-center gap-2">
          <FontAwesomeIcon icon={faEdit} /> Modifier
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Fiche technique</h2>
          <ul className="space-y-2 text-sm">
            <li><FontAwesomeIcon icon={faRuler} /> Longueur : {boat.length} m</li>
            <li><FontAwesomeIcon icon={faUsers} /> Passagers max : {boat.max_passengers}</li>
            <li><FontAwesomeIcon icon={faMoneyBill} /> Prix/jour : {boat.daily_price} €</li>
            <li><FontAwesomeIcon icon={faAnchor} /> Moteur : {boat.engine_type}</li>
            <li><FontAwesomeIcon icon={faMapMarkerAlt} /> Port : {boat.Port?.name}</li>
            <li><FontAwesomeIcon icon={faCertificate} /> Immatriculation : <span className="font-mono">{boat.registration_number}</span></li>
            <li>Skipper obligatoire : <span className={boat.skipper_required ? "text-red-600" : "text-green-600"}>{boat.skipper_required ? "Oui" : "Non"}</span></li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Équipements</h2>
          {equipments.length ? (
            <ul className="list-disc list-inside text-sm space-y-1">
              {equipments.map((eq) => <li key={eq.id}>{eq.equipment_name}</li>)}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun équipement renseigné.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-sm text-gray-700">{boat.description}</p>
      </div>

      {/* Documents officiels (assurance, permis, etc.) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} /> Documents officiels
        </h2>
        {boat.insurance_url || boat.registration_url ? (
  <ul className="space-y-2 text-sm">
    {boat.insurance_url && (
      <li className="flex justify-between items-center">
        <span>Assurance</span>
        <button onClick={() => openModal(boat.insurance_url, "Assurance")} className="text-slate-blue hover:underline">
          Voir le document
        </button>
      </li>
    )}
    {boat.registration_url && (
      <li className="flex justify-between items-center">
        <span>Immatriculation</span>
        <button onClick={() => openModal(boat.registration_url, "Immatriculation")} className="text-slate-blue hover:underline">
          Voir le document
        </button>
      </li>
    )}
  </ul>
) : (
  <p className="text-sm text-gray-500">Aucun document officiel téléchargé.</p>
)}
      </div>

      {/* Disponibilités */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} /> Disponibilités
        </h2>
        {availabilities.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((av) => {
                  const status = getStatusInfo(av.status);
                  return (
                    <tr key={av.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Du {formatDate(av.start_date)} au {formatDate(av.end_date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span className={`flex items-center gap-1 ${status.color}`}>
                          <FontAwesomeIcon icon={status.icon} />
                          {av.status === "available" && "Disponible"}
                          {av.status === "booked" && "Réservé"}
                          {av.status === "maintenance" && "Maintenance"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune disponibilité enregistrée.</p>
        )}
        <div className="mt-4">
          <Link to={`/my-space/boats/${slug}/availabilities`} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded text-mocha bg-mocha/10 hover:bg-mocha/20">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Gérer les disponibilités
          </Link>
        </div>
      </div>

      <Link to="/my-space/boats" className="text-slate-blue hover:underline flex items-center gap-2">
        ← Retour à mes bateaux
      </Link>

      <FileModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        fileUrl={modal.url}
        fileType={modal.type}
      />
    </div>
  );
}