import { useState, useRef } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { customSelectStyles, customSelectTheme } from "../../utils/selectTheme";
import "react-datepicker/dist/react-datepicker.css";

const portOptions = [
  { value: 2, label: "Marseille" },
  { value: 3, label: "Nice" },
  { value: 4, label: "Bordeaux" },
  { value: 5, label: "Paris" },
  { value: 6, label: "Lyon" },
  { value: 7, label: "Toulouse" },
  { value: 8, label: "Nantes" },
  { value: 9, label: "Strasbourg" },
  { value: 10, label: "Montpellier" },
];

const typeOptions = [
  { value: 1, label: "Voilier" },
  { value: 2, label: "Catamaran" },
  { value: 3, label: "Bateau à moteur" },
  { value: 4, label: "Yacht" },
  { value: 5, label: "Péniche" },
  { value: 6, label: "Bateau de pêche" },
  { value: 7, label: "Bateau de plaisance" },
  { value: 8, label: "Bateau à voile" },
  { value: 9, label: "Bateau de croisière" },
  { value: 10, label: "Bateau de course" },
];

// Composant réutilisable pour un champ DatePicker avec icône
const DateInput = ({ selected, onChange, placeholder, minDate, isStart, startDate, endDate, datepickerRef }) => (
  <div className="relative z-0 flex items-center border-b-2 lg:border-b-0 lg:border-r-2 border-[#F5F1EB] w-full lg:w-2/12 p-2.5 my-5 lg:my-0">
    <DatePicker
      ref={datepickerRef}
      selected={selected}
      onChange={onChange}
      selectsStart={isStart}
      selectsEnd={!isStart}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      className="w-full text-sm text-[#F5F1EB] placeholder:text-[#F5F1EB] bg-transparent focus:outline-none"
      calendarClassName="custom-datepicker"
    />
    <div
      className="absolute inset-y-0 right-0 flex items-center pe-3.5 lg:pe-2 cursor-pointer"
      onClick={() => datepickerRef.current?.setOpen(true)}
    >
      <FontAwesomeIcon icon={faCalendar} className="text-[#F5F1EB] w-4 h-4" />
    </div>
  </div>
);

function FormSearch() {
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const startRef = useRef(null);
  const endRef = useRef(null);

  return (
    <>
      <h2 className="text-center">Louer maintenant</h2>
      <h3 className="text-center">Réserver une location de bateau</h3>

      <div className="container w-full sm:w-10/12 lg:w-8/12 mx-auto p-4 rounded-[6px] bg-[#4B6A88] shadow">
        <form className="lg:flex flex-col justify-around lg:flex-row lg:flex-wrap">
          {/* Select : Lieu de départ */}
          <div className="relative z-0 w-full lg:w-2/12 my-5 lg:my-0">
            <label htmlFor="port" className="sr-only">Lieu de départ</label>
            <Select
              inputId="port"
              name="port"
              options={portOptions}
              placeholder="Lieu de départ"
              value={selectedPort}
              onChange={setSelectedPort}
              className="border-b-2 lg:border-b-0 lg:border-r-2 border-[#F5F1EB] text-sm"
              styles={customSelectStyles}
              theme={customSelectTheme}
            />
          </div>

          {/* DatePicker : Départ */}
          <DateInput
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate(null);
            }}
            calendarClassName="custom-datepicker"
            placeholder="Date de départ"
            minDate={new Date()}
            isStart={true}
            startDate={startDate}
            endDate={endDate}
            datepickerRef={startRef}
          />

          {/* DatePicker : Fin */}
          <DateInput
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholder="Date de fin"
            minDate={startDate || new Date()}
            isStart={false}
            startDate={startDate}
            endDate={endDate}
            datepickerRef={endRef}
          />

          {/* Select : Type de bateau */}
          <div className="relative z-0 w-full lg:w-2/12 my-5 lg:my-0">
            <label htmlFor="type" className="sr-only">Type de bateau</label>
            <Select
              inputId="type"
              name="type"
              options={typeOptions}
              placeholder="Type de bateau"
              value={selectedType}
              onChange={setSelectedType}
              className="border-b-2 lg:border-b-0 lg:border-r-2 border-[#F5F1EB] text-sm"
              styles={customSelectStyles}
              theme={customSelectTheme}
            />
          </div>

          {/* Submit */}
          <div className="lg:w-2.5/12 flex justify-center my-5 lg:my-0">
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#F5F1EB] bg-[#AD7C59] focus:outline-none"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormSearch;
