import { sendContactEmail } from "../utils/mailer.js";

const sendContact = async (data) => {
  const { name, email, message, subject } = data;
  try {
    await sendContactEmail(name, email, message, subject);
    return { message: "Votre message a été envoyé avec succès." };
  } catch (err) {
    throw new Error("Erreur lors de l'envoi du message.");
  }
}

export default {
  sendContact
};