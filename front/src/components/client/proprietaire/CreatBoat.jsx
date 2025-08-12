import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import Step1Infos from "./wizards/Step1Infos"
import Step2Equipments from "./wizards/Step2Equipments";
import Step3Photos from "./wizards/Step3Photos";
import Step4Summary from "./wizards/Step4Summary";

const STEPS = ["Infos", "Équipements", "Photos", "Récapitulatif"];

export default function CreerBateauWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    engine_type: "",
    daily_price: "",
    max_passengers: "",
    length: "",
    width: "",
    draft: "",
    year: "",
    description: "",
    skipper_required: false,
    equipment: [],
    photos: [],
  });
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState("");
  const [mainIndex, setMainIndex] = useState(0);

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!data.name) {
        newErrors.name = "Le nom est obligatoire";
        isValid = false;
      }
      if (!data.type) {
        newErrors.type = "Le type est obligatoire";
        isValid = false;
      }
      if (!data.daily_price || isNaN(data.daily_price)) {
        newErrors.daily_price = "Prix journalier invalide";
        isValid = false;
      }
      if (!data.max_passengers || isNaN(data.max_passengers)) {
        newErrors.max_passengers = "Nombre de passagers invalide";
        isValid = false;
      }
      if (!data.description || data.description.length < 10) {
        newErrors.description = "Description trop courte (min 10 caractères)";
        isValid = false;
      }
    } else if (step === 2) {
      if (data.photos.length === 0) {
        newErrors.photos = "Au moins une photo est requise";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      console.log("Données soumises:", data);
      // Ajouter l'appel API ici
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step1Infos data={data} setData={setData} errors={errors} />;
      case 1:
        return (
          <Step2Equipments 
            data={data} 
            setData={setData} 
            input={input} 
            setInput={setInput} 
          />
        );
      case 2:
        return (
          <Step3Photos 
            data={data} 
            setData={setData} 
            mainIndex={mainIndex} 
            setMainIndex={setMainIndex}
            errors={errors}
          />
        );
      case 3:
        return <Step4Summary data={data} mainIndex={mainIndex}  />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Ajout d'un bateau</h1>
      
      <div className="flex justify-between">
        {STEPS.map((label, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-1 text-sm rounded mx-1 ${
              index === step 
                ? "bg-mocha text-sand" 
                : index < step 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-200"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {renderStep()}

      <div className="flex justify-between items-center pt-4 border-t">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className={`flex items-center px-4 py-2 rounded ${
            step === 0 ? "bg-gray-200 text-gray-500" : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Précédent
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark"
          >
            Suivant <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Confirmer la création
          </button>
        )}
      </div>
    </div>
  );
}