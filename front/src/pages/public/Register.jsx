import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "/images/logo.png";
import { register } from "../../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex">
      <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5 text-red-400 flex-shrink-0" />
      <p className="ml-3 text-sm text-red-700">{message}</p>
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    user_type: "",
    accept_terms: false,
    birth_date: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const isFormValid = () => {
    const { firstname, lastname, email, password, confirm_password, accept_terms, user_type, birth_date, address } = formData;
    const base = firstname && lastname && email && password && password.length >= 6 &&
                 confirm_password && password === confirm_password && accept_terms && user_type && captchaToken;
    if (user_type === "proprietaire") return base && birth_date && address;
    return base;
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
      isOwner: formData.user_type === "proprietaire",
      roles: formData.user_type === "proprietaire" ? ["owner"] : ["tenant"],
      birth_date: formData.birth_date,
      address: formData.address,
      "g-recaptcha-response": captchaToken,
    };

    try {
      await register(apiData);
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Inscription réussie, un e-mail de validation vous a été envoyé à : " + apiData.email,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      if (err.response) {
        const { status, data } = err.response;
        if (status === 422) {
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.map((e) => e.title || e.detail || e.message || `${e.propertyPath} : ${e.title}`).join(", ");
          } else if (typeof data.errors === "object") {
            errorMessage = Object.values(data.errors).flat().join(", ");
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `Erreur ${status}`;
        }
      } else if (err.request) {
        errorMessage = "Pas de réponse du serveur - vérifiez votre connexion";
      } else {
        errorMessage = err.message || "Erreur lors de la configuration de la requête";
      }
      setError(errorMessage);
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <a href="/"><img src={logo} alt="SailingLoc" className="mx-auto h-16 mb-6" /></a>
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
                  <span>{type === "proprietaire" ? "Propriétaire" : "Locataire"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Infos perso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                id="firstName"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Votre prénom"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                id="lastName"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Votre nom"
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Votre adresse email"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
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
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
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
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {formData.confirm_password && formData.password !== formData.confirm_password && (
              <p className="text-red-500 text-sm mt-1">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          {/* Champs propriétaire */}
          {formData.user_type === "proprietaire" && (
            <>
              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                <input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Adresse postale</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Numéro, rue, ville"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
                />
              </div>
            </>
          )}

          {/* CGU */}
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
              J'accepte les{" "}
              <Link to="/terms" className="text-[#AD7C59] hover:underline">conditions d'utilisation</Link>{" "}
              et la{" "}
              <Link to="/privacy" className="text-[#AD7C59] hover:underline">politique de confidentialité</Link>.
            </label>
          </div>

          {/* reCAPTCHA v2 case à cocher */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              theme="light"
            />
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