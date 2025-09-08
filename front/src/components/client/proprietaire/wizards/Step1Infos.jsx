export default function Step1Infos({ data, setData, errors, setErrors, boatTypes, ports }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === 'checkbox' ? checked : value });
  
    if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-mocha">Informations générales</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Immatriculation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'immatriculation *</label>
          <input
            name="registration_number"
            placeholder="FR-1234-AB"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.registration_number ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.registration_number}
            onChange={handleChange}
          />
          {errors.registration_number && <p className="text-sm text-red-500">{errors.registration_number}</p>}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            name="name"
            placeholder="Nom du bateau"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Type de bateau */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de bateau *</label>
          <select
            name="type_id"
            value={data.type_id}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.type_id ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
            }`}
          >
            <option value="">-- Sélectionnez un type --</option>
            {boatTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.type_id && <p className="text-sm text-red-500">{errors.type_id}</p>}
        </div>

        {/* Port d'attache */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Port d'attache</label>
          <select
            name="port_id"
            value={data.port_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
          >
            <option value="">-- Sélectionnez un port --</option>
            {ports.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Marque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
          <input
            name="brand"
            placeholder="Beneteau"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.brand}
            onChange={handleChange}
          />
        </div>

        {/* Modèle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
          <input
            name="model"
            placeholder="Oceanis 40"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.model}
            onChange={handleChange}
          />
        </div>

        {/* Moteur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type de moteur</label>
          <input
            name="engine_type"
            placeholder="Volvo Penta 40 CV"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.engine_type}
            onChange={handleChange}
          />
        </div>

        {/* Prix/jour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix/jour (€) *</label>
          <input
            name="daily_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="250"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.daily_price ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.daily_price}
            onChange={handleChange}
          />
          {errors.daily_price && <p className="text-sm text-red-500">{errors.daily_price}</p>}
        </div>

        {/* Passagers max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passagers max *</label>
          <input
            name="max_passengers"
            type="number"
            min="1"
            placeholder="8"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
              errors.max_passengers ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
            }`}
            value={data.max_passengers}
            onChange={handleChange}
          />
          {errors.max_passengers && <p className="text-sm text-red-500">{errors.max_passengers}</p>}
        </div>

        {/* Longueur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longueur (m)</label>
          <input
            name="length"
            type="number"
            step="0.01"
            min="0"
            placeholder="10.50"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.length}
            onChange={handleChange}
          />
        </div>

        {/* Tirant d'eau */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tirant d'eau (m)</label>
          <input
            name="water_draft"
            type="number"
            step="0.01"
            min="0"
            placeholder="1.80"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-mocha"
            value={data.water_draft}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          rows={4}
          placeholder="Décrivez votre bateau en quelques lignes..."
          className={`w-full p-3 border rounded focus:outline-none focus:ring-1 ${
            errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-mocha'
          }`}
          value={data.description}
          onChange={handleChange}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* Skipper requis */}
      <label className="inline-flex items-center gap-2 mt-4">
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