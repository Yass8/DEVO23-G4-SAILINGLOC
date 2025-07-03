import Preloader from '../components/Preloader';
import ScrollToTop from '../components/ScrollToTop.jsx';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkerAlt, faClock, faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <div className="relative bg-[#f5f0e9] ">
      <Preloader />
      <ScrollToTop />
      {/* Header Banner */}
      <section
        className="text-center py-16 bg-cover bg-center flex flex-col justify-center items-center absolute w-full h-[60vh] top-[-16rem]"
        style={{ backgroundImage: "url('/images/hero.jpeg')" }}
      >
          <div className="absolute inset-0 bg-black/20"></div>
          <h6 className="text-lg text-white z-10">ENTRER EN CONTACT AVEC NOUS</h6>
          <h1 className="text-4xl text-white font-bold z-10">Contact</h1>
      </section>

      {/* Contact Info */}
      <section className="relative z-10 mt-64 container mx-auto max-w-7xl py-8 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59] text-2xl mb-2" />
            <p className="font-bold mb-1">Envoyez-nous un mail</p>
            <p>info@sailingloc.com</p>
          </div>
          <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[#AD7C59] text-2xl mb-2" />
            <p className="font-bold mb-1">Notre adresse</p>
            <p>123, Quai des Navigateurs, 75000 Paris</p>
          </div>
          <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
            <FontAwesomeIcon icon={faClock} className="text-[#AD7C59] text-2xl mb-2" />
            <p className="font-bold mb-1">Heures d’ouverture</p>
            <p>Lun-Dim : 8:00 - 19:00</p>
          </div>
          <div className="p-6 rounded-lg bg-white hover:shadow-lg hover:bg-[#f5f0e9] transition">
            <FontAwesomeIcon icon={faPhone} className="text-[#AD7C59] text-2xl mb-2" />
            <p className="font-bold mb-1">Appelez-nous</p>
            <p>+33 0601020304</p>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="relative z-10 container mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h5 className="text-xl font-bold mb-4">Entrer en contact avec nous</h5>
            <form className="space-y-4">
              <input type="text" placeholder="Votre Nom*" required className="w-full border border-[#b47b56] p-3 rounded focus:outline-none" />
              <input type="email" placeholder="Votre Mail*" required className="w-full border border-[#b47b56] p-3 rounded focus:outline-none" />
              <input type="text" placeholder="Votre Numéro" className="w-full border border-[#b47b56] p-3 rounded focus:outline-none" />
              <input type="text" placeholder="Sujet*" required className="w-full border border-[#b47b56] p-3 rounded focus:outline-none" />
              <textarea rows="5" placeholder="Message*" required className="w-full border border-[#b47b56] p-3 rounded focus:outline-none resize-none"></textarea>
              <button type="submit" className="bg-[#b47b56] text-white py-3 px-6 rounded w-full hover:bg-[#a06a49] transition">
                Envoyez votre message
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
    </div>
  );
}
