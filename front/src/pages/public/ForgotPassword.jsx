import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordEmail } from "../../services/authService";
import { SuccessAlert } from "../../components/common/SweetAlertComponents";
import logo from "/images/logo.png";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Efface l'erreur quand l'utilisateur modifie l'input
  };

  const validateEmail = () => {
    if (!email) {
      setError("L'adresse email est requise");
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);

    try {
      await forgotPasswordEmail(email);
      setSuccess(true);
      SuccessAlert(
        "Email envoyé !",
        "Un lien de récupération a été envoyé à votre adresse email. Vérifiez également votre dossier spam."
      );
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'envoi de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessView = () => (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Header title="Email envoyé !" 
          subtitle="Nous avons envoyé un lien de récupération à votre adresse email" />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            className="w-full bg-[#AD7C59] text-white py-3 px-4 rounded-lg hover:bg-[#8B5A3C] transition-colors"
          >
            Envoyer un autre email
          </button>
          
          <BackLink to="/login" text="← Retour à la connexion" />
        </div>
      </div>
    </div>
  );

  const FormView = () => (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Header title="Mot de passe oublié" 
          subtitle="Entrez votre adresse email pour recevoir un lien de récupération" />
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-3 py-3 border ${
                error ? "border-red-300" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] transition-colors disabled:bg-gray-100`}
              placeholder="votre@email.com"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <SubmitButton 
            isLoading={isLoading}
            disabled={!email}
            loadingText="Envoi en cours..."
            defaultText="Envoyer le lien de récupération"
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              Un email contenant un lien de récupération vous sera envoyé. Vérifiez également votre dossier spam.
            </p>
          </div>
          
          <BackLink to="/login" text="← Retour à la connexion" />
        </form>
      </div>
    </div>
  );

  return success ? <SuccessView /> : <FormView />;
};

// Composants réutilisables (inchangés)
const Header = ({ title, subtitle }) => (
  <div className="text-center">
    <img src={logo} alt="SailingLoc" className="mx-auto h-16 mb-6" />
    <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600">{subtitle}</p>
  </div>
);

const SubmitButton = ({ isLoading, disabled, loadingText, defaultText }) => (
  <button
    type="submit"
    disabled={isLoading || disabled}
    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-colors duration-300 ${
      !isLoading && !disabled
        ? "text-white bg-[#AD7C59] hover:bg-[#8B5A3C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD7C59]"
        : "text-gray-400 bg-gray-300 cursor-not-allowed"
    }`}
  >
    {isLoading ? (
      <div className="flex items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {loadingText}
      </div>
    ) : (
      defaultText
    )}
  </button>
);

const BackLink = ({ to, text }) => (
  <div className="text-center">
    <Link
      to={to}
      className="text-[#AD7C59] hover:text-[#8B5A3C] transition-colors"
    >
      {text}
    </Link>
  </div>
);

export default ForgotPasswordEmail;