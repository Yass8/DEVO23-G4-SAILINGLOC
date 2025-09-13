import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faServer, faCopyright, faShieldAlt, faCookie, faExclamationTriangle, faExternalLinkAlt, faGavel, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const MentionsLegales = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon icon={faBuilding} className="text-4xl text-[#AD7C59] mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentions Légales – SailingLoc</h1>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faBuilding} className="text-[#AD7C59] mr-3" />
                I – Éditeur du site
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Nom de la société :</strong> SailingLoc</p>
                    <p className="text-gray-600 mb-2"><strong>Forme juridique :</strong> SAS</p>
                    <p className="text-gray-600 mb-2"><strong>Siège social :</strong> 123, Quai des Navigateurs, 75000 Paris, France</p>
                    <p className="text-gray-600 mb-2"><strong>Capital social :</strong> 100 000 €</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2"><strong>Numéro RCS :</strong> Paris B 123 456 789</p>
                    <p className="text-gray-600 mb-2"><strong>Numéro SIREN :</strong> 123 456 789</p>
                    <p className="text-gray-600 mb-2"><strong>TVA intracommunautaire :</strong> FR 12 123456789</p>
                    <p className="text-gray-600 mb-2"><strong>Directeur de publication :</strong> M. Paul Voisin</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 mb-2"><strong>Email :</strong> 
                    <a href="mailto:info@sailingloc.com" className="text-[#AD7C59] hover:underline ml-1">
                      info@sailingloc.com
                    </a>
                  </p>
                  <p className="text-gray-600"><strong>Téléphone :</strong> +33 0601020304</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUser} className="text-[#AD7C59] mr-3" />
                II – Directeur de publication
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-2"><strong>Nom :</strong> Paul Voisin</p>
                <p className="text-gray-600"><strong>Contact :</strong> 
                  <a href="mailto:paul.voisin@sailingloc.com" className="text-[#AD7C59] hover:underline ml-1">
                    paul.voisin@sailingloc.com
                  </a>
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faServer} className="text-[#AD7C59] mr-3" />
                III – Hébergeur
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-2"><strong>Nom de l'hébergeur :</strong> IONOS SARL</p>
                <p className="text-gray-600 mb-2"><strong>Adresse :</strong> 7, place de la Gare, BP 70109, 57201 Sarreguemines Cedex, France</p>
                <p className="text-gray-600"><strong>Téléphone :</strong> +33 9 70 80 89 11</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCopyright} className="text-[#AD7C59] mr-3" />
                IV – Propriété Intellectuelle
              </h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-700 mb-4">
                  Le Site et son contenu (textes, images, logos, vidéos, etc.) sont la propriété exclusive de SailingLoc ou de ses partenaires et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
                </p>
                <p className="text-gray-700">
                  Toute reproduction, distribution ou utilisation non autorisée du contenu, totale ou partielle, est strictement interdite sans l'accord écrit préalable de SailingLoc.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#AD7C59] mr-3" />
                V – Données Personnelles
              </h2>
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  SailingLoc s'engage à protéger vos données personnelles conformément au RGPD et à sa 
                  <a href="/politique-confidentialite" className="text-[#AD7C59] hover:underline ml-1">
                    [Politique de Confidentialité]
                  </a>.
                </p>
                <p className="text-gray-600 mb-4">
                  Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition au traitement de vos données.
                </p>
                <p className="text-gray-600">
                  Pour exercer ces droits, contactez-nous à : 
                  <a href="mailto:dataprivacy@sailingloc.com" className="text-[#AD7C59] hover:underline ml-1">
                    dataprivacy@sailingloc.com
                  </a>.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCookie} className="text-[#AD7C59] mr-3" />
                VI – Cookies
              </h2>
              <div className="bg-orange-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  Le Site utilise des cookies pour améliorer l'expérience utilisateur et mesurer l'audience.
                </p>
                <p className="text-gray-600">
                  Pour en savoir plus sur leur utilisation et vos choix, consultez notre 
                  <a href="/politique-cookies" className="text-[#AD7C59] hover:underline ml-1">
                    [Politique relative aux Cookies]
                  </a>.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-[#AD7C59] mr-3" />
                VII – Limitation de Responsabilité
              </h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <p className="text-gray-700 mb-4">
                  SailingLoc met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur le Site.
                </p>
                <p className="text-gray-700 mb-4">
                  Cependant, SailingLoc ne saurait être tenue responsable d'erreurs, d'omissions ou de tout préjudice direct ou indirect résultant de l'accès ou de l'utilisation du Site.
                </p>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 font-semibold">
                    ⚠️ <strong>Important – Projet fictif :</strong>
                  </p>
                  <p className="text-yellow-800 mt-2">
                    Le site SailingLoc est un projet étudiant fictif réalisé dans le cadre d'un exercice pédagogique.
                  </p>
                  <p className="text-yellow-800">
                    Aucune transaction réelle, réservation ou achat ne peut être effectué via ce site.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-[#AD7C59] mr-3" />
                VIII – Liens Externes
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  Le Site peut contenir des liens hypertextes vers des sites tiers.
                </p>
                <p className="text-gray-600">
                  SailingLoc n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur fonctionnement ou leur politique de protection des données.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faGavel} className="text-[#AD7C59] mr-3" />
                IX – Loi Applicable et Juridiction Compétente
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  Les présentes mentions légales sont régies par le droit français.
                </p>
                <p className="text-gray-600">
                  En cas de litige, compétence exclusive est attribuée aux tribunaux compétents de Paris.
                </p>
              </div>

              <div className="bg-[#AD7C59] text-white p-6 rounded-lg text-center">
                <FontAwesomeIcon icon={faCalendar} className="text-2xl mb-2" />
                <p className="text-white font-semibold">
                  📅 Date de dernière mise à jour : 2 mars 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentionsLegales;