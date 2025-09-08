import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { useEffect, useState } from "react";
import { customSelectStyles, customSelectTheme } from "../../utils/selectTheme";
import { fetchPorts } from "../../services/portServices";
import { fetchBoatTypes } from "../../services/boatTypeSevices";

function Filter(props){

  const [selectedPort, setSelectedPort] = useState(null);
  const [ports, setPorts] = useState([]);
  const [types, setTypes] = useState([]);

  // Ajout des états pour les filtres range
  const [length, setLength] = useState(100);
  const [capacity, setCapacity] = useState(50);
  const [price, setPrice] = useState(10000);

  const [showOtherFilters, setShowOtherFilters] = useState(false);
  const [btnShowOtherFilters, setBtnShowOtherFilters] = useState("Plus de filtres");

  // Données mockées pour les ports
  const mockPorts = [
    { value: "port-nice", label: "Port de Nice" },
    { value: "port-cannes", label: "Port de Cannes" },
    { value: "port-saint-tropez", label: "Port de Saint-Tropez" },
    { value: "port-monaco", label: "Port de Monaco" },
    { value: "port-antibes", label: "Port d'Antibes" },
    { value: "port-marseille", label: "Port de Marseille" },
    { value: "port-toulon", label: "Port de Toulon" }
  ];

  useEffect(() => {
    fetchPorts().then((data) => {
      const formattedPorts = data.map(port => ({
        value: port.id,
        label: port.name
      }));
      setPorts(formattedPorts);
    });
    fetchBoatTypes().then((data) => {
      const formattedTypes = data.map(type => ({
        value : type.id,
        label: type.name
      }));
      setTypes(formattedTypes);
    });
  }, []);

  const openOtherFilter = () => {
    setShowOtherFilters((prev) => !prev);
    setBtnShowOtherFilters((prev) => prev === "Plus de filtres" ? "Moins de filtres" : "Plus de filtres");
  }

const handleResetFormFilter = (e) => {
  e.preventDefault();
  setSelectedPort(null);
  setLength(100);
  setCapacity(50);
  setPrice(10000);

  const radios = document.getElementsByName("boatType");
  radios.forEach(radio => {
    if (radio.value === "all") radio.checked = true;
    else radio.checked = false;
  });

  const checkboxes = document.getElementsByName("equipment");
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
};


const handleSubmit = (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);

  // Port
  if (selectedPort?.value) params.set("port", selectedPort.value);

  // Type
  const selectedType = document.querySelector('input[name="boatType"]:checked')?.value;
  if (selectedType && selectedType !== "all") params.set("type", selectedType);

  // Range filters
  params.set("length", length);
  params.set("capacity", capacity);
  params.set("price", price);

  // Recherche textuelle
  const searchInput = document.querySelector("input[placeholder='Rechercher un bateau...']");
  if (searchInput?.value.trim()) params.set("search", searchInput.value.trim());

  // Appliquer et recharger
  window.history.replaceState(null, "", `?${params.toString()}`);
  props.onFilterChange(0);
};



  return (
    <>
      <h4 className="font-bold">Filtrez les résultats <FontAwesomeIcon icon={faFilter}/></h4>
      <form className="relative z-0 w-full my-3"  onSubmit={handleSubmit}>
        <label htmlFor="port" className="sr-only">Entrez le port ou la ville de départ</label>
        <Select
          inputId="port"
          name="port"
          options={ports}
          placeholder="Entrez le port ou la ville de départ"
          value={selectedPort}
          onChange={setSelectedPort}
          className="border-b-2 border-[#F5F1EB] text-sm"
          styles={customSelectStyles}
          theme={customSelectTheme}
          menuPortalTarget={document.body}
        />
        <h5 className="mt-3">Sélectionnez un type de bateau</h5>
        {/* Type radio to select a type of boat */}
        <div className="flex flex-col text-sm">
          <label className="flex items-center my-1">
            <input
              type="radio"
              name="boatType"
              value="all"
              defaultChecked
              className="mr-2 text-mocha accent-[#AD7C59]"
            />
            Tous
          </label>
          {types.map((type) => (
            <label key={type.value} className="flex items-center my-1">
              <input
                type="radio"
                name="boatType"
                value={type.value}
                className="mr-2 text-mocha accent-[#AD7C59]"
              />
              {type.label}
            </label>
          ))}
        </div>
        {/* Les filtres à cacher au début */}
        <div className={`mt-4 other-filters ${showOtherFilters ? "" : "hidden"}`}>
          <h5 className="">Longueur du bateau</h5>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              className="w-full accent-[#AD7C59]"
              value={length}
              onChange={e => setLength(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">0 m - <b>{length}</b> m</span>
            <span className="text-sm font-bold">100 m</span>
          </div>
          <h5 className="mt-4">Capacité</h5>
          <div className="">
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              className="w-full accent-[#AD7C59]"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">0 - <b>{capacity} passagers</b></span>
            <span className="text-sm font-bold">50 passagers</span>
          </div>
          <h5 className="mt-4">Prix par jour</h5>
          <div className="">
            <input
              type="range"
              min="0"
              max="10000"
              step="10"
              className="w-full accent-[#AD7C59]"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-sm">0 € - <b>{price} €</b></span>
            <span className="text-sm font-bold">10 000 €</span>
          </div>
        </div>
        {/* Boutons plus de filtres et Réinitialisez */}
        <div className="flex justify-between mt-5">
          <button type="button" onClick={openOtherFilter} className="btn-show-other-filters text-sm text-sand hover:text-[#8B5A3E]">
            {btnShowOtherFilters}
          </button>
          <button type="reset" onClick={handleResetFormFilter}  className="text-sm text-sand hover:text-[#8B5A3E]">
            Réinitialiser
          </button>
        </div>
        {/* Bouton pour appliquer les filtres */}
        <div className="flex justify-center mt-4">
          <button type="submit" className="custom-button">
            Appliquer les filtres
          </button>
        </div>
      </form>
    </>
  )
}
export default Filter;