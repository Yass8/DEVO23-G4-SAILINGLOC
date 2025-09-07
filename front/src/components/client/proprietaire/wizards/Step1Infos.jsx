import { useState } from 'react';
import Select from 'react-select';

// Formater les options pour react-select
const formatOptions = (items) => 
  items.map(item => ({ value: item.id, label: item.name }));

export default function Step1Infos({ data, setData, errors, boatTypes, ports }) {

  const [focusedFields, setFocusedFields] = useState({});

  const BOAT_TYPES = boatTypes;
  const PORTS = ports;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setData({
      ...data,
      [name]: selectedOption ? selectedOption.value : ""
    });
  };

  const handleFocus = (field) => setFocusedFields({ ...focusedFields, [field]: true });
  const handleBlur = (field) => setFocusedFields({ ...focusedFields, [field]: false });

  const shouldFloat = (field) => focusedFields[field] || data[field];

  // Trouver l'option sélectionnée pour chaque select
  const selectedType = data.type_id ? { value: parseInt(data.type_id), label: BOAT_TYPES.find(type => type.id === parseInt(data.type_id))?.name } : null;
  const selectedPort = data.port_id ? { value: parseInt(data.port_id), label: PORTS.find(port => port.id === parseInt(data.port_id))?.name } : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Informations générales</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Numéro d'immatriculation */}
        <div className="relative">
          <label
            htmlFor="registration_number"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('registration_number') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.registration_number ? 'text-red-500' : ''}`}
          >
            Numéro d'immatriculation*
          </label>
          <input
            id="registration_number"
            name="registration_number"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.registration_number 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.registration_number}
            onChange={handleChange}
            onFocus={() => handleFocus('registration_number')}
            onBlur={() => handleBlur('registration_number')}
          />
          {errors.registration_number && <p className="mt-1 text-sm text-red-500">{errors.registration_number}</p>}
        </div>

        {/* Nom */}
        <div className="relative">
          <label
            htmlFor="name"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('name') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.name ? 'text-red-500' : ''}`}
          >
            Nom*
          </label>
          <input
            id="name"
            name="name"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={() => handleBlur('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Type de bateau avec react-select */}
        <div className="relative">
          <label
            className={`absolute left-1 -top-2 text-xs bg-white px-1 text-mocha pointer-events-none ${
              errors.type_id ? 'text-red-500' : ''
            }`}
          >
            Type de bateau*
          </label>
          <Select
            options={formatOptions(BOAT_TYPES)}
            value={selectedType}
            onChange={(selected) => handleSelectChange('type_id', selected)}
            placeholder="Sélectionnez un type de bateau"
            className={`react-select-container ${
              errors.type_id ? 'react-select-error' : ''
            }`}
            classNamePrefix="react-select"
            onFocus={() => handleFocus('type_id')}
            onBlur={() => handleBlur('type_id')}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: errors.type_id 
                  ? '#ef4444' 
                  : state.isFocused ? '#8B7355' : '#d1d5db',
                boxShadow: state.isFocused && !errors.type_id 
                  ? '0 0 0 1px #8B7355' 
                  : 'none',
                minHeight: '48px',
                '&:hover': {
                  borderColor: errors.type_id ? '#ef4444' : '#8B7355'
                }
              }),
              placeholder: (base) => ({
                ...base,
                color: '#9ca3af'
              })
            }}
          />
          {errors.type_id && <p className="mt-1 text-sm text-red-500">{errors.type_id}</p>}
        </div>

        {/* Port d'attache avec react-select */}
        <div className="relative">
          <label
            className="absolute left-1 -top-2 text-xs bg-white px-1 text-mocha pointer-events-none"
          >
            Port d'attache
          </label>
          <Select
            options={formatOptions(PORTS)}
            value={selectedPort}
            onChange={(selected) => handleSelectChange('port_id', selected)}
            placeholder="Sélectionnez un port d'attache"
            className="react-select-container"
            classNamePrefix="react-select"
            onFocus={() => handleFocus('port_id')}
            onBlur={() => handleBlur('port_id')}
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? '#8B7355' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 1px #8B7355' : 'none',
                minHeight: '48px',
                '&:hover': {
                  borderColor: '#8B7355'
                }
              }),
              placeholder: (base) => ({
                ...base,
                color: '#9ca3af'
              })
            }}
          />
        </div>

        {/* Marque */}
        <div className="relative">
          <label
            htmlFor="brand"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('brand') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Marque
          </label>
          <input
            id="brand"
            name="brand"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.brand}
            onChange={handleChange}
            onFocus={() => handleFocus('brand')}
            onBlur={() => handleBlur('brand')}
          />
        </div>

        {/* Modèle */}
        <div className="relative">
          <label
            htmlFor="model"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('model') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Modèle
          </label>
          <input
            id="model"
            name="model"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.model}
            onChange={handleChange}
            onFocus={() => handleFocus('model')}
            onBlur={() => handleBlur('model')}
          />
        </div>

        {/* Type de moteur */}
        <div className="relative">
          <label
            htmlFor="engine_type"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('engine_type') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Type de moteur
          </label>
          <input
            id="engine_type"
            name="engine_type"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.engine_type}
            onChange={handleChange}
            onFocus={() => handleFocus('engine_type')}
            onBlur={() => handleBlur('engine_type')}
          />
        </div>

        {/* Prix/jour */}
        <div className="relative">
          <label
            htmlFor="daily_price"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('daily_price') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.daily_price ? 'text-red-500' : ''}`}
          >
            Prix/jour (€)*
          </label>
          <input
            id="daily_price"
            name="daily_price"
            type="number"
            step="0.01"
            min="0"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.daily_price 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.daily_price}
            onChange={handleChange}
            onFocus={() => handleFocus('daily_price')}
            onBlur={() => handleBlur('daily_price')}
          />
          {errors.daily_price && <p className="mt-1 text-sm text-red-500">{errors.daily_price}</p>}
        </div>

        {/* Passagers max */}
        <div className="relative">
          <label
            htmlFor="max_passengers"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('max_passengers') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.max_passengers ? 'text-red-500' : ''}`}
          >
            Passagers max*
          </label>
          <input
            id="max_passengers"
            name="max_passengers"
            type="number"
            min="1"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.max_passengers 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.max_passengers}
            onChange={handleChange}
            onFocus={() => handleFocus('max_passengers')}
            onBlur={() => handleBlur('max_passengers')}
          />
          {errors.max_passengers && <p className="mt-1 text-sm text-red-500">{errors.max_passengers}</p>}
        </div>

        {/* Longueur */}
        <div className="relative">
          <label
            htmlFor="length"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('length') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Longueur (m)
          </label>
          <input
            id="length"
            name="length"
            type="number"
            step="0.01"
            min="0"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.length}
            onChange={handleChange}
            onFocus={() => handleFocus('length')}
            onBlur={() => handleBlur('length')}
          />
        </div>

        {/* Tirant d'eau */}
        <div className="relative">
          <label
            htmlFor="water_draft"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('water_draft') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Tirant d'eau (m)
          </label>
          <input
            id="water_draft"
            name="water_draft"
            type="number"
            step="0.01"
            min="0"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.water_draft}
            onChange={handleChange}
            onFocus={() => handleFocus('water_draft')}
            onBlur={() => handleBlur('water_draft')}
          />
        </div>
      </div>

      {/* Description */}
      <div className="relative">
        <label
          htmlFor="description"
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            shouldFloat('description') 
              ? '-top-2 text-xs bg-white px-1 text-mocha'
              : 'top-3 text-gray-500'
          } ${errors.description ? 'text-red-500' : ''}`}
        >
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
            errors.description 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-mocha'
          }`}
          rows={3}
          value={data.description}
          onChange={handleChange}
          onFocus={() => handleFocus('description')}
          onBlur={() => handleBlur('description')}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* Skipper requis */}
      <label className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          name="skipper_required"
          checked={data.skipper_required}
          onChange={handleChange}
          className="rounded text-mocha focus:ring-mocha"
        />
        <span>Skipper requis</span>
      </label>
    </div>
  );
}