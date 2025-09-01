import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { register } from "../../services/authService";

const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex">
      <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <p className="ml-3 text-sm text-red-700">{message}</p>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    user_type: "",
    accept_terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const isFormValid = () => {
    const { firstname, lastname, email, password, confirm_password, accept_terms, user_type } = formData;
    return (
      firstname && 
      lastname && 
      email && 
      password && 
      password.length >= 6 &&
      confirm_password && 
      password === confirm_password && 
      accept_terms &&
      user_type
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isFormValid()) return;
  
  setIsLoading(true);
  setError("");

  const apiData = {
    firstname: formData.firstname,
    lastname: formData.lastname,
    email: formData.email,
    password: formData.password,
    phone: formData.phone || undefined,
    isOwner: formData.user_type === 'proprietaire',
    roles: formData.user_type === 'proprietaire' ? ['owner'] : ['renter']
  };

  try {
    await register(apiData);
    
    navigate("/home");
    
  } catch (err) {
    console.error("Registration error:", err);
    
    // Récupération précise du message d'erreur
    let errorMessage = "Une erreur est survenue lors de l'inscription";
    
    if (err.response) {
      // Erreur avec réponse du serveur
      const serverError = err.response.data;
      
      if (serverError.message) {
        // Message d'erreur direct
        errorMessage = serverError.message;
      } else if (serverError.errors && serverError.errors.length > 0) {
        // Erreurs de validation (array)
        errorMessage = serverError.errors.map(e => e.msg).join(', ');
      } else if (serverError.error) {
        // Autre format d'erreur
        errorMessage = serverError.error;
      } else {
        // Message par défaut avec code status
        errorMessage = `Erreur ${err.response.status}`;
      }
    } else if (err.request) {
      // Pas de réponse du serveur
      errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
    } else {
      // Erreur de configuration
      errorMessage = err.message || "Erreur lors de la configuration de la requête";
    }
    
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src={logo} alt="SailingLoc" className="mx-auto h-16 mb-6" />
          <h2 className="text-3xl font-bold">Créer un compte</h2>
          <p className="text-gray-600">Rejoignez la communauté SailingLoc</p>
        </div>

        <FormError message={error} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Type d'utilisateur */}
          <div>
            <p className="block text-sm font-medium mb-2">Je suis un...</p>
            <div className="flex">
              {["locataire", "proprietaire"].map((type) => (
                <label key={type} className="flex items-center space-x-2 mr-4">
                  <input
                    type="radio"
                    name="user_type"
                    value={type}
                    checked={formData.user_type === type}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <span>{type === 'proprietaire' ? 'Propriétaire' : 'Locataire'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Infos perso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                id="lastName"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              pattern="[0-9]{10}"
              
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Au moins 6 caractères"
                required
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors pr-12 disabled:bg-gray-100 ${
                  error ? "border-red-300 focus:border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#AD7C59] transition-colors disabled:opacity-50"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Confirmez votre mot de passe"
                required
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors pr-12 disabled:bg-gray-100 ${
                  formData.confirm_password && formData.password !== formData.confirm_password 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#AD7C59] transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.confirm_password && formData.password !== formData.confirm_password && (
              <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <div className="flex items-start">
            <input
              id="acceptTerms"
              name="accept_terms"
              type="checkbox"
              checked={formData.accept_terms}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="mt-1"
            />
            <label htmlFor="acceptTerms" className="ml-2 text-sm">
              J'accepte les <Link to="/terms" className="text-[#AD7C59] hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-[#AD7C59] hover:underline">politique de confidentialité</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              isFormValid() && !isLoading 
                ? "bg-[#AD7C59] hover:bg-[#9a6b4a]" 
                : "bg-gray-300 cursor-not-allowed"
            } transition-colors`}
          >
            {isLoading ? "Inscription en cours..." : "Créer mon compte"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-[#AD7C59] hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;