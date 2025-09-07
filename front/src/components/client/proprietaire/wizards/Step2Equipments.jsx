import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const EQUIPMENTS_CATALOG = {
  "Navigation": [
    "GPS / traceur de cartes", "VHF fixe et/ou portable", "Compas", "Pilote automatique",
    "Sondeur / Loch / Anémomètre", "Cartes marines papier", "Jumelles", "Table à cartes",
    "Radar", "AIS", "Feux de navigation", "Baromètre"
  ],
  "Mouillage & manœuvre": [
    "Guindeau électrique", "Ancre principale + chaîne", "Ancre de secours",
    "Cordages (amarres, bouts)", "Défenses", "Bossoirs", "Pare-battages",
    "Davier", "Winchs", "Taud de soleil / Bimini", "Capote de descente"
  ],
  "Sécurité": [
    "Gilets de sauvetage", "Radeau de survie", "Harnais + lignes de vie",
    "Balise EPIRB", "Fusées de détresse", "Extincteurs", "Trousse de premiers secours",
    "Bouée couronne", "Coupe-circuit moteur", "Pompe de cale", "Manuel de sécurité"
  ],
  "Voile": [
    "Grand-voile", "Génois enrouleur", "Spi / gennaker", "Lazy bag / Lazy jack",
    "Drisses, écoutes et palans", "Barre franche", "Pataras, haubans, étai"
  ],
  "Technique / moteur": [
    "Moteur(s) inboard", "Batteries de service", "Chargeur de batterie",
    "Convertisseur 12V/220V", "Panneaux solaires", "Générateur",
    "Climatisation", "Dessalinisateur"
  ],
  "Confort intérieur": [
    "Réfrigérateur / congélateur", "Cuisinière à gaz", "Four / micro-ondes",
    "Évier + eau chaude", "Ustensiles de cuisine", "Literie", "Ventilateurs",
    "WC marins", "Douche(s) intérieure(s)", "Réservoirs d’eau douce"
  ],
  "Multimédia": [
    "Radio / Bluetooth", "Haut-parleurs", "Télévision", "Connexion Wi-Fi",
    "Jeux de société / livres"
  ],
  "Loisirs & extérieur": [
    "Annexe avec moteur", "Paddle", "Kayak", "Matériel de snorkeling",
    "Matériel de pêche", "Plancha / barbecue", "Filets de trampoline",
    "Douche de pont"
  ],
  "Divers / utilitaires": [
    "Outils de bord", "Seaux, éponges", "Réserve de carburant",
    "Jerrycans", "Seau à feu", "Échelle de bain", "Table de cockpit",
    "Coussins de cockpit"
  ]
};

export default function Step2Equipments({ data, setData }) {
  /* data.equipment est un tableau simple des équipements cochés */
  const toggle = (eq) =>
    setData({
      ...data,
      equipment: data.equipment.includes(eq)
        ? data.equipment.filter((e) => e !== eq)
        : [...data.equipment, eq]
    });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-mocha">Équipements</h2>

      {/* Liste des catégories */}
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
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(eq)}
                    className="sr-only" /* caché, on clique sur le label */
                  />
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

      {/* Récapitulatif (facultatif) */}
      {data.equipment.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            {data.equipment.length} équipement(s) sélectionné(s)
          </p>
        </div>
      )}
    </div>
  );
}