import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSave,
  faPlus,
  faArrowLeft,
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
};

export default function EditBoat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [boatData, setBoatData] = useState(bateau);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newEquipment, setNewEquipment] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const [focusedFields, setFocusedFields] = useState({});
  const [errors, setErrors] = useState({});

  const shouldFloat = (field) => focusedFields[field] || boatData[field];

  const handleFocus = (field) => setFocusedFields({ ...focusedFields, [field]: true });
  const handleBlur = (field) => setFocusedFields({ ...focusedFields, [field]: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBoatData({
      ...boatData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Effacer l'erreur lorsqu'on modifie le champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setBoatData({
        ...boatData,
        equipment: [...boatData.equipment, newEquipment.trim()],
      });
      setNewEquipment("");
    }
  };

  const removeEquipment = (index) => {
    setBoatData({
      ...boatData,
      equipment: boatData.equipment.filter((_, i) => i !== index),
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos([...newPhotos, ...files]);
  };

  const removePhoto = (index) => {
    if (index < boatData.photos.length) {
      setBoatData({
        ...boatData,
        photos: boatData.photos.filter((_, i) => i !== index),
      });
      if (selectedIndex === index) setSelectedIndex(0);
    } else {
      const newIndex = index - boatData.photos.length;
      setNewPhotos(newPhotos.filter((_, i) => i !== newIndex));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!boatData.name) newErrors.name = "Le nom est obligatoire";
    if (!boatData.type) newErrors.type = "Le type est obligatoire";
    if (!boatData.daily_price || isNaN(boatData.daily_price)) 
      newErrors.daily_price = "Prix journalier invalide";
    if (!boatData.max_passengers || isNaN(boatData.max_passengers))
      newErrors.max_passengers = "Nombre de passagers invalide";
    if (!boatData.description || boatData.description.length < 10)
      newErrors.description = "Description trop courte (min 10 caractères)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    if (formType === "infos" && !validateForm()) return;
    
    try {
      console.log(`Soumission ${formType}:`, boatData);
      alert("Modifications enregistrées avec succès");
      navigate(`/my-space/boats/${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const deleteBoat = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bateau ?")) {
      console.log("Bateau supprimé");
      navigate("/my-space/boats");
    }
  };

  return (
    <div className="lg:mx-4 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={`/my-space/boats/${id}`}
          className="text-slate-blue hover:underline flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au bateau
        </Link>
        <button
          onClick={deleteBoat}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <FontAwesomeIcon icon={faTrash} /> Supprimer le bateau
        </button>
      </div>

      {/* Formulaire des informations générales */}
      <form onSubmit={(e) => handleSubmit(e, "infos")} className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Informations générales</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nom */}
          <div className="relative">
            <label
              htmlFor="name"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('name') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              } ${errors.name ? 'text-red-500' : ''}`}
            >
              Nom*
            </label>
            <input
              id="name"
              name="name"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-mocha'
              }`}
              value={boatData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={() => handleBlur('name')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Type */}
          <div className="relative">
            <label
              htmlFor="type"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('type') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              } ${errors.type ? 'text-red-500' : ''}`}
            >
              Type*
            </label>
            <input
              id="type"
              name="type"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
                errors.type 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-mocha'
              }`}
              value={boatData.type}
              onChange={handleChange}
              onFocus={() => handleFocus('type')}
              onBlur={() => handleBlur('type')}
            />
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Marque */}
          <div className="relative">
            <label
              htmlFor="brand"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('brand') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Marque
            </label>
            <input
              id="brand"
              name="brand"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.brand}
              onChange={handleChange}
              onFocus={() => handleFocus('brand')}
              onBlur={() => handleBlur('brand')}
            />
          </div>

          {/* Modèle */}
          <div className="relative">
            <label
              htmlFor="model"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('model') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Modèle
            </label>
            <input
              id="model"
              name="model"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.model}
              onChange={handleChange}
              onFocus={() => handleFocus('model')}
              onBlur={() => handleBlur('model')}
            />
          </div>

          {/* Longueur */}
          <div className="relative">
            <label
              htmlFor="length"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('length') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Longueur (m)
            </label>
            <input
              id="length"
              name="length"
              type="number"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.length}
              onChange={handleChange}
              onFocus={() => handleFocus('length')}
              onBlur={() => handleBlur('length')}
            />
          </div>

          {/* Passagers max */}
          <div className="relative">
            <label
              htmlFor="max_passengers"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('max_passengers') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              } ${errors.max_passengers ? 'text-red-500' : ''}`}
            >
              Passagers max*
            </label>
            <input
              id="max_passengers"
              name="max_passengers"
              type="number"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
                errors.max_passengers 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-mocha'
              }`}
              value={boatData.max_passengers}
              onChange={handleChange}
              onFocus={() => handleFocus('max_passengers')}
              onBlur={() => handleBlur('max_passengers')}
            />
            {errors.max_passengers && <p className="mt-1 text-sm text-red-500">{errors.max_passengers}</p>}
          </div>

          {/* Prix/jour */}
          <div className="relative">
            <label
              htmlFor="daily_price"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('daily_price') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              } ${errors.daily_price ? 'text-red-500' : ''}`}
            >
              Prix/jour (€)*
            </label>
            <input
              id="daily_price"
              name="daily_price"
              type="number"
              className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
                errors.daily_price 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-mocha'
              }`}
              value={boatData.daily_price}
              onChange={handleChange}
              onFocus={() => handleFocus('daily_price')}
              onBlur={() => handleBlur('daily_price')}
            />
            {errors.daily_price && <p className="mt-1 text-sm text-red-500">{errors.daily_price}</p>}
          </div>

          {/* Port */}
          <div className="relative">
            <label
              htmlFor="port"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('port') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Port d'attache
            </label>
            <input
              id="port"
              name="port"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.port}
              onChange={handleChange}
              onFocus={() => handleFocus('port')}
              onBlur={() => handleBlur('port')}
            />
          </div>

          {/* Type de moteur */}
          <div className="relative">
            <label
              htmlFor="engine_type"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('engine_type') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Type de moteur
            </label>
            <input
              id="engine_type"
              name="engine_type"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.engine_type}
              onChange={handleChange}
              onFocus={() => handleFocus('engine_type')}
              onBlur={() => handleBlur('engine_type')}
            />
          </div>

          {/* Immatriculation */}
          <div className="relative">
            <label
              htmlFor="immatriculation"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloat('immatriculation') 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Immatriculation
            </label>
            <input
              id="immatriculation"
              name="immatriculation"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              value={boatData.immatriculation}
              onChange={handleChange}
              onFocus={() => handleFocus('immatriculation')}
              onBlur={() => handleBlur('immatriculation')}
            />
          </div>

          {/* Skipper requis */}
          <div className="flex items-center space-x-2 p-3">
            <input
              type="checkbox"
              name="skipper_required"
              checked={boatData.skipper_required}
              onChange={handleChange}
              className="rounded text-mocha focus:ring-mocha"
              id="skipper_required"
            />
            <label htmlFor="skipper_required">Skipper obligatoire</label>
          </div>
        </div>

        {/* Description */}
        <div className="relative">
          <label
            htmlFor="description"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('description') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.description ? 'text-red-500' : ''}`}
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.description 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            rows={3}
            value={boatData.description}
            onChange={handleChange}
            onFocus={() => handleFocus('description')}
            onBlur={() => handleBlur('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <button
          type="submit"
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les modifications
        </button>
      </form>

      {/* Formulaire des équipements */}
      <form onSubmit={(e) => handleSubmit(e, "equipments")} className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Équipements</h2>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <label
              htmlFor="newEquipment"
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                newEquipment 
                  ? '-top-2 text-xs bg-white px-1 text-mocha'
                  : 'top-3 text-gray-500'
              }`}
            >
              Ajouter un équipement
            </label>
            <input
              id="newEquipment"
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
              onFocus={() => setFocusedFields({...focusedFields, newEquipment: true})}
              onBlur={() => setFocusedFields({...focusedFields, newEquipment: false})}
            />
          </div>
          <button
            type="button"
            onClick={addEquipment}
            className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark self-end"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <ul className="space-y-2">
          {boatData.equipment.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeEquipment(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les équipements
        </button>
      </form>

      {/* Formulaire des photos */}
      <form onSubmit={(e) => handleSubmit(e, "photos")} className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Photos</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Ajouter des photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-mocha file:text-sand hover:file:bg-mocha-dark"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...boatData.photos, ...newPhotos].map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                alt={`Photo ${index + 1}`}
                className={`w-full h-32 object-cover rounded border-2 ${
                  index === selectedIndex ? "border-mocha" : "border-transparent"
                }`}
                onClick={() => setSelectedIndex(index)}
              />
              {index === selectedIndex && (
                <span className="absolute top-1 left-1 bg-mocha text-white text-xs px-2 py-1 rounded">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FontAwesomeIcon icon={faTrash} size="xs" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark"
        >
          <FontAwesomeIcon icon={faSave} /> Enregistrer les photos
        </button>
      </form>
    </div>
  );
}