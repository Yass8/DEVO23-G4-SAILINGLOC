import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faMapMarkerAlt, faShip } from '@fortawesome/free-solid-svg-icons';

const PortTable = ({ ports, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#87CEEB] bg-opacity-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Port
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Localisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Coordonnées
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Bateaux
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#4B6A88] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#87CEEB] divide-opacity-20">
            {ports.map((port) => (
              <tr key={port.id} className="hover:bg-[#87CEEB] hover:bg-opacity-5">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#87CEEB] rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#4B6A88] text-lg" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-[#4B6A88]">
                        {port.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-[#4B6A88]">
                      {port.city}
                    </div>
                    <div className="text-sm text-gray-500">
                      {port.country}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {port.latitude && port.longitude ? (
                      <>
                        <div>Lat: {parseFloat(port.latitude).toFixed(6)}</div>
                        <div>Lng: {parseFloat(port.longitude).toFixed(6)}</div>
                      </>
                    ) : (
                      <span className="text-gray-400">Non renseignées</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#AD7C59] rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faShip} className="text-white text-sm" />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {port.Boats ? port.Boats.length : 0} bateau(x)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(port)}
                      className="p-2 text-[#4B6A88] hover:bg-[#4B6A88] hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => onEdit(port)}
                      className="p-2 text-[#AD7C59] hover:bg-[#AD7C59] hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(port.id)}
                      className="p-2 text-[#4B6A88] hover:bg-[#4B6A88] hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortTable; 