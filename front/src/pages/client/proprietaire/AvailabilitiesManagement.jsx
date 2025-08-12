import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faTrash,
  faSave,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faTools
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialAvailabilities = [
  {
    id: 1,
    start_date: "2023-06-01",
    end_date: "2023-06-10",
    status: "booked"
  },
  {
    id: 2,
    start_date: "2023-06-11",
    end_date: "2023-06-20",
    status: "available"
  },
  {
    id: 3,
    start_date: "2023-06-21",
    end_date: "2023-06-30",
    status: "maintenance"
  }
];

export default function AvailabilitiesManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    start_date: null,
    end_date: null,
    status: "available"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des données
    setTimeout(() => {
      setAvailabilities(initialAvailabilities);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleDateChange = (date, field) => {
    setNewAvailability({
      ...newAvailability,
      [field]: date
    });
  };

  const handleStatusChange = (e) => {
    setNewAvailability({
      ...newAvailability,
      status: e.target.value
    });
  };

  const addAvailability = () => {
    if (newAvailability.start_date && newAvailability.end_date) {
      const newEntry = {
        id: Date.now(), // ID temporaire
        start_date: newAvailability.start_date.toISOString().split('T')[0],
        end_date: newAvailability.end_date.toISOString().split('T')[0],
        status: newAvailability.status
      };
      
      setAvailabilities([...availabilities, newEntry]);
      setNewAvailability({
        start_date: null,
        end_date: null,
        status: "available"
      });
    }
  };

  const removeAvailability = (id) => {
    setAvailabilities(availabilities.filter(avail => avail.id !== id));
  };

  const saveAvailabilities = async () => {
    try {
      // Ici vous ajouteriez l'appel API pour sauvegarder
      console.log("Disponibilités à sauvegarder:", availabilities);
      alert("Disponibilités enregistrées avec succès !");
      navigate(`/my-space/boats/${id}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return faCheckCircle;
      case 'booked': return faTimesCircle;
      case 'maintenance': return faTools;
      default: return faCheckCircle;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'text-green-500';
      case 'booked': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement en cours...</div>;
  }

  return (
    <div className="lg:mx-4 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={`/my-space/boats/${id}`}
          className="text-slate-blue hover:underline flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au bateau
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          Gestion des disponibilités
        </h1>
      </div>

      {/* Formulaire d'ajout */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Ajouter une période</h2>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <DatePicker
              selected={newAvailability.start_date}
              onChange={(date) => handleDateChange(date, 'start_date')}
              selectsStart
              startDate={newAvailability.start_date}
              endDate={newAvailability.end_date}
              minDate={new Date()}
              className="w-full p-2 border rounded"
              dateFormat="dd/MM/yyyy"
              placeholderText="JJ/MM/AAAA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <DatePicker
              selected={newAvailability.end_date}
              onChange={(date) => handleDateChange(date, 'end_date')}
              selectsEnd
              startDate={newAvailability.start_date}
              endDate={newAvailability.end_date}
              minDate={newAvailability.start_date || new Date()}
              className="w-full p-2 border rounded"
              dateFormat="dd/MM/yyyy"
              placeholderText="JJ/MM/AAAA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={newAvailability.status}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded"
            >
              <option value="available">Disponible</option>
              <option value="booked">Réservé</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <button
            onClick={addAvailability}
            disabled={!newAvailability.start_date || !newAvailability.end_date}
            className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha-dark disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlus} /> Ajouter
          </button>
        </div>
      </div>

      {/* Liste des disponibilités */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Périodes enregistrées</h2>
        
        {availabilities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities
                  .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                  .map((availability) => (
                    <tr key={availability.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Du {formatDate(availability.start_date)} au {formatDate(availability.end_date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`flex items-center gap-1 ${getStatusColor(availability.status)}`}>
                          <FontAwesomeIcon icon={getStatusIcon(availability.status)} />
                          {availability.status === 'available' && 'Disponible'}
                          {availability.status === 'booked' && 'Réservé'}
                          {availability.status === 'maintenance' && 'Maintenance'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <button
                          onClick={() => removeAvailability(availability.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucune période enregistrée</p>
        )}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button
          onClick={saveAvailabilities}
          disabled={availabilities.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}