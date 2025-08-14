import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Remplacer par votre endpoint backend
      const response = await fetch('VOTRE_ENDPOINT_BACKEND/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || data.error || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo et titre */}
          <div className="text-center">
            <img 
              src={logo} 
              alt="SailingLoc" 
              className="mx-auto h-16 mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Email envoyé !
            </h2>
            <p className="text-gray-600">
              Nous avons envoyé un lien de récupération à votre adresse email
            </p>
          </div>

          {/* Message de succès */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-[#AD7C59] text-white py-3 px-4 rounded-lg hover:bg-[#8B5A3C] transition-colors"
            >
              Envoyer un autre email
            </button>
            
            <div className="text-center">
              <Link
                to="/login"
                className="text-[#AD7C59] hover:text-[#8B5A3C] transition-colors"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <img 
            src={logo} 
            alt="SailingLoc" 
            className="mx-auto h-16 mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Mot de passe oublié
          </h2>
          <p className="text-gray-600">
            Entrez votre adresse email pour recevoir un lien de récupération
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
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
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] focus:border-[#AD7C59] transition-colors disabled:bg-gray-100"
              placeholder="votre@email.com"
            />
          </div>

          {/* Bouton d'envoi */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-colors duration-300 ${
                !isLoading && email
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
                  Envoi en cours...
                </div>
              ) : (
                "Envoyer le lien de récupération"
              )}
            </button>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Un email contenant un lien de récupération vous sera envoyé. Vérifiez également votre dossier spam.
                </p>
              </div>
            </div>
          </div>

          {/* Lien de retour */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-[#AD7C59] hover:text-[#8B5A3C] transition-colors"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 