import contactServices from "../services/contact.services.js";


const sendContactForm = async (req, res) => {
  try {
    await contactServices.sendContact(req.body);
    res.status(200).json({ message: "Votre message a été envoyé avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default { sendContactForm };