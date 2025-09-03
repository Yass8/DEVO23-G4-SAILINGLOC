import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import ScrollToTop from "../../components/common/ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCalendarAlt,
  faUser,
  faCreditCard,
  faArrowLeft,
  faInfoCircle,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";


// Import des composants Stripe
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { fetchBoatBySlug } from "../../services/boatServices";


import { Step1Dates } from "../../components/common/booking/Step1Dates";
import { Step2PersonalInfo } from "../../components/common/booking/Step2PersonalInfo";
import { Step3Documents } from "../../components/common/booking/Step3Documents";
import { Step4Summary } from "../../components/common/booking/Step4Summary";
import { Step5Payment } from "../../components/common/booking/Step5Payment";

// Initialisation de Stripe avec la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV);


const Booking = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  const [boat, setBoat] = useState(location.state?.boat || null);
  const [availabilities, setAvailabilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le formulaire de réservation
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [passengers, setPassengers] = useState(2);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // États pour les documents
  const [identityFile, setIdentityFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  // Charger les données du bateau
  useEffect(() => {
    const loadBoatData = async () => {
      try {
        setLoading(true);
        
        if (!boat && slug) {
          const boatData = await fetchBoatBySlug(`/${slug}`);
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
        const isPeriodAvailable = availabilities.some(availability => {
          const availStart = new Date(availability.start_date);
          const availEnd = new Date(availability.end_date);
          return startDate >= availStart && endDate <= availEnd && availability.status === 'available';
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
    }

    if (step === 3) {
      if (!identityFile)
        errors.identityFile = "La pièce d'identité est requise";
      if (!licenseFile) errors.licenseFile = "Le permis nautique est requis";
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
    setPaymentError(null);
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
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      // Stripe.js n'est pas encore chargé
      setProcessing(false);
      return;
    }

    try {
      // Créer un PaymentMethod avec les détails de la carte
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
          },
        });

      if (stripeError) {
        setPaymentError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Envoyer les données de réservation à l'API
      setIsLoading(true);

      // Formater les dates pour l'envoi à l'API
      const formatDate = (date) => {
        return date ? date.toISOString().split("T")[0] : "";
      };

      const bookingData = {
        boat_id: boat.id,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        passengers,
        total_price: totalPrice,
        payment_method_id: paymentMethod.id,
        customer: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
        },
        documents: {
          identity: identityFile?.name,
          license: licenseFile?.name,
          address_proof: addressFile?.name,
        },
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        // Confirmer le paiement avec Stripe
        const { error: confirmError } = await stripe.confirmCardPayment(
          data.client_secret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmError) {
          setPaymentError(confirmError.message);
          setProcessing(false);
        } else {
          // Paiement réussi
          nextStep();
        }
      } else {
        setPaymentError(
          data.message || "Erreur lors de la création de la réservation"
        );
      }
    } catch (error) {
      console.error("Erreur de réservation:", error);
      setPaymentError(
        "Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer."
      );
    } finally {
      setProcessing(false);
      setIsLoading(false);
    }
  };

  // Vérifier si Stripe est correctement configuré
  useEffect(() => {
    if (!import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV) {
      console.warn(
        "Clé Stripe publique non configurée. Utilisation du mode démo."
      );
    }
  }, []);

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Banner title="Réservation" />
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
        <Banner title="Réservation" />
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
                  <span className="text-sm font-medium">Récapitulatif</span>
                  {step > 4 && (
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= 5
                        ? "bg-slate-blue text-white"
                        : "bg-gray-200 text-gray-500"
                    } transition-colors`}
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                  </div>
                  <span className="text-sm font-medium">Paiement</span>
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

              {/* Étape 4: Récapitulatif */}
              {step === 4 && (
                <Step4Summary
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  phone={phone}
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
                  nextStep={nextStep}
                />
              )}

              {/* Formulaire d'étape 5: Paiement avec Stripe */}
              {step === 5 && (
                <Step5Payment
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  phone={phone}
                  totalPrice={totalPrice}
                  paymentError={paymentError}
                  processing={processing}
                  isLoading={isLoading}
                  cardComplete={cardComplete}
                  setCardComplete={setCardComplete}
                  formErrors={formErrors}
                  prevStep={prevStep}
                  handleSubmit={handleSubmit}
                  stripe={stripe}
                  elements={elements}
                />
              )}

              {/* Étape 6: Confirmation */}
              {step === 6 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-600 text-3xl"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Réservation confirmée !
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Votre réservation pour le{" "}
                    <span className="font-semibold">{boat.name}</span> a été
                    confirmée. Un email de confirmation a été envoyé à {" "}
                    <span className="font-semibold">{email}</span>.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">
                      Récapitulatif de votre réservation
                    </h3>
                    <p className="text-sm">
                      <span className="font-medium">Bateau:</span> {boat.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Dates:</span>{" "}
                      {startDate?.toLocaleDateString()} au{" "}
                      {endDate?.toLocaleDateString()} ({days} jours)
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Passagers:</span>{" "}
                      {passengers}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Total:</span> {totalPrice}€
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Récapitulatif de la réservation */}
          {step < 6 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">Votre réservation</h3>

                <div className="flex mb-4">
                  <img
                    src={
                      boat.photos?.[0]?.photo_url ||
                      "https://images.unsplash.com/photo-1500514966906-fe367bfb0d0b"
                    }
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

                <div className="text-sm text-gray-500">
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

// Wrapper pour fournir le contexte Stripe
const BookingWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Booking />
    </Elements>
  );
};

export default BookingWrapper;
