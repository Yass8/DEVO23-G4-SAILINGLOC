import React from 'react';

const EquipementsBateau = ({ formData, onEquipmentChange, equipmentOptions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {equipmentOptions.map(equipment => (
          <label key={equipment} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.equipment.includes(equipment)}
              onChange={() => onEquipmentChange(equipment)}
              className="h-4 w-4 text-[#AD7C59] focus:ring-[#AD7C59] border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{equipment}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default EquipementsBateau; 