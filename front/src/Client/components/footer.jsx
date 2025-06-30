import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="text-white py-3 px-4" style={{ backgroundColor: '#4B6A88' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">

        <div>
          <h2 className="text-base font-bold mb-1">SAILINGLOC</h2>
          <p className="text-xs">Suivez-nous sur les réseaux sociaux et plongez dans l'univers SailingLoc.</p>
          <div className="flex gap-2 mt-2">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faInstagram} className="text-white text-xl" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faFacebookF} className="text-white text-xl" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faLinkedinIn} className="text-white text-xl" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold mb-1">Liens Rapides</h2>
          <ul className="space-y-0.5 text-xs">
            <li><a href="#">À Propos</a></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Mentions Légales</a></li>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">Plan du site</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold mb-1">Ne manquez rien</h2>
          <p className="text-xs">Recevez nos meilleures offres par email.</p>
          <form className="mt-2 flex flex-col sm:flex-row gap-1">
            <div className="relative flex items-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  className="w-full p-2 pr-12 text-xs text-black rounded-md border"
                  style={{ borderColor: '#AD7C59' }}
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-[#AD7C59] bg-transparent"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-white text-base" style={{ transform: 'rotate(-45deg)' }} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-300">
        ©2023 Pandawan. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
