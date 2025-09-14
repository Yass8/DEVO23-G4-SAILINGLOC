import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import ScrollToTop from "../../components/common/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCalendarAlt,
  faUser,
  faArrowLeft,
  faInfoCircle,
  faFileUpload,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { fetchBoatBySlug } from "../../services/boatServices";
import { createReservation } from "../../services/reservationServices";
// import { updateUser } from "../../services/userServices";
import { createUserDocument } from "../../services/userDocument";

import { Step1Dates } from "../../components/common/booking/Step1Dates";
import { Step2PersonalInfo } from "../../components/common/booking/Step2PersonalInfo";
import { Step3Documents } from "../../components/common/booking/Step3Documents";
import { Step4Confirmation } from "../../components/common/booking/Step4Confirmation";
import {
  isAuthenticated,
  isTokenValid,
  getCurrentUser,
} from "../../services/authService";
import { SuccessAlert2 } from "../../components/common/SweetAlertComponents";
import { getMainPhotoUrl } from "../../utils/mainPhoto";
import { isTenant } from "../../utils/auth";
import { EnsureUserHasTenantRole } from "../../components/client/locataire/EnsureUserHasTenantRole";
import { updateUser } from "../../services/userServices";

const Booking = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();

  const [boat, setBoat] = useState(location.state?.boat || null);
  const [availabilities, setAvailabilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // États pour le formulaire de réservation
  const [user, setUser] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [passengers, setPassengers] = useState(2);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // États pour les documents
  const [identityFile, setIdentityFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    const checkAuthentication = () => {
      if (!isAuthenticated() || !isTokenValid()) {
        // Rediriger vers login avec le slug pour pouvoir revenir
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "Veuillez vous connecter pour effectuer une réservation",
          },
        });
      }
    };

    checkAuthentication();
  }, [navigate, location.pathname]);

  // Charger les données du bateau
  useEffect(() => {
    const loadBoatData = async () => {
      try {
        setLoading(true);

        if (!boat && slug) {
          const boatData = await fetchBoatBySlug(`${slug}`);
          setBoat(boatData);

          // Les disponibilités sont incluses dans la réponse
          if (boatData && boatData.Availabilities) {
            setAvailabilities(boatData.Availabilities);
          }
        } else if (boat && boat.Availabilities) {
          // Si le bateau est passé via props
          setAvailabilities(boat.Availabilities);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du bateau");
      } finally {
        setLoading(false);
      }
    };

    loadBoatData();
  }, [slug, boat]);

  useEffect(() => {
    // Charger les données de l'utilisateur connecté
    const loadUserData = () => {
      if (isAuthenticated() && isTokenValid()) {
        const user = getCurrentUser();
        if (user) {
          // Pré-remplir les champs avec les données de l'utilisateur
          setFirstName(user.firstname || "");
          setLastName(user.lastname || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
          setBirthDate(user.birth_date || "");
          setAddress(user.address || "");
          setUser(user);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      handleSuccess();
    }
  }, [showSuccess]);

  // Validation du formulaire
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!startDate) errors.startDate = "La date de début est requise";
      if (!endDate) errors.endDate = "La date de fin est requise";
      if (startDate && endDate && startDate >= endDate) {
        errors.dateRange =
          "La date de fin doit être postérieure à la date de début";
      }

      if (startDate && endDate) {
        const isPeriodAvailable = availabilities.some((availability) => {
          const availStart = new Date(availability.start_date);
          const availEnd = new Date(availability.end_date);
          return (
            startDate >= availStart &&
            endDate <= availEnd &&
            availability.status === "available"
          );
        });

        if (!isPeriodAvailable) {
          errors.dateRange = "La période sélectionnée n'est pas disponible";
        }
      }
    }

    if (step === 2) {
      if (!firstName) errors.firstName = "Le prénom est requis";
      if (!lastName) errors.lastName = "Le nom est requis";
      if (!email) {
        errors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "L'email n'est pas valide";
      }
      if (!phone) errors.phone = "Le téléphone est requis";
      if (!address) errors.address = "L'adresse est requise";
      if (!birthDate) {
        errors.birthDate = "La date de naissance est requise";
      } else {
        const birth = new Date(birthDate);
        const today = new Date();

        if (birth >= today) {
          errors.birthDate = "La date de naissance doit être dans le passé";
        } else {
          const age = Math.floor(
            (today - birth) / (365.25 * 24 * 60 * 60 * 1000)
          );
          if (age < 18) {
            errors.birthDate = "Vous devez avoir au moins 18 ans";
          }
        }
      }
    }

    if (step === 3) {
      if (!identityFile)
        errors.identityFile = "La pièce d'identité est requise";

      if (!licenseFile)
        errors.licenseFile = "Le permis nautique ou CV est requis";

      if (!addressFile)
        errors.addressFile = "Le justificatif de domicile est requis";
    }

    return errors;
  };

  // Calcul du nombre de jours et du prix total
  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const days = calculateDays();

  // Fonctions de navigation entre les étapes
  const nextStep = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setFormErrors({});
  };

  const handleSuccess = () => {
    SuccessAlert2(
      "Demande envoyée !",
      "Votre demande de réservation a bien été transmise au propriétaire."
    ).then((result) => {
      if (result.isConfirmed) {
        navigate("/my-space");
      }
    });
  };

  // Gestion du téléchargement des fichiers
  const handleFileUpload = (file, setFile, fileType) => {
    if (file) {
      // Simuler la progression du téléchargement
      setUploadProgress((prev) => ({ ...prev, [fileType]: 0 }));

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev[fileType] + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setFile(file);
            return { ...prev, [fileType]: 100 };
          }
          return { ...prev, [fileType]: newProgress };
        });
      }, 200);
    }
  };

  // Soumission de la demande de réservation
  const handleSubmitBookingRequest = async () => {
    setIsLoading(true);

    try {
      const formatDate = (date) =>
        date ? date.toISOString().split("T")[0] : "";

      if (!isTenant()) {
        await EnsureUserHasTenantRole();
      }

      // Mettre à jour l'utilisateur
      await updateUser(user.id, {
        firstname: firstName,
        lastname: lastName,
        email,
        phone,
        birth_date: birthDate,
        address,
      });

      // Uploader les documents avec FormData
      const uploadDocument = async (file, type) => {
        const formData = new FormData();
        formData.append("user_id", user.id.toString());
        formData.append("type", type);
        formData.append("documents", file); // Important: le nom doit correspondre à ce qu'attend express-fileupload

        return createUserDocument(formData);
      };

      // Uploader chaque document séquentiellement pour éviter les conflits
      if (identityFile) await uploadDocument(identityFile, "id_card");
      if (licenseFile) await uploadDocument(licenseFile, "licence");
      if (addressFile) await uploadDocument(addressFile, "insurance");

      // Créer la réservation
      await createReservation({
        boat_id: boat.id,
        user_id: user.id,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        passengers,
        total_price: totalPrice,
      });

      // nextStep();
      setShowSuccess(true);
    } catch (error) {
      console.error("Erreur:", error);
      setFormErrors({ submit: "Erreur lors de la création de la demande" });
    } finally {
      setIsLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mocha"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !boat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error || "Bateau non trouvé"}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-mocha text-white rounded-md hover:bg-mocha/90"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  const basePrice = days * boat.daily_price;
  const totalPrice = basePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-blue mb-6 hover:text-slate-blue/90 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour au bateau
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Processus de réservation */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Étapes */}
              <div className="flex justify-between mb-8 relative">
                <div className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 1
                        ? "bg-slate-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <span className="text-sm font-medium">Dates</span>
                  {step > 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 2
                        ? "bg-slate-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <span className="text-sm font-medium">Détails</span>
                  {step > 2 && (
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 3
                        ? "bg-slate-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faFileUpload} />
                  </div>
                  <span className="text-sm font-medium">Documents</span>
                  {step > 3 && (
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 4
                        ? "bg-slate-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                  <span className="text-sm font-medium">Confirmation</span>
                </div>
              </div>

              {/* Formulaire d'étape 1: Sélection des dates */}
              {step === 1 && (
                <Step1Dates
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  formErrors={formErrors}
                  nextStep={nextStep}
                  boat={boat}
                  availabilities={availabilities}
                />
              )}

              {/* Formulaire d'étape 2: Informations personnelles */}
              {step === 2 && (
                <Step2PersonalInfo
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  birthDate={birthDate}
                  setBirthDate={setBirthDate}
                  address={address}
                  setAddress={setAddress}
                  formErrors={formErrors}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}

              {/* Formulaire d'étape 3: Documents */}
              {step === 3 && (
                <Step3Documents
                  identityFile={identityFile}
                  setIdentityFile={setIdentityFile}
                  licenseFile={licenseFile}
                  setLicenseFile={setLicenseFile}
                  addressFile={addressFile}
                  setAddressFile={setAddressFile}
                  uploadProgress={uploadProgress}
                  formErrors={formErrors}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  handleFileUpload={handleFileUpload}
                />
              )}

              {/* Étape 4: Confirmation de la demande */}
              {step === 4 && (
                <Step4Confirmation
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  phone={phone}
                  birthDate={birthDate}
                  address={address}
                  boat={boat}
                  startDate={startDate}
                  endDate={endDate}
                  days={days}
                  passengers={passengers}
                  identityFile={identityFile}
                  licenseFile={licenseFile}
                  addressFile={addressFile}
                  totalPrice={totalPrice}
                  prevStep={prevStep}
                  handleSubmit={handleSubmitBookingRequest}
                  isLoading={isLoading}
                  formErrors={formErrors}
                />
              )}
            </div>
          </div>

          {/* Récapitulatif de la réservation */}
          {step < 5 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">Votre réservation</h3>

                <div className="flex mb-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${getMainPhotoUrl(boat)}`}
                    alt={boat.name}
                    className="w-24 h-20 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">{boat.name}</h4>
                    <p className="text-sm text-gray-600">
                      {boat.brand} {boat.model}
                    </p>
                    <p className="text-sm text-gray-600">{boat.port?.name}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>
                      {boat.daily_price}€ x {days}{" "}
                      {days === 1 ? "jour" : "jours"}
                    </span>
                    <span>{basePrice}€</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>
                </div>

                {step === 4 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <div className="flex items-center text-slate-blue mb-2">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      {/* <span className="font-medium">En attente d'approbation</span> */}
                    </div>
                    <p className="text-sm text-slate-blue">
                      Votre demande sera examinée par le propriétaire. Vous
                      recevrez un email pour finaliser le paiement une fois
                      approuvée.
                    </p>
                  </div>
                )}

                <div className="text-sm text-gray-500 mt-4">
                  <p className="mb-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-mocha"
                    />{" "}
                    Annulation gratuite jusqu'à 7 jours avant la location
                  </p>
                  <p>
                    {" "}
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-mocha"
                    />{" "}
                    Assurance incluse
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Booking;
