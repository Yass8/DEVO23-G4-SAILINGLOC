// CréerBateau.jsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Step1Infos from "./wizards/Step1Infos";
import Step2Equipments from "./wizards/Step2Equipments";
import Step3Photos from "./wizards/Step3Photos";
import Step4Summary from "./wizards/Step4Summary";
import { createBoat } from "../../../services/boatServices";
import { createBoatEquipment } from "../../../services/boatEquipmentServices";
import { createBoatPhoto } from "../../../services/boatPhotoServices";
import { fetchBoatTypes } from "../../../services/boatTypeSevices";
import { fetchPorts } from "../../../services/portServices";
import { getCurrentUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { SuccessAlert2, ErrorAlert } from "../../common/SweetAlertComponents";
import { mapServerErrorsToFields } from "../../../utils/mapServerErrorsToFields";

const STEPS = ["Infos", "Équipements", "Documents", "Récapitulatif"];

export default function CreerBateauWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [boatTypes, setBoatTypes] = useState([]);
  const [ports, setPorts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({
    registration_number: "",
    name: "",
    brand: "",
    model: "",
    type_id: "",
    length: "",
    engine_type: "",
    skipper_required: false,
    description: "",
    max_passengers: "",
    daily_price: "",
    water_draft: "",
    port_id: "",
    equipment: [],
    photos: [],
    insurance_file: null,
    registration_file: null,
    user_id: "",
  });
  const [errors, setErrors] = useState({});
  const [mainIndex, setMainIndex] = useState(0);

  const navigate = useNavigate();

  // Charger les types de bateaux, ports et utilisateur connecté au montage du composant
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [typesData, portsData] = await Promise.all([
          fetchBoatTypes(),
          fetchPorts(),
        ]);
        setBoatTypes(typesData);
        setPorts(portsData);

        // Charger l'utilisateur connecté
        const user = getCurrentUser();
        if (user && user.id) {
          setCurrentUser(user);
          setData((prevData) => ({
            ...prevData,
            user_id: user.id,
          }));
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données initiales:",
          error
        );
      }
    };

    loadInitialData();
  }, []);

  const cleanFormData = (data) => {
    return {
      registration_number: data.registration_number,
      name: data.name,
      brand: data.brand || null,
      model: data.model || null,
      type_id: data.type_id ? parseInt(data.type_id) : null,
      length: data.length ? parseFloat(data.length) : null,
      engine_type: data.engine_type || null,
      skipper_required: Boolean(data.skipper_required),
      description: data.description,
      max_passengers: data.max_passengers
        ? parseInt(data.max_passengers)
        : null,
      daily_price: data.daily_price ? parseFloat(data.daily_price) : null,
      water_draft: data.water_draft ? parseFloat(data.water_draft) : null,
      port_id: data.port_id ? parseInt(data.port_id) : null,
      user_id: data.user_id ? parseInt(data.user_id) : null,
      slug: `${data.name.replace(
        /\s+/g,
        "-"
      )}-${data.registration_number.replace(/\s+/g, "-")}`,
    };
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!data.registration_number) {
        newErrors.registration_number =
          "Le numéro d'immatriculation est obligatoire";
        isValid = false;
      } else if (data.registration_number.length < 3) {
        newErrors.registration_number =
          "L'immatriculation doit avoir au moins 3 caractères";
        isValid = false;
      }

      if (!data.name) {
        newErrors.name = "Le nom est obligatoire";
        isValid = false;
      }

      if (!data.type_id) {
        newErrors.type_id = "Le type est obligatoire";
        isValid = false;
      }

      if (
        !data.daily_price ||
        isNaN(data.daily_price) ||
        parseFloat(data.daily_price) <= 0
      ) {
        newErrors.daily_price = "Prix journalier invalide";
        isValid = false;
      }

      if (
        !data.max_passengers ||
        isNaN(data.max_passengers) ||
        parseInt(data.max_passengers) <= 0
      ) {
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

      if (!data.insurance_file) {
        newErrors.insurance_file = "Le document d'assurance est obligatoire";
        isValid = false;
      }

      if (!data.registration_file) {
        newErrors.registration_file =
          "Le document d'immatriculation est obligatoire";
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

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true);

    try {
      const boatData = cleanFormData(data);
      const files = {
        insurance_file: data.insurance_file,
        registration_file: data.registration_file,
        photos: data.photos,
      };

      const boatResult = await createBoat(boatData, files);
      const boatId = boatResult?.id;
      if (!boatId) throw new Error("ID bateau manquant");

      if (data.equipment.length) {
        const equipmentData = data.equipment.map((name) => ({
          boat_id: boatId,
          equipment_name: name,
        }));
        await createBoatEquipment(equipmentData);
      }

      if (data.photos.length) {
        await createBoatPhoto(boatId, data.photos, mainIndex);
      }

      await SuccessAlert2(
        "Bateau créé !",
        "Votre bateau est en ligne et en attente de validation."
      );
      navigate(`/my-space/boats/${boatResult.slug}`);
    } catch (error) {
      console.error("Erreur lors de la soumission  du bateau:", error);

      const serverMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      const mapped = mapServerErrorsToFields(serverMsg);

      if (Object.keys(mapped).length) {
        setErrors(mapped);

        // Retour à l’étape concernée
        if (
          mapped.registration_number ||
          mapped.name ||
          mapped.type_id ||
          mapped.daily_price ||
          mapped.max_passengers ||
          mapped.description ||
          mapped.length
        ) {
          setStep(0);
        }
        return;
      }

      // Erreur alerte générale
      ErrorAlert("Erreur", serverMsg || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step1Infos
            data={data}
            setData={setData}
            errors={errors}
            setErrors={setErrors}
            boatTypes={boatTypes}
            ports={ports}
          />
        );
      case 1:
        return <Step2Equipments data={data} setData={setData} />;
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
        return <Step4Summary data={data} mainIndex={mainIndex} />;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="space-y-6 bg-white p-6 rounded shadow max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
        <p>Vous devez être connecté pour créer un bateau.</p>
      </div>
    );
  }

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
                ? "bg-sage-green"
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
          disabled={step === 0 || loading}
          className={`flex items-center px-4 py-2 rounded ${
            step === 0
              ? "bg-gray-200 text-gray-500"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Précédent
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={loading}
            className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark disabled:opacity-50"
          >
            Suivant <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin mr-2"
                />
                Création...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Confirmer la création
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
