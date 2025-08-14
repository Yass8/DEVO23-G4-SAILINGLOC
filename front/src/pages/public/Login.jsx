import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/images/logo.png";
import { login } from "../../services/authService";
import FormError from "../../components/common/FormError";
import PasswordInput from "../../components/common/PasswordInput";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login({
        email: formData.email,
        password: formData.password
      });

      // Gestion du token et de l'utilisateur
      if (data?.token || data?.accessToken) {
        localStorage.setItem("token", data.token || data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user || data));
        
        // Stockage du "remember me" si nécessaire
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("token", data.token || data.accessToken);
        }

        navigate("/home");
      } else {
        setError(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Gestion détaillée des erreurs
      if (err.response) {
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(`Erreur ${err.response.status}`);
        }
      } else if (err.request) {
        setError("Pas de réponse du serveur");
      } else {
        setError(err.message || "Erreur de configuration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src={logo} alt="SailingLoc" className="mx-auto h-16 mb-6" />
          <h2 className="text-3xl font-bold">Connexion</h2>
          <p className="text-gray-600">Connectez-vous à votre compte SailingLoc</p>
        </div>

        <FormError message={error} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AD7C59] transition-colors disabled:bg-gray-100"
                placeholder="votre@email.com"
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Votre mot de passe"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 text-[#AD7C59] focus:ring-[#AD7C59] border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-[#AD7C59] hover:text-[#8B5A3C] transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              !isLoading && formData.email && formData.password
                ? "bg-[#AD7C59] hover:bg-[#9a6b4a]"
                : "bg-gray-300 cursor-not-allowed"
            } transition-colors`}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-[#AD7C59] hover:underline">
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;