import { useState } from 'react';

export default function Step1Infos({ data, setData, errors }) {
  const [focusedFields, setFocusedFields] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFocus = (field) => setFocusedFields({ ...focusedFields, [field]: true });
  const handleBlur = (field) => setFocusedFields({ ...focusedFields, [field]: false });

  const shouldFloat = (field) => focusedFields[field] || data[field];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Informations générales</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
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

        {/* Type */}
        <div className="relative">
          <label
            htmlFor="type"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('type') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            } ${errors.type ? 'text-red-500' : ''}`}
          >
            Type*
          </label>
          <input
            id="type"
            name="type"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.type 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.type}
            onChange={handleChange}
            onFocus={() => handleFocus('type')}
            onBlur={() => handleBlur('type')}
          />
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
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
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.length}
            onChange={handleChange}
            onFocus={() => handleFocus('length')}
            onBlur={() => handleBlur('length')}
          />
        </div>

        {/* Largeur */}
        <div className="relative">
          <label
            htmlFor="width"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('width') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Largeur (m)
          </label>
          <input
            id="width"
            name="width"
            type="number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.width}
            onChange={handleChange}
            onFocus={() => handleFocus('width')}
            onBlur={() => handleBlur('width')}
          />
        </div>

        {/* Tirant d'eau */}
        <div className="relative">
          <label
            htmlFor="draft"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('draft') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Tirant d'eau (m)
          </label>
          <input
            id="draft"
            name="draft"
            type="number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.draft}
            onChange={handleChange}
            onFocus={() => handleFocus('draft')}
            onBlur={() => handleBlur('draft')}
          />
        </div>

        {/* Année */}
        <div className="relative">
          <label
            htmlFor="year"
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              shouldFloat('year') 
                ? '-top-2 text-xs bg-white px-1 text-mocha'
                : 'top-3 text-gray-500'
            }`}
          >
            Année
          </label>
          <input
            id="year"
            name="year"
            type="number"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.year}
            onChange={handleChange}
            onFocus={() => handleFocus('year')}
            onBlur={() => handleBlur('year')}
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