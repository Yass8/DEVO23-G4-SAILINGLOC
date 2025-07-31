import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const STEPS = ["Infos", "Équipements", "Photos", "Récapitulatif"];

export default function CreerBateauWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    type: "",
    daily_price: "",
    max_passengers: "",
    length: "",
    description: "",
    equipment: [],
    photos: [],
  });
  const [input, setInput] = useState("");
  const [mainIndex, setMainIndex] = useState(0);

  // Navigation
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Equipements
  const addEquip = () => {
    if (input.trim()) {
      setData((d) => ({
        ...d,
        equipment: [...d.equipment, input.trim()],
      }));
      setInput("");
    }
  };
  const removeEquip = (idx) => {
    setData((d) => ({
      ...d,
      equipment: d.equipment.filter((_, i) => i !== idx),
    }));
  };

  // Photos
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setData((d) => ({ ...d, photos: [...d.photos, ...files] }));
    if (files.length && data.photos.length === 0) setMainIndex(0);
  };
  const removePhoto = (idx) => {
    setData((d) => {
      const newPhotos = d.photos.filter((_, i) => i !== idx);
      if (idx === mainIndex) setMainIndex(Math.max(0, newPhotos.length - 1));
      return { ...d, photos: newPhotos };
    });
  };

  // Steps
  const renderStep1 = () => (
    <div className="flex justify-center items-center space-x-4">
      <div className="space-y-4 lg:w-1/2">
        <h2 className="text-xl font-bold">Informations générales</h2>
      <input
        className="border w-full p-2 rounded"
        placeholder="Nom"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <input
        className="border w-full p-2 rounded"
        placeholder="Type"
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      />
      <input
        className="border w-full p-2 rounded"
        type="number"
        placeholder="Prix/jour (€)"
        value={data.daily_price}
        onChange={(e) => setData({ ...data, daily_price: e.target.value })}
      />
      <input
        className="border w-full p-2 rounded"
        type="number"
        placeholder="Passagers max"
        value={data.max_passengers}
        onChange={(e) => setData({ ...data, max_passengers: e.target.value })}
      />
      <textarea
        className="border w-full p-2 rounded"
        placeholder="Description"
        rows={3}
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
      />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex justify-center items-center space-x-4">
      <div className="space-y-4 lg:w-1/2">
      <h2 className="text-xl font-bold">Équipements</h2>
      <div className="flex gap-2">
        <input
          className="border flex-1 p-2 rounded"
          placeholder="Ajouter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEquip()}
        />
        <button
          type="button"
          onClick={addEquip}
          className="bg-mocha text-sand px-2 rounded"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <ul className="space-y-2">
        {data.equipment.map((eq, idx) => (
          <li
            key={idx}
            className="flex justify-between bg-gray-100 px-2 py-1 rounded"
          >
            {eq}
            <button
              type="button"
              onClick={() => removeEquip(idx)}
              className="text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex justify-center items-center space-x-4">
      <div className="space-y-4 lg:w-1/2">
      <h2 className="text-xl font-bold">Photos</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFiles}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-mocha file:text-sand"
      />
      <div className="grid grid-cols-3 gap-2">
        {data.photos.map((file, idx) => (
          <div key={idx} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className={`w-full h-24 object-cover rounded cursor-pointer ${
                idx === mainIndex ? "ring-2 ring-mocha" : ""
              }`}
              onClick={() => setMainIndex(idx)}
            />
            {idx === mainIndex && (
              <span className="absolute top-1 left-1 bg-mocha text-white text-xs px-1 rounded">
                Principale
              </span>
            )}
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="flex justify-center items-center space-x-4">
      <div className="space-y-4 lg:w-1/2">
      <h2 className="text-xl font-bold">Récapitulatif</h2>
      <ul className="text-sm space-y-1">
        <li>
          <strong>Nom :</strong> {data.name}
        </li>
        <li>
          <strong>Type :</strong> {data.type}
        </li>
        <li>
          <strong>Prix :</strong> {data.daily_price} €/jour
        </li>
        <li>
          <strong>Équipements :</strong> {data.equipment.join(", ")}
        </li>
        <li>
          <strong>Photos :</strong> {data.photos.length}
        </li>
      </ul>
      <button className="w-full bg-mocha text-sand py-2 rounded">
        <FontAwesomeIcon icon={faCheck} /> Créer
      </button>
    </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">Ajout d'un bateau</h1>
      <div className="flex justify-between">
        {STEPS.map((l, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-1 text-sm rounded ${
              i === step ? "bg-mocha text-sand" : "bg-gray-200"
            }`}
          >
            {l}
          </div>
        ))}
      </div>
      {renderStep()}
      <div className="flex justify-center items-center">
      <div className=" lg:w-1/2 flex justify-between items-center space-x-4 mt-4">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Précédent
        </button>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={next}
            className="bg-mocha text-sand px-3 py-1 rounded"
          >
            Enregistrer et continuer <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>
      </div>
    </div>
  );
}