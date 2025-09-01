import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


const Step5Payment = ({ totalPrice, setStep, setPaymentError, processing, setProcessing, firstName, lastName, email, phone }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: { name: `${firstName} ${lastName}`, email, phone },
    });

    if (error) {
      setPaymentError(error.message);
    } else {
      setStep(6);
    }

    setProcessing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Informations de carte bancaire</label>
        <CardElement className="p-3 border border-gray-300 rounded-md bg-white" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(4)} className="px-6 py-3 bg-gray-200 rounded-md">Retour</button>
          <button type="submit" disabled={!stripe || processing} className="px-6 py-3 bg-mocha text-white rounded-md">
            {processing ? "Traitement..." : `Payer ${totalPrice}€`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step5Payment;