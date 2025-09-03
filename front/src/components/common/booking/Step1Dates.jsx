import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Step1Dates = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  passengers,
  setPassengers,
  formErrors,
  nextStep,
  boat,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Choisissez vos dates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            placeholderText="Sélectionnez une date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
          {formErrors.startDate && (
            <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            placeholderText="Sélectionnez une date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
          {formErrors.endDate && (
            <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
          )}
        </div>
      </div>

      {formErrors.dateRange && (
        <p className="text-red-500 text-xs mb-4">{formErrors.dateRange}</p>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de passagers
        </label>
        <select
          value={passengers}
          onChange={(e) => setPassengers(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
        >
          {[...Array(boat?.max_passengers || 10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i + 1 === 1 ? "personne" : "personnes"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!startDate || !endDate}
          className={`px-6 py-3 rounded-md transition-colors ${
            !startDate || !endDate
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mocha hover:bg-mocha/90"
          } text-white font-medium`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};
