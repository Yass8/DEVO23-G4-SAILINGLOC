import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { customSelectStyles, customSelectTheme } from "../../utils/selectTheme";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPorts } from "../../services/portServices";
import { fetchBoatTypes } from "../../services/boatTypeSevices";

const DateInput = ({
  selected,
  onChange,
  placeholder,
  minDate,
  isStart,
  startDate,
  endDate,
  datepickerRef,
}) => (
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
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholder}
      className="w-full text-sm text-sand placeholder:text-sand bg-transparent focus:outline-none"
      calendarClassName="custom-datepicker"
      popperPlacement="bottom"
      popperModifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
      ]}
    />
    <div
      className="absolute inset-y-0 right-0 flex items-center pe-3.5 lg:pe-2 cursor-pointer"
      onClick={() => datepickerRef.current?.setOpen(true)}
    >
      <FontAwesomeIcon icon={faCalendar} className="text-sand w-4 h-4" />
    </div>
  </div>
);

function FormSearch() {
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [portOptions, setPortOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const startRef = useRef(null);
  const endRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const ports = await fetchPorts();
        const formattedPorts = ports.map((port) => ({
          value: port.id,
          label: `${port.name} (${port.country})`,
        }));
        setPortOptions(formattedPorts);

        const types = await fetchBoatTypes();
        const formattedTypes = types.map((type) => ({
          value: type.id,
          label: type.name,
        }));
        setTypeOptions(formattedTypes);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !selectedPort || !selectedType) return;

    const query = `/boats?startDate=${
      startDate.toISOString().split("T")[0]
    }&endDate=${endDate.toISOString().split("T")[0]}&port=${
      selectedPort.value
    }&type=${selectedType.value}`;
    navigate(query);
  };

  return (
    <>
      <h2 className="text-center">Louer maintenant</h2>
      <h3 className="text-center">Réserver une location de bateau</h3>

      <div className="container relative overflow-visible z-10 w-full sm:w-10/12 lg:w-8/12 mx-auto p-4 rounded-[6px] bg-slate-blue shadow">
        <form
          className="lg:flex flex-col justify-around lg:flex-row lg:flex-wrap"
          onSubmit={handleSubmit}
        >
          {/* Select : Lieu de départ */}
          <div className="relative z-0 w-full lg:w-2/12 my-5 lg:my-0">
            <label htmlFor="port" className="sr-only">
              Lieu de départ
            </label>
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
              menuPortalTarget={document.body}
            />
          </div>

          {/* DatePicker : Départ */}
          <DateInput
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate(null);
            }}
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
            <label htmlFor="type" className="sr-only">
              Type de bateau
            </label>
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
              menuPortalTarget={document.body}
            />
          </div>

          {/* Submit */}
          <div className="lg:w-2.5/12 flex justify-center my-5 lg:my-0">
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sand bg-mocha focus:outline-none"
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
