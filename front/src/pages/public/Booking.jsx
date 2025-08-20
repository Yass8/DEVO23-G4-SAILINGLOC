
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  faLock,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

// Import des composants Stripe
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialisation de Stripe avec la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV || "pk_test_51MockKey1234567890abcdefghijklmnopqrstuvwxyz012345");

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  
  // Récupération des données du bateau depuis l'état de navigation ou props
  const boat = location.state?.boat || {
    id: 1,
    name: "Sunset Dream",
    brand: "Jeanneau",
    model: "Sun Odyssey 449",
    length: 13.5,
    engine_type: "Diesel",
    skipper_required: true,
    description: "Magnifique voilier idéal pour une croisière en Méditerranée. Parfait pour 10 personnes avec tout le confort nécessaire à bord.",
    max_passengers: 10,
    daily_price: 450,
    port: { name: "Port de Marseille" },
    boat_type: { name: "Voilier" },
    photos: [
      { photo_url: "https://images.unsplash.com/photo-1500514966906-fe367bfb0d0b", is_main: true },
    ],
  };

  // États pour le formulaire de réservation
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [skipper, setSkipper] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1); // 1: Dates, 2: Détails, 3: Paiement, 4: Confirmation
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation du formulaire
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!startDate) errors.startDate = "La date de début est requise";
      if (!endDate) errors.endDate = "La date de fin est requise";
      if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
        errors.dateRange = "La date de fin doit être postérieure à la date de début";
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
    
    return errors;
  };

  // Calcul du nombre de jours et du prix total
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const days = calculateDays();
  const basePrice = days * boat.daily_price;
  const skipperPrice = skipper ? 150 * days : 0;
  const totalPrice = basePrice + skipperPrice;

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

  // Style personnalisé pour l'élément de carte Stripe
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
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
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
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
      
      const bookingData = {
        boat_id: boat.id,
        start_date: startDate,
        end_date: endDate,
        passengers,
        skipper_required: skipper,
        total_price: totalPrice,
        payment_method_id: paymentMethod.id,
        customer: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        // Confirmer le paiement avec Stripe
        const { error: confirmError } = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: paymentMethod.id,
        });

        if (confirmError) {
          setPaymentError(confirmError.message);
          setProcessing(false);
        } else {
          // Paiement réussi
          nextStep();
        }
      } else {
        setPaymentError(data.message || "Erreur lors de la création de la réservation");
      }
    } catch (error) {
      console.error("Erreur de réservation:", error);
      setPaymentError("Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.");
    } finally {
      setProcessing(false);
      setIsLoading(false);
    }
  };

  // Vérifier si Stripe est correctement configuré
  useEffect(() => {
    if (!import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV) {
      console.warn("Clé Stripe publique non configurée. Utilisation du mode démo.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner title="Réservation" />
      
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-slate-blue text-white' : 'bg-gray-200 text-gray-500'} transition-colors`}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <span className="text-sm font-medium">Dates</span>
                  {step > 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-slate-blue text-white' : 'bg-gray-200 text-gray-500'} transition-colors`}>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <span className="text-sm font-medium">Détails</span>
                  {step > 2 && (
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-mocha -z-10"></div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-slate-blue text-white' : 'bg-gray-200 text-gray-500'} transition-colors`}>
                    <FontAwesomeIcon icon={faCreditCard} />
                  </div>
                  <span className="text-sm font-medium">Paiement</span>
                </div>
              </div>

              {/* Avertissement si Stripe n'est pas configuré */}
              {!import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV && step >= 3 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Mode démonstration</p>
                    <p className="text-sm text-yellow-700">Le paiement n'est pas réellement traité car les clés Stripe ne sont pas configurées.</p>
                  </div>
                </div>
              )}

              {/* Formulaire d'étape 1: Sélection des dates */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Choisissez vos dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      {formErrors.startDate && <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        min={startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                      {formErrors.endDate && <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>}
                    </div>
                  </div>
                  
                  {formErrors.dateRange && <p className="text-red-500 text-xs mb-4">{formErrors.dateRange}</p>}
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de passagers</label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                    >
                      {[...Array(boat.max_passengers)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1} {i+1 === 1 ? 'personne' : 'personnes'}</option>
                      ))}
                    </select>
                  </div>
            
                  
                  <div className="flex justify-end">
                    <button
                      onClick={nextStep}
                      disabled={!startDate || !endDate}
                      className={`px-6 py-3 rounded-md transition-colors ${!startDate || !endDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium`}
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire d'étape 2: Informations personnelles */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Vos informations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        required
                      />
                      {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        required
                      />
                      {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        required
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
                        required
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!firstName || !lastName || !email || !phone}
                      className={`px-6 py-3 rounded-md transition-colors ${!firstName || !lastName || !email || !phone ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium`}
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire d'étape 3: Paiement avec Stripe */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                    <FontAwesomeIcon icon={faLock} className="text-blue-500 mr-2 mt-1" />
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">Paiement sécurisé</span> - Toutes vos informations sont cryptées et sécurisées.
                    </p>
                  </div>
                  
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Informations de carte bancaire</label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white">
                      <CardElement 
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={(e) => setCardComplete(e.complete)}
                      />
                    </div>
                    <div className="flex mt-2">
                      <img src="https://logos-world.net/wp-content/uploads/2020/09/Visa-Logo.png" alt="Visa" className="h-8 mr-2" />
                      <img src="https://logos-world.net/wp-content/uploads/2020/04/Mastercard-Logo.png" alt="Mastercard" className="h-8 mr-2" />
                      <img src="https://logos-world.net/wp-content/uploads/2020/09/American-Express-Logo.png" alt="American Express" className="h-8" />
                    </div>
                  </div>
                  
                  {paymentError && (
                    <div className="bg-red-50 p-4 rounded-lg mb-6">
                      <p className="text-red-700 text-sm">{paymentError}</p>
                    </div>
                  )}
                  
                  <div className="flex items-start mb-6">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-mocha mr-2 mt-1" />
                    <p className="text-sm text-gray-600">
                      Votre carte ne sera débitée qu'après confirmation de la réservation par le propriétaire.
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!stripe || !cardComplete || processing}
                      className={`px-6 py-3 rounded-md flex items-center justify-center transition-colors ${!stripe || !cardComplete || processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha hover:bg-mocha/90'} text-white font-medium min-w-[200px]`}
                    >
                      {(processing || isLoading) ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        `Payer ${totalPrice}€`
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Étape 4: Confirmation */}
              {step === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-3xl" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
                  <p className="text-gray-600 mb-6">
                    Votre réservation pour le <span className="font-semibold">{boat.name}</span> a été confirmée. 
                    Un email de confirmation a été envoyé à <span className="font-semibold">{email}</span>.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Récapitulatif de votre réservation</h3>
                    <p className="text-sm"><span className="font-medium">Bateau:</span> {boat.name}</p>
                    <p className="text-sm"><span className="font-medium">Dates:</span> {new Date(startDate).toLocaleDateString()} au {new Date(endDate).toLocaleDateString()} ({days} jours)</p>
                    <p className="text-sm"><span className="font-medium">Passagers:</span> {passengers}</p>
                    {skipper && <p className="text-sm"><span className="font-medium">Skipper:</span> Inclus</p>}
                    <p className="text-sm mt-2"><span className="font-medium">Total:</span> {totalPrice}€</p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-md bg-mocha hover:bg-mocha/90 text-white font-medium transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Récapitulatif de la réservation */}
          {step < 4 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">Votre réservation</h3>
                
                <div className="flex mb-4">
                  <img 
                    src={boat.photos[0]?.photo_url || "https://images.unsplash.com/photo-1500514966906-fe367bfb0d0b"} 
                    alt={boat.name} 
                    className="w-24 h-20 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold">{boat.name}</h4>
                    <p className="text-sm text-gray-600">{boat.brand} {boat.model}</p>
                    <p className="text-sm text-gray-600">{boat.port?.name}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>{boat.daily_price}€ x {days} {days === 1 ? 'jour' : 'jours'}</span>
                    <span>{basePrice}€</span>
                  </div>
                  
                  {skipper && (
                    <div className="flex justify-between mb-2">
                      <span>Skipper (150€ x {days} jours)</span>
                      <span>{skipperPrice}€</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p className="mb-2"><FontAwesomeIcon icon={faCheckCircle} className="text-mocha" /> Annulation gratuite jusqu'à 7 jours avant la location</p>
                  <p> <FontAwesomeIcon icon={faCheckCircle} className="text-mocha" /> Assurance incluse</p>
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