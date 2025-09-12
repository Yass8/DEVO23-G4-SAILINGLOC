import React from 'react';

const PortHeader = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4B6A88]">
            Gestion des Ports
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les ports de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#87CEEB] rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Système actif</span>
        </div>
      </div>
    </div>
  );
};

export default PortHeader; 