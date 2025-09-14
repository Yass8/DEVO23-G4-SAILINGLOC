import Preloader from '../../components/common/Preloader.jsx';
import ScrollToTop from '../../components/common/ScrollToTop.jsx';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Banner from '../../components/common/Banner';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faClock, faPhone, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { sendContactForm } from '../../services/contactServices.js';

export default function Contact() {
   const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Effacer l'erreur du champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      await sendContactForm(formData);
      setSubmitStatus('success');
      setSubmitMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      
      if (error.response) {
        // Erreur serveur avec réponse
        if (error.response.status === 400) {
          setSubmitMessage('Les données envoyées sont invalides. Veuillez vérifier les informations saisies.');
        } else if (error.response.status === 500) {
          setSubmitMessage('Une erreur serveur est survenue. Veuillez réessayer ultérieurement.');
        } else {
          setSubmitMessage(`Une erreur est survenue (${error.response.status}). Veuillez réessayer.`);
        }
      } else if (error.request) {
        // Erreur réseau (pas de réponse du serveur)
        setSubmitMessage('Impossible de contacter le serveur. Veuillez vérifier votre connexion internet et réessayer.');
      } else {
        // Autre erreur
        setSubmitMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
      
      console.error('Erreur lors de l\'envoi du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Banner />
      
      <main className="flex-grow bg-[#f5f0e9]">
        <Preloader />
        <ScrollToTop />

        {/* Contact Info */}
        <section className="container mx-auto max-w-7xl py-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
              <FontAwesomeIcon icon={faEnvelope} className="text-mocha text-2xl mb-2" />
              <p className="font-bold mb-1">Envoyez-nous un mail</p>
              <p>info@sailingloc.com</p>
            </div>
            <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-mocha text-2xl mb-2" />
              <p className="font-bold mb-1">Notre adresse</p>
              <p>123, Quai des Navigateurs, 75000 Paris</p>
            </div>
            <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
              <FontAwesomeIcon icon={faClock} className="text-mocha text-2xl mb-2" />
              <p className="font-bold mb-1">Heures d'ouverture</p>
              <p>Lun-Dim : 8:00 - 19:00</p>
            </div>
            <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
              <FontAwesomeIcon icon={faPhone} className="text-mocha text-2xl mb-2" />
              <p className="font-bold mb-1">Appelez-nous</p>
              <p>+33 0601020304</p>
            </div>
          </div>
        </section>

        {/* Form + Map */}
        <section className="container mx-auto max-w-7xl px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div>
              <h5 className="text-xl font-bold mb-4">Entrer en contact avec nous</h5>
              {submitStatus && (
                <div className={`mb-4 p-4 rounded ${submitStatus === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  <div className="flex items-start">
                    {submitStatus === 'error' && (
                      <FontAwesomeIcon icon={faExclamationCircle} className="mt-1 mr-3 flex-shrink-0" />
                    )}
                    <p>{submitMessage}</p>
                  </div>
                </div>
              )}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Votre Nom*" 
                    required 
                    className={`w-full border p-3 rounded focus:outline-none ${errors.name ? 'border-red-500' : 'border-[#b47b56]'}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                <div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Votre Mail*" 
                    required 
                    className={`w-full border p-3 rounded focus:outline-none ${errors.email ? 'border-red-500' : 'border-[#b47b56]'}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                </div>
                
                <div>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="Votre Numéro" 
                    className="w-full border border-[#b47b56] p-3 rounded focus:outline-none" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="Sujet*" 
                    required 
                    className={`w-full border p-3 rounded focus:outline-none ${errors.subject ? 'border-red-500' : 'border-[#b47b56]'}`}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {errors.subject && <p className="mt-1 text-red-500 text-sm">{errors.subject}</p>}
                </div>
                
                <div>
                  <textarea 
                    rows="5" 
                    name="message"
                    placeholder="Message*" 
                    required 
                    className={`w-full border p-3 rounded focus:outline-none resize-none ${errors.message ? 'border-red-500' : 'border-[#b47b56]'}`}
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message}</p>}
                </div>
                
                <button 
                  type="submit" 
                  className="bg-[#b47b56] text-white py-3 px-6 rounded w-full hover:bg-[#a06a49] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyez votre message'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h5 className="text-xl font-bold mb-4">Localisation</h5>
              <div className="border border-[#b47b56] rounded w-full h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.7382713622317!2d2.4320944156733535!3d48.8474690792864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e612df9f01555f%3A0x6de2efb9b2c4d1d4!2s22%20Rue%20des%20Vignerons%2C%2094300%20Vincennes%2C%20France!5e0!3m2!1sfr!2sfr!4v1719320372831!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}