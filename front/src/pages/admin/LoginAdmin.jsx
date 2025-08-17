// Login.jsx
import React, { useState } from 'react';
import { login } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faShip, faSpinner, faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import logo from "/images/logo.png";

const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await login(formData);
      
      // Vérification du rôle admin avec le nouveau format
      if (response.user && response.token) {
        const roles = response.user.roles || [];
        const userRoles = Array.isArray(roles) ? roles : [roles];
        
        if (userRoles.includes('admin')) {
          localStorage.setItem('token', response.token);
          localStorage.setItem("user", JSON.stringify(response.user || response));
          window.location.href = '/admin/sl/dashboard';
        } else {
          setApiError("Accès refusé. Vous n'avez pas les permissions nécessaires.");
          localStorage.removeItem('adminToken');
        }
      } else {
        setApiError("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const formattedErrors = {};
        validationErrors.forEach(err => {
          formattedErrors[err.param] = err.msg;
        });
        setErrors(formattedErrors);
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setApiError("Email ou mot de passe incorrect");
      } else if (error.response?.status === 403) {
        setApiError("Accès interdit. Vous n'avez pas les permissions nécessaires.");
      } else if (error.response?.status === 429) {
        setApiError("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
      } else {
        setApiError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <img src={logo} alt="SailingLoc logo" className="mx-auto h-16 mb-6" />
          <h1 className="text-3xl font-bold">
            Admin Port de Plaisance
          </h1>
          <p className="mt-2 text-slate-blue">
            Connectez-vous à votre espace administrateur
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-start">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mt-0.5 mr-3" />
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-blue">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-mocha" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border transition-colors ${
                  errors.email 
                    ? 'border-red-400 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300  focus:outline-none focus:ring-2 focus:ring-mocha'
                }`}
                placeholder="admin@votre-site.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-slate-blue">
                <FontAwesomeIcon icon={faLock} className="mr-2 text-mocha" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-md border transition-colors ${
                    errors.password 
                      ? 'border-red-400 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300  focus:outline-none focus:ring-2 focus:ring-mocha'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-blue hover:text-mocha transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-mocha text-white rounded-md font-medium hover:bg-mocha/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  Se connecter
                </>
              )}
            </button>

            <div className="text-center">
              <a href="/admin/forgot-password" className="text-sm text-slate-blue hover:text-mocha transition-colors">
                Mot de passe oublié ?
              </a>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-blue">
            <FontAwesomeIcon icon={faShip} className="mr-2" />
            Port de Plaisance - Location de bateaux
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;