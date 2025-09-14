import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  createPayment,
} from "../../services/paymentServices";
import { updateReservation } from "../../services/reservationServices";
import { createAvailability } from "../../services/availableServices";
import { SuccessAlert } from "../common/SweetAlertComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
} from "@fortawesome/free-brands-svg-icons";
import { generateContractPdf } from "../../utils/pdf";
import { createContract } from "../../services/contractServices";
import ContractTemplate from "./ContractTemplate";
import { uniqid } from "../../utils/uniqid";

export default function Payment({ reservation }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [referenceContract, setReferenceContract] = useState('');

  const [showTemplate, setShowTemplate] = useState(false);
  const templateRef = useRef(null);

  const amount = parseFloat(reservation.total_price);
  const commission = (amount * 0.1).toFixed(2);
  const boatId = reservation.boat_id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    // Créer le PaymentIntent côté backend
    const intentRes = await createPaymentIntent(Math.round(amount * 100));
    const { client_secret } = intentRes;

    // Confirmer le paiement
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      client_secret,
      {
        payment_method: { card },
      }
    );

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    // Enregistrer le paiement
    await createPayment({
      reservation_id: reservation.id,
      reference: paymentIntent.id,
      amount,
      commission_amount: commission,
      method: "credit_card",
      status: "completed",
      transaction_id: paymentIntent.id,
    });

    // Mettre à jour la réservation
    await updateReservation(reservation.id, { status: "completed" });

    // Créer les disponibilités
    const start = new Date(reservation.start_date);
    const end = new Date(reservation.end_date);

    // Période booked
    await createAvailability({
      boat_id: boatId,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      status: "booked",
    });

    // un jour de maintenance après
    const maintenanceStart = new Date(end);
    maintenanceStart.setDate(end.getDate() + 1);
    const maintenanceEnd = new Date(maintenanceStart);
    maintenanceEnd.setDate(maintenanceStart.getDate() + 1);

    await createAvailability({
      boat_id: boatId,
      start_date: maintenanceStart.toISOString(),
      end_date: maintenanceEnd.toISOString(),
      status: "maintenance",
    });
    // création du contrat
    const contractRef = uniqid("CONTRACT");

    setReferenceContract(contractRef);

    await new Promise(res => setTimeout(res, 100));
  
  setShowTemplate(true);
  await new Promise(res => setTimeout(res, 100));
    
    //  génération du PDF
    const pdfBlob = await generateContractPdf(reservation, contractRef);

    const fd = new FormData();
    fd.append('contract_pdf', pdfBlob, 'contrat.pdf');
    
    const data = { 
      reservation_id: reservation.id, 
      reference: contractRef 
    };
    fd.append("data", JSON.stringify(data));

    //  envoi au back
    await createContract(fd);

    SuccessAlert(
      "Paiement réussi !",
      "Merci pour votre confiance. Votre réservation est désormais confirmée."
    )
    navigate("/my-space/reservations");
    
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <FontAwesomeIcon icon={faLock} className="text-mocha mt-1" />
        <p className="text-sm text-slate-blue">
          <span className="font-semibold">Paiement sécurisé</span> – vos
          informations sont cryptées.
        </p>
      </div>

      {!import.meta.env.VITE_PUBLIC_STRIPE_TEST_DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-600 mt-1"
          />
          <div>
            <p className="font-medium text-yellow-800">Mode démonstration</p>
            <p className="text-sm text-yellow-700">
              Le paiement n’est pas réellement traité.
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carte bancaire
        </label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="flex mt-2 gap-2">
          <FontAwesomeIcon icon={faCcVisa} className="text-slate-blue" />
          <FontAwesomeIcon icon={faCcMastercard} className="text-slate-blue" />
          <FontAwesomeIcon icon={faCcAmex} className="text-slate-blue" />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {showTemplate && (
        <div ref={templateRef} style={{ position: 'absolute', left: '-9999px' }}>
          <ContractTemplate reservation={reservation} referenceContract={referenceContract} />
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full px-6 py-3 rounded-md font-medium transition-colors ${
          !stripe || processing
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-mocha hover:bg-mocha/90 text-white"
        }`}
      >
        {processing ? "Traitement..." : `Payer ${amount} €`}
      </button>
    </form>
  );
}
