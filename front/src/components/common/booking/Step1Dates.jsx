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
  availabilities = []
}) => {

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = (date) => {
  if (!availabilities.length) return false;
  
  // Convertir la date à tester en string YYYY-MM-DD pour éviter les problèmes de timezone
  const dateToTest = date.toISOString().split('T')[0];
  
  return availabilities.some(availability => {
    if (availability.status !== 'available') return false;
    
    // Convertir les dates de disponibilité en strings YYYY-MM-DD
    const availabilityStart = availability.start_date.split('T')[0];
    const availabilityEnd = availability.end_date.split('T')[0];
    
    return dateToTest >= availabilityStart && dateToTest <= availabilityEnd;
  });
};

  // Fonction pour filtrer les dates disponibles
  const filterAvailableDates = (date) => {
    return isDateAvailable(date);
  };

  // Fonction pour calculer la date minimale de fin
  const getMinEndDate = () => {
    if (!startDate) return new Date();
    
    // Trouver la prochaine date disponible après startDate
    const availableDates = availabilities
      .filter(avail => avail.status === 'available')
      .map(avail => ({
        start: new Date(avail.start_date),
        end: new Date(avail.end_date)
      }))
      .sort((a, b) => a.start - b.start);

    for (const availability of availableDates) {
      if (availability.start > startDate) {
        return availability.start;
      }
      if (availability.start <= startDate && availability.end >= startDate) {
        return startDate;
      }
    }
    
    return startDate;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Choisissez vos dates</h2>
      
      {availabilities.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800">Aucune disponibilité trouvée pour ce bateau.</p>
        </div>
      )}

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
            filterDate={filterAvailableDates}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            placeholderText="Sélectionnez une date"
            dateFormat="dd/MM/yyyy"
            isClearable
            disabled={availabilities.length === 0}
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
            minDate={getMinEndDate()}
            filterDate={filterAvailableDates}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-mocha focus:border-mocha transition-colors"
            placeholderText="Sélectionnez une date"
            dateFormat="dd/MM/yyyy"
            isClearable
            disabled={!startDate || availabilities.length === 0}
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
          disabled={availabilities.length === 0}
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
          disabled={!startDate || !endDate || availabilities.length === 0}
          className={`px-6 py-3 rounded-md transition-colors ${
            !startDate || !endDate || availabilities.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mocha hover:bg-mocha/90"
          } text-white font-medium`}
        >
          Continuer
        </button>
      </div>

      {/* Affichage des périodes disponibles */}
      {availabilities.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Périodes disponibles :</h3>
          <div className="space-y-1">
            {availabilities
              .filter(avail => avail.status === 'available')
              .map((availability, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • Du {new Date(availability.start_date).toLocaleDateString()} {" "}
                  au {new Date(availability.end_date).toLocaleDateString()}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};