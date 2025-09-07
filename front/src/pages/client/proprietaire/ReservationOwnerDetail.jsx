// pages/owner/ReservationOwnerDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faFileAlt,
  faUser,
  faShip,
  faEye,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { fetchReservationByReference } from "../../../services/reservationServices";
import {
  fetchDocumentsByUserId,
  updateUserDocument,
} from "../../../services/userDocument";
import { updateReservation } from "../../../services/reservationServices";

const BASE_API = import.meta.env.VITE_API_BASE_URL;

export default function ReservationOwnerDetail() {
  const { reference } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentDecisions, setDocumentDecisions] = useState({});
  const [refusalInputs, setRefusalInputs] = useState({});
  const [globalMessage, setGlobalMessage] = useState("");
  const [modalFile, setModalFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    try {
      const res = await fetchReservationByReference(reference);
      setReservation(res);
      const docs = await fetchDocumentsByUserId(res.user_id);
      setDocuments(docs);

      const initialDecisions = {};
      const initialInputs = {};
      docs.forEach((d) => {
        initialDecisions[d.id] = d.is_approved;
        if (d.is_approved === false && d.message)
          initialInputs[d.id] = d.message;
      });
      setDocumentDecisions(initialDecisions);
      setRefusalInputs(initialInputs);
    } catch (error) {
      console.error("Erreur chargement détail réservation :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentDecision = (docId, approved) => {
    setDocumentDecisions((prev) => ({ ...prev, [docId]: approved }));
    if (approved) setRefusalInputs((prev) => ({ ...prev, [docId]: "" }));
  };

  const handleFinalDecision = async (status) => {
    if (status === "refused" && !globalMessage.trim()) {
      alert("Veuillez indiquer une raison pour refuser la réservation.");
      return;
    }
    const hasRefusedDoc = Object.values(documentDecisions).some(
      (d) => d === false
    );
    if (status === "confirmed" && hasRefusedDoc) {
      alert(
        "Vous ne pouvez pas accepter la réservation tant qu’un document est refusé."
      );
      return;
    }

    try {
      for (const doc of documents) {
        const decision = documentDecisions[doc.id];
        const reason = refusalInputs[doc.id] || "";
        if (
          decision !== doc.is_approved ||
          (decision === false && reason !== doc.message)
        ) {
          await updateUserDocument(doc.id, {
            is_approved: decision,
            message: decision === false ? reason : null,
          });
        }
      }
      await updateReservation(reservation.id, {
        status,
        message: status === "refused" ? globalMessage.trim() : null,
      });
      navigate("/reservations");
    } catch (error) {
      console.error("Erreur décision finale :", error);
    }
  };

  const openFileModal = (doc) => setModalFile(doc);
  const closeFileModal = () => setModalFile(null);

  if (loading) return <div className="text-center mt-10">Chargement...</div>;
  if (!reservation)
    return <div className="text-center mt-10">Réservation introuvable.</div>;

  const hasRefusedDoc = Object.values(documentDecisions).some(
    (d) => d === false
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Détail de la réservation
      </h1>

      {/* Bateau */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faShip} className="text-slate-blue" />
          Bateau
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              reservation.Boat?.BoatPhotos?.[0]?.url || "/placeholder-boat.jpg"
            }
            alt={reservation.Boat?.name}
            className="w-full md:w-64 h-40 object-cover rounded"
          />
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">{reservation.Boat?.name}</h3>
            <p className="text-gray-600">
              Prix journalier :{" "}
              <span className="font-medium">
                {reservation.Boat?.daily_price} €
              </span>
            </p>
            <p className="text-gray-600">
              Passagers max :{" "}
              <span className="font-medium">
                {reservation.Boat?.max_passengers}
              </span>
            </p>
            <p className="text-gray-600">
              Longueur :{" "}
              <span className="font-medium">{reservation.Boat?.length} m</span>
            </p>
            <Link
              to={`/boats/${reservation.Boat?.slug}`}
              className="inline-block mt-3 bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition"
            >
              Voir la fiche du bateau
            </Link>
          </div>
        </div>
      </section>

      {/* Locataire */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-slate-blue" />
          Locataire
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              Nom :{" "}
              <span className="font-medium">
                {reservation.User?.firstname} {reservation.User?.lastname}
              </span>
            </p>
            <p className="text-gray-600">
              Téléphone :{" "}
              <span className="font-medium">
                {reservation.User?.phone || "Non renseigné"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              Email :{" "}
              <span className="font-medium">{reservation.User?.email}</span>
            </p>
            <p className="text-gray-600">
              Adresse :{" "}
              <span className="font-medium">
                {reservation.User?.address || "Non renseignée"}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Réservation */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileInvoice} className="text-slate-blue" />
          Réservation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Référence</p>
            <p className="font-medium">{reservation.reference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de début</p>
            <p className="font-medium">
              {new Date(reservation.start_date).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de fin</p>
            <p className="font-medium">
              {new Date(reservation.end_date).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-slate-blue" />
          Documents du locataire
        </h2>

        {documents.length === 0 ? (
          <p className="text-gray-600">Aucun document téléchargé.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {doc.type.replace("_", " ")}
                  </p>
                  {documentDecisions[doc.id] === false && (
                    <textarea
                      className="mt-2 w-full border border-gray-300 rounded p-2 text-sm"
                      placeholder="Raison du refus"
                      value={refusalInputs[doc.id] || ""}
                      onChange={(e) =>
                        setRefusalInputs((prev) => ({
                          ...prev,
                          [doc.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>

                {/* partie droite : boutons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openFileModal(doc)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    <FontAwesomeIcon icon={faEye} /> Voir le fichier
                  </button>

                  <button
                    onClick={() => handleDocumentDecision(doc.id, true)}
                    className={`px-3 py-1 rounded transition text-white ${
                      documentDecisions[doc.id] === true
                        ? "bg-sage-green"
                        : "bg-gray-300 hover:bg-sage-green"
                    }`}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Accepter
                  </button>

                  <button
                    onClick={() => handleDocumentDecision(doc.id, false)}
                    className={`px-3 py-1 rounded transition text-white ${
                      documentDecisions[doc.id] === false
                        ? "bg-red-400"
                        : "bg-gray-300 hover:bg-red-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Refuser
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal Voir Fichier */}
      {modalFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Fichier : {modalFile.type.replace("_", " ")}
            </h3>
            {(() => {
              const full = `${BASE_API}${modalFile.file_url}`;
              return modalFile.file_url.endsWith(".pdf") ? (
                <iframe
                  src={full}
                  className="w-full h-96 rounded border"
                  title="PDF"
                />
              ) : [".jpg", ".jpeg", ".png", ".gif"].some((ext) =>
                  modalFile.file_url.endsWith(ext)
                ) ? (
                <img
                  src={full}
                  alt="Aperçu"
                  className="w-full max-h-96 object-contain rounded border"
                />
              ) : (
                <p className="text-gray-600">
                  Aperçu non disponible pour ce type de fichier.
                </p>
              );
            })()}
            <div className="flex justify-end gap-3 mt-4">
              <a
                href={`${BASE_API}${modalFile.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-mocha text-white px-4 py-2 rounded hover:bg-mocha-dark transition"
              >
                Ouvrir dans une nouvelle fenêtre
              </a>
              <button
                onClick={closeFileModal}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Décision Finale */}
      <section className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Décision finale</h2>

        {hasRefusedDoc && (
          <p className="text-red-600 mb-4">
            Vous ne pouvez pas accepter tant qu’un document est refusé.
          </p>
        )}

        <textarea
          className="w-full border border-gray-300 rounded p-3 mb-4"
          rows="3"
          placeholder="Raison du refus (obligatoire si vous refusez)"
          value={globalMessage}
          onChange={(e) => setGlobalMessage(e.target.value)}
        />

        {/* boutons responsive : colonne sur mobile, ligne dès sm */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleFinalDecision("confirmed")}
            disabled={hasRefusedDoc}
            className={`px-6 py-2 rounded transition text-white ${
              hasRefusedDoc
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-mocha hover:opacity-90"
            }`}
          >
            Accepter définitivement
          </button>

          <button
            onClick={() => handleFinalDecision("refused")}
            className="px-6 py-2 rounded hover:opacity-90 hover:text-white hover:bg-red-400 transition border border-red-400"
          >
            Refuser la demande
          </button>
        </div>
      </section>
    </div>
  );
}
