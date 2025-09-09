import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faSave,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faTools,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchBoatBySlug } from "../../../services/boatServices";
import {
  fetchBoatAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../../services/availableServices";
import {
  DeleteConfirmation,
  ErrorAlert,
  GeneralConfirmation,
  SuccessAlert,
} from "../../../components/common/SweetAlertComponents";
import Preloader from "../../../components/common/Preloader";

const STATUS_LABELS = {
  available: "Disponible",
  booked: "Réservé",
  maintenance: "Maintenance",
};

export default function AvailabilitiesManagement() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [boat, setBoat] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({
    start_date: null,
    end_date: null,
    status: "available",
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadData = async () => {
    try {
      const b = await fetchBoatBySlug(slug);
      const avails = await fetchBoatAvailabilities(Number(b.id));
      setBoat(b);
      setAvailabilities(avails);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR");

  const statusIcon = (s) =>
    s === "available"
      ? faCheckCircle
      : s === "booked"
      ? faTimesCircle
      : faTools;

  const statusColor = (s) =>
    s === "available"
      ? "text-sage-green"
      : s === "booked"
      ? "text-red-400"
      : "text-mocha";

  const handleAdd = async () => {
  if (!editFields.start_date || !editFields.end_date) return;
  try {
    const payload = {
      boat_id: boat.id,
      start_date: editFields.start_date.toISOString().split('T')[0],
      end_date: editFields.end_date.toISOString().split('T')[0],
      status: editFields.status
    };

    const created = await createAvailability(payload); 
    setAvailabilities(prev => [...prev, created]);
    setEditFields({ start_date: null, end_date: null, status: 'available' });
    SuccessAlert('Ajoutée', 'La période a été créée.');
  } catch (err) {
    console.error(err);
    ErrorAlert('Erreur', 'Impossible d’ajouter cette période.');
  }
};
  const startEdit = (a) => {
    setEditId(a.id);
    setEditFields({
      start_date: new Date(a.start_date),
      end_date: new Date(a.end_date),
      status: a.status,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditFields({ start_date: null, end_date: null, status: "available" });
  };

  const saveEdit = async () => {
    if (!editFields.start_date || !editFields.end_date) return;
    try {
      const updated = await updateAvailability(editId, {
        start_date: editFields.start_date.toISOString().split("T")[0],
        end_date: editFields.end_date.toISOString().split("T")[0],
        status: editFields.status,
      });
      setAvailabilities(
        availabilities.map((a) => (a.id === editId ? updated : a))
      );
      cancelEdit();
      SuccessAlert("Modifiée", "La période a été mise à jour.");
    } catch (err) {
      console.error(err);
      ErrorAlert("Erreur", "Impossible de modifier cette période.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await DeleteConfirmation(
      "Supprimer cette période ?",
      "Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await deleteAvailability(id);
      setAvailabilities(availabilities.filter((a) => a.id !== id));
      SuccessAlert("Supprimée", "La période a été supprimée.");
    } catch (err) {
      console.error(err);
      ErrorAlert("Erreur", "Impossible de supprimer cette période.");
    }
  };
  const handleSaveAll = async () => {
    const confirmed = await GeneralConfirmation(
      "Terminer",
      "Enregistrer et quitter la page ?",
      "Oui, terminer",
      "Annuler"
    );
    if (!confirmed) return;
    navigate(`/my-space/boats/${boat.slug}`);
  };

  if (loading) return <Preloader />;

  return (
    <div className="lg:mx-4 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={`/my-space/boats/${boat.slug}`}
          className="text-slate-blue hover:underline flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Retour au bateau
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} />
          Gestion des disponibilités
        </h1>
      </div>

      {/* Ajout / Édition */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">
          {editId ? "Modifier la période" : "Ajouter une période"}
        </h2>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <DatePicker
              selected={editFields.start_date}
              onChange={(d) => setEditFields({ ...editFields, start_date: d })}
              selectsStart
              startDate={editFields.start_date}
              endDate={editFields.end_date}
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              dateFormat="dd/MM/yyyy"
              placeholderText="JJ/MM/AAAA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <DatePicker
              selected={editFields.end_date}
              onChange={(d) => setEditFields({ ...editFields, end_date: d })}
              selectsEnd
              startDate={editFields.start_date}
              endDate={editFields.end_date}
              minDate={editFields.start_date || new Date()}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
              dateFormat="dd/MM/yyyy"
              placeholderText="JJ/MM/AAAA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={editFields.status}
              onChange={(e) =>
                setEditFields({ ...editFields, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mocha"
            >
              <option value="available">Disponible</option>
              <option value="booked">Réservé</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editId ? saveEdit : handleAdd}
              disabled={!editFields.start_date || !editFields.end_date}
              className="bg-mocha text-sand px-4 py-2 rounded hover:bg-mocha/90 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} />{" "}
              {editId ? "Mettre à jour" : "Ajouter"}
            </button>
            {editId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Liste */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold text-mocha">
          Périodes enregistrées
        </h2>
        {availabilities.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune période enregistrée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Période
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities
                  .sort(
                    (a, b) => new Date(a.start_date) - new Date(b.start_date)
                  )
                  .map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        Du {formatDate(a.start_date)} au{" "}
                        {formatDate(a.end_date)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`flex items-center gap-2 ${statusColor(
                            a.status
                          )}`}
                        >
                          <FontAwesomeIcon icon={statusIcon(a.status)} />
                          {STATUS_LABELS[a.status]}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => startEdit(a)}
                          className="text-slate-blue hover:underline"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-red-400 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sauvegarde globale (facultative) */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Terminer
        </button>
      </div>
    </div>
  );
}
