import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-[#4B6A88] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        
        <div>
          <h3 className="text-lg font-semibold mb-2">SAILINGLOC</h3>
          <p className="text-sm leading-relaxed">
            Suivez-nous sur les réseaux sociaux et plongez dans l'univers SailingLoc.<br />
            Partagez vos expériences, découvrez nos meilleures destinations et restez informé des nouveautés.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-[#AD7C59]">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Liens Rapides</h3>
          <ul className="space-y-1 text-sm list-disc list-inside">
            <li><a href="#">À Propos</a></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Mentions Légales</a></li>
            <li><a href="#">Politique des Cookies</a></li>
            <li><a href="#">Politique de Confidentialité</a></li>
            <li><a href="#">Plan du site</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Ne manquez aucune opportunité</h3>
          <p className="text-sm mb-3">
            Inscrivez-vous à notre newsletter et recevez en avant première les meilleures offres de location, conseils de navigation et actualités exclusives.
          </p>
          <form className="w-full max-w-xs">
            <div className="flex">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="w-full p-2 px-4 text-sm text-black font-bold border border-[#AD7C59] rounded-l-full focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#AD7C59] text-white px-4 py-2 rounded-r-full border border-[#AD7C59] border-l-0 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-300 border-t border-gray-400 pt-4">
        ©2023 Pandawan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
