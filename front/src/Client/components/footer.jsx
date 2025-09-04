import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    
    <footer className="bg-[#445A6E] text-[#DCDCDC] px-6 py-1 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Section SAILINGLOC */}
        <div>
          <h3 className="text-xl font-bold mb-4 uppercase">SAILINGLOC</h3>
          <p className="text-sm leading-relaxed mb-6">
            Suivez-nous sur les réseaux sociaux et plongez dans l'univers SailingLoc. Partagez vos expériences, découvrez nos meilleurs destinations et restez informé des nouveautés
          </p>
          <div className="flex space-x-4">
            <a  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59] text-white hover:bg-[#AD7C59] hover:text-white transition-colors duration-300">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59] text-white hover:bg-[#AD7C59] hover:text-white transition-colors duration-300">
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </a>
            <a  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#AD7C59] text-white hover:bg-[#AD7C59] hover:text-white transition-colors duration-300">
              <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
            </a>
          </div>
        </div>

        {/* Section Liens Rapides */}
        <div>
          <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">À Propos</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">CGU</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">Mentions Légales</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">Politique des Cookies</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">Politiques de Confidentialité</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">Plan du site</a>
            </li>
            <li className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#DCDCDC] rounded-full mr-3"></span>
              <a href="#" className="hover:text-[#C88C50] transition-colors">Contact</a>
            </li>
          </ul>
        </div>

        {/* Section Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Ne manquez aucune opportunité</h3>
          <p className="text-sm mb-6 leading-relaxed">
            Inscrivez-vous à notre newsletter et recevez en avant-première les meilleures offres de location, conseils de navigation et actualités exclusives.
          </p>
          <form className="w-full max-w-sm">
            <div className="flex">
              <input
                type="email"
                placeholder="Entrez votre email"
                className="flex-1 p-3 px-4 text-sm bg-[#445A6E] text-[#DCDCDC] placeholder-[#DCDCDC] border border-[#C88C50] rounded-l-lg focus:outline-none focus:border-[#C88C50]"
              />
              <button
                type="submit"
                className="bg-[#C88C50] text-white px-4 py-3 rounded-r-lg border border-[#C88C50] border-l-0 flex items-center justify-center hover:bg-[#B07A40] transition-colors"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-12 pt-6 border-t border-[#506A80]">
        <p className="text-center text-xs text-[#DCDCDC]">
          ©2025 Pandawan. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;