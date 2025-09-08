import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const EQUIPMENTS_CATALOG = {
  "Navigation": [
    "GPS / traceur", "VHF", "Compas", "Pilote automatique", "Sondeur", "Cartes papier"
  ],
  "Sécurité": [
    "Gilets de sauvetage", "Radeau de survie", "Extincteurs", "Pompe de cale", "Trousse de secours"
  ],
  "Technique": [
    "Batteries de service", "Chargeur", "Panneaux solaires", "Guindeau électrique", "Ancre principale"
  ],
  "Confort à bord": [
    "Cuisinière", "Réfrigérateur", "WC marins", "Douche intérieure", "Ventilateurs", "Literie"
  ],
  "Loisirs & extérieur": [
    "Annexe", "Paddle", "Kayak", "Snorkeling", "Pêche", "Barbecue", "Douche de pont"
  ]
};

export default function Step2Equipments({ data, setData }) {
  const toggle = (eq) =>
    setData({
      ...data,
      equipment: data.equipment.includes(eq)
        ? data.equipment.filter((e) => e !== eq)
        : [...data.equipment, eq],
    });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-mocha">Équipements</h2>

      {Object.entries(EQUIPMENTS_CATALOG).map(([category, list]) => (
        <div key={category} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold text-gray-700 mb-3">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {list.map((eq) => {
              const checked = data.equipment.includes(eq);
              return (
                <label
                  key={eq}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                    ${checked ? "border-mocha bg-mocha/5" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(eq)} className="sr-only" />
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`w-4 h-4 rounded border p-0.5
                      ${checked ? "bg-mocha text-white border-mocha" : "bg-white text-transparent border-gray-300"}`}
                  />
                  <span className="text-sm text-gray-800">{eq}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {data.equipment.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">{data.equipment.length} équipement(s) sélectionné(s)</p>
        </div>
      )}
    </div>
  );
}