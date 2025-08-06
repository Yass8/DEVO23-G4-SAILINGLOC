import React from "react";
import { Link } from "react-router-dom";
import logo from "/images/logo.png";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
            Page de récupération - En cours de développement
          </p>
          <div className="mt-6">
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
};

export default ForgotPassword; 