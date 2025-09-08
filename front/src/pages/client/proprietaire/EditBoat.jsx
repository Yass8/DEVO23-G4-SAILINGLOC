import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTrash,
  faUpload,
  faCheck,
  faArrowLeft,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import { fetchBoatBySlug, updateBoat } from "../../../services/boatServices";
import { fetchPorts } from "../../../services/portServices";
import { fetchBoatTypes } from "../../../services/boatTypeSevices";
import {
  createBoatPhoto,
  deleteBoatPhoto,
  updateBoatPhoto,
  updateBoatPhotoSync,
} from "../../../services/boatPhotoServices";
import { SuccessAlert } from "../../../components/common/SweetAlertComponents";
import FileModal from "../../../components/common/FileModal";
import { getCurrentUser } from "../../../services/authService";
import Preloader from "../../../components/common/Preloader";
import { createBoatEquipment, EQUIPMENTS_CATALOG, syncBoatEquipments } from "../../../services/boatEquipmentServices";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function EditBoat() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [boat, setBoat] = useState(null);
  const [ports, setPorts] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  const [insuranceFile, setInsuranceFile] = useState(null);
  const [registrationFile, setRegistrationFile] = useState(null);

  const [selectedEq, setSelectedEq] = useState([]);

  const [modal, setModal] = useState({ isOpen: false, url: "", type: "" });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      const user = getCurrentUser();
      const [b, p, t] = await Promise.all([
        fetchBoatBySlug(slug),
        fetchPorts(),
        fetchBoatTypes(),
      ]);
      if (b.user_id !== user.id) return navigate("/my-space/boats");
      setBoat(b);
      setPhotos(b.BoatPhotos || []);
      setSelectedEq(b.BoatEquipments?.map((e) => e.equipment_name) || []);
      setPorts(p);
      setTypes(t);
      const idx = (b.BoatPhotos || []).findIndex((ph) => ph.is_main);
      setMainIndex(idx === -1 ? 0 : idx);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (url, type) => setModal({ isOpen: true, url, type });
  const closeModal = () => setModal({ isOpen: false, url: "", type: "" });

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) setNewPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = async (idx) => {
    const existing = photos[idx];
    if (existing?.id) {
      await deleteBoatPhoto(existing.id);
      setPhotos((p) => p.filter((_, i) => i !== idx));
      if (idx === mainIndex) setMainIndex(Math.max(0, photos.length - 2));
    } else {
      const localIdx = idx - photos.length;
      setNewPhotos((n) => n.filter((_, i) => i !== localIdx));
    }
  };

  const handlePhotoClick = (idx) => {
    const total = photos.length + newPhotos.length;
    if (idx >= total) return;

    if (idx < photos.length) {
      // Photo existante : on la met principale
      setMainIndex(idx);
    } else {
      // Nouvelle photo : on la met en tête de file
      const newIdx = idx - photos.length;
      const reordered = [
        newPhotos[newIdx],
        ...newPhotos.slice(0, newIdx),
        ...newPhotos.slice(newIdx + 1),
      ];
      setNewPhotos(reordered);
      setMainIndex(photos.length); // elle sera en position 0 après sauvegarde
    }
  };

  const handleInsurance = (e) => setInsuranceFile(e.target.files[0]);
  const handleRegistration = (e) => setRegistrationFile(e.target.files[0]);

  const removeFile = (type) =>
    type === "insurance" ? setInsuranceFile(null) : setRegistrationFile(null);

  const toggleEq = (eq) =>
    setSelectedEq((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );

  const saveInfos = async () => {
    await updateBoat(boat.id, {
      name: boat.name,
      brand: boat.brand,
      model: boat.model,
      length: boat.length,
      max_passengers: boat.max_passengers,
      daily_price: boat.daily_price,
      description: boat.description,
      engine_type: boat.engine_type,
      skipper_required: boat.skipper_required,
      registration_number: boat.registration_number,
      port_id: boat.port_id,
      type_id: boat.type_id,
    });
    SuccessAlert("Informations mises à jour");
  };

  const saveDocs = async () => {
    const fd = new FormData();
    if (insuranceFile) fd.append("insurance", insuranceFile);
    if (registrationFile) fd.append("registration", registrationFile);
    if ([...fd.keys()].length) await updateBoat(boat.id, fd);
    SuccessAlert("Documents mis à jour");
  };

  const savePhotos = async () => {
    try {
      const keptIds = photos.map((p) => p.id);
      const mainIndexAmongExisting = Math.min(mainIndex, photos.length - 1);

      const hasPhotos = photos.length > 0;
      const hasNewPhotos = newPhotos.length > 0;

      if (!hasPhotos && hasNewPhotos) {
        await createBoatPhoto(boat.id, newPhotos, 0);
      } else if (hasPhotos || hasNewPhotos) {
        const fd = new FormData();
        fd.append("keptIds", JSON.stringify(keptIds));
        fd.append("mainId", photos[mainIndexAmongExisting]?.id ?? null);
        newPhotos.forEach((f) => fd.append("files", f));
        await updateBoatPhotoSync(boat.id, fd);
      }

      SuccessAlert("Photos mises a jour");
      setNewPhotos([]);
      await loadData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des photos :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  const saveEquipments = async () => {
  try {
    const hasEquipments = (boat.BoatEquipments?.length || 0) > 0;

    if (hasEquipments) {
      await syncBoatEquipments(boat.id, selectedEq);
    } else {
      const data = selectedEq.map(name => ({
        boat_id: boat.id,
        equipment_name: name
      }));
      await createBoatEquipment(data);
    }

    SuccessAlert('Équipements mis à jour');
    await loadData();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des équipements :', error);
    alert(`Erreur : ${error.message}`);
  }
};

  if (loading) return <Preloader />;

  return (
    <div className="lg:mx-4 p-4 space-y-8">
      <div className="flex justify-between items-center">
        <Link
          to={`/my-space/boats/${boat.slug}`}
          className="text-slate-blue hover:underline flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au bateau
        </Link>
      </div>

      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">
          Informations générales
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.name}
              onChange={(e) => setBoat({ ...boat, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.brand}
              onChange={(e) => setBoat({ ...boat, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.model}
              onChange={(e) => setBoat({ ...boat, model: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur (m)
            </label>
            <input
              type="number"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.length}
              onChange={(e) => setBoat({ ...boat, length: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passagers max
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.max_passengers}
              onChange={(e) =>
                setBoat({ ...boat, max_passengers: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix/jour (€)
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.daily_price}
              onChange={(e) =>
                setBoat({ ...boat, daily_price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port d'attache
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.port_id || ""}
              onChange={(e) => setBoat({ ...boat, port_id: e.target.value })}
            >
              <option value="">-- Sélectionner un port --</option>
              {ports.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de bateau
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.type_id || ""}
              onChange={(e) => setBoat({ ...boat, type_id: e.target.value })}
            >
              <option value="">-- Sélectionner un type --</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de moteur
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.engine_type}
              onChange={(e) =>
                setBoat({ ...boat, engine_type: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Immatriculation
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              value={boat.registration_number}
              onChange={(e) =>
                setBoat({ ...boat, registration_number: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={boat.skipper_required}
              onChange={(e) =>
                setBoat({ ...boat, skipper_required: e.target.checked })
              }
              className="rounded text-mocha focus:ring-mocha"
            />
            <label>Skipper obligatoire</label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
            rows={4}
            value={boat.description}
            onChange={(e) => setBoat({ ...boat, description: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={saveInfos}
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les informations
        </button>
      </section>

      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">Photos</h2>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
          <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Cliquez ou glissez vos photos ici
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotos}
            className="hidden"
          />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...photos, ...newPhotos].map((ph, idx) => (
            <div key={idx} className="relative group">
              <img
                src={
                  idx < photos.length
                    ? `${API_BASE}${ph.photo_url}`
                    : URL.createObjectURL(ph)
                }
                alt={`photo ${idx + 1}`}
                className={`w-full h-32 object-cover rounded border-2 cursor-pointer ${
                  idx === mainIndex ? "border-mocha" : "border-transparent"
                }`}
                onClick={() => handlePhotoClick(idx)}
              />
              {idx === mainIndex && (
                <span className="absolute top-1 left-1 bg-mocha text-white text-xs px-2 py-1 rounded">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <FontAwesomeIcon icon={faTrash} size="xs" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={savePhotos}
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les photos
        </button>
      </section>

      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">
          Documents obligatoires
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Assurance</h4>
            {boat.insurance_url && !insuranceFile ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">Document actuel</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openModal(boat.insurance_url, "Assurance")}
                    className="text-slate-blue hover:underline text-sm"
                  >
                    Voir
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile("insurance")}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : insuranceFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faFileImage} className="text-mocha" />
                  <div>
                    <p className="text-sm font-medium">{insuranceFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatSize(insuranceFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile("insurance")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-gray-400 mb-2"
                />
                <p className="text-sm text-gray-500">
                  Cliquez pour télécharger
                </p>
                <p className="text-xs text-gray-400">
                  PDF, JPG, PNG (max 5 Mo)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleInsurance}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Immatriculation</h4>
            {boat.registration_url && !registrationFile ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">Document actuel</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openModal(boat.registration_url, "Immatriculation")
                    }
                    className="text-slate-blue hover:underline text-sm"
                  >
                    Voir
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile("registration")}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : registrationFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faFileImage} className="text-mocha" />
                  <div>
                    <p className="text-sm font-medium">
                      {registrationFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatSize(registrationFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile("registration")}
                  className="text-red-400 hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mocha transition">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="text-gray-400 mb-2"
                />
                <p className="text-sm text-gray-500">
                  Cliquez pour télécharger
                </p>
                <p className="text-xs text-gray-400">
                  PDF, JPG, PNG (max 5 Mo)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleRegistration}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={saveDocs}
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les documents
        </button>
      </section>

      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">Équipements</h2>
        {Object.entries(EQUIPMENTS_CATALOG).map(([category, list]) => (
          <div key={category} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-3">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {list.map((eq) => {
                const checked = selectedEq.includes(eq);
                return (
                  <label
                    key={eq}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      checked
                        ? "border-mocha bg-mocha/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEq(eq)}
                      className="sr-only"
                    />
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={`w-4 h-4 rounded border p-0.5 ${
                        checked
                          ? "bg-mocha text-white border-mocha"
                          : "bg-white text-transparent border-gray-300"
                      }`}
                    />
                    <span className="text-sm text-gray-800">{eq}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={saveEquipments}
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les équipements
        </button>
      </section>

      <FileModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        fileUrl={modal.url}
        fileType={modal.type}
      />
    </div>
  );
}
