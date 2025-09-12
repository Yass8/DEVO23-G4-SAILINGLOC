import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faGlobe, faGavel, faEnvelope, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PolitiqueConfidentialite = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-[#AD7C59] mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Politique de Confidentialité – SailingLoc</h1>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <span>Entrée en vigueur : 02 mars 2025</span>
                <span>•</span>
                <span>Dernière mise à jour : 05 mars 2025</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-gray-700">
                  SailingLoc et ses entités affiliées (ci-après « <strong>SailingLoc</strong> », « <strong>nous</strong> », « <strong>notre</strong> ») attachent une grande importance à la protection de votre vie privée et s'engagent à respecter la présente Politique de Confidentialité.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cette politique décrit :</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>les informations que nous collectons à votre sujet,</li>
                  <li>la manière dont nous les utilisons,</li>
                  <li>avec qui nous pouvons les partager,</li>
                  <li>et vos droits en matière de protection des données.</li>
                </ul>
              </div>

              <p className="text-gray-600 mb-4">
                Elle s'applique à l'utilisation de notre site internet [www.sailingloc.com], de notre application mobile « SailingLoc – Location de bateaux » (ci-après le « <strong>Système</strong> »), ainsi qu'aux interactions avec nos services, programmes de fidélité, processus de recrutement et échanges sur les réseaux sociaux.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Important :</strong> La Politique de Confidentialité fait partie intégrante de la relation contractuelle que SailingLoc entretient avec ses utilisateurs, clients et partenaires.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUserShield} className="text-[#AD7C59] mr-3" />
                I. Données Personnelles Collectées
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Informations fournies directement par l'utilisateur</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Coordonnées</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• nom, prénom</li>
                      <li>• adresse e-mail</li>
                      <li>• numéro de téléphone</li>
                      <li>• adresse postale</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Compte utilisateur</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• identifiant, mot de passe</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 md:col-span-2">
                    <h4 className="font-semibold text-purple-800 mb-2">Informations supplémentaires</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• date de naissance, permis bateau, photographie</li>
                      <li>• moyens de paiement (cryptés), adresse de facturation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Informations collectées automatiquement</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Données de navigation</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• pages consultées</li>
                      <li>• dates et heures de connexion</li>
                      <li>• URL de provenance</li>
                      <li>• type de navigateur, fournisseur d'accès</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Données techniques</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• adresse IP</li>
                      <li>• marque et modèle de l'appareil</li>
                      <li>• système d'exploitation</li>
                      <li>• identifiants uniques</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCog} className="text-[#AD7C59] mr-3" />
                II. Utilisation des Données Personnelles
              </h2>
              <p className="text-gray-600 mb-4">Vos Données Personnelles sont utilisées pour :</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Gestion des comptes : création, administration et sécurisation de votre compte</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Réservations et contrats : traitement des réservations, paiements, dépôts de garantie et contrats de location</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Relation client : assistance, gestion des avis, réponses aux demandes</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Marketing : envoi de newsletters, campagnes ciblées, notifications push (avec consentement)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Sécurité : prévention des fraudes, détection d'activités suspectes</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Conformité légale : obligations fiscales, comptables et réglementaires</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faLock} className="text-[#AD7C59] mr-3" />
                III. Conservation des Données
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Compte utilisateur :</strong> conservé tant que le compte est actif, puis supprimé après 3 ans d'inactivité</li>
                  <li><strong>Transactions et factures :</strong> 10 ans (obligations légales)</li>
                  <li><strong>Cookies et traceurs :</strong> 13 mois maximum</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faGlobe} className="text-[#AD7C59] mr-3" />
                IV. Partage des Données
              </h2>
              <p className="text-gray-600 mb-4">Vos données peuvent être partagées uniquement avec :</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Prestataires de services (hébergement IONOS, paiements Stripe, prestataires techniques)</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Propriétaires / Locataires pour exécuter une réservation</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Partenaires commerciaux (avec consentement préalable, ex. assurances ou partenaires nautiques)</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600">Autorités légales si la loi l'exige</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">
                   SailingLoc ne revend pas vos données personnelles.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#AD7C59] mr-3" />
                V. Sécurité des Données
              </h2>
              <p className="text-gray-600 mb-4">SailingLoc met en œuvre des mesures adaptées :</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Chiffrement SSL/TLS pour toutes les communications</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Stockage sécurisé des données sur serveurs en Union Européenne</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Contrôle d'accès restreint aux seules personnes autorisées</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600">Sauvegardes régulières et procédures anti-intrusion</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faGlobe} className="text-[#AD7C59] mr-3" />
                VI. Transferts Internationaux
              </h2>
              <p className="text-gray-600 mb-6">
                En cas de transfert hors Union Européenne, SailingLoc s'assure que le destinataire applique un niveau de protection conforme au RGPD (clauses contractuelles types, décision d'adéquation, etc.).
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faGavel} className="text-[#AD7C59] mr-3" />
                VII. Vos Droits
              </h2>
              <p className="text-gray-600 mb-4">
                Conformément au RGPD et à la Loi Informatique et Libertés, vous disposez de droits :
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mr-3"></span>
                    <span className="text-gray-600">Accès à vos données</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mr-3"></span>
                    <span className="text-gray-600">Rectification des données inexactes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mr-3"></span>
                    <span className="text-gray-600">Effacement (« droit à l'oubli »)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mr-3"></span>
                    <span className="text-gray-600">Limitation ou opposition à certains traitements</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[#AD7C59] rounded-full mr-3"></span>
                    <span className="text-gray-600">Portabilité de vos données dans un format structuré</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#AD7C59] text-white p-6 rounded-lg mb-6">
                <p className="text-white mb-4">
                  <strong>Pour exercer vos droits :</strong> 
                  <a href="mailto:dataprivacy@sailingloc.com" className="text-white hover:underline ml-1">
                    dataprivacy@sailingloc.com
                  </a>
                </p>
                <p className="text-white mb-4">
                  <strong></strong> SailingLoc – Direction Générale, Protection des Données, 123 Quai des Navigateurs, 75000 Paris, France
                </p>
                <p className="text-white">
                  Vous pouvez également introduire une réclamation auprès de la 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-white hover:underline ml-1">
                    CNIL (www.cnil.fr)
                  </a>.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">VIII. Modifications de la Politique</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>SailingLoc peut modifier la présente Politique pour se conformer à la réglementation ou améliorer ses pratiques</li>
                <li>En cas de modification substantielle, les utilisateurs seront informés par e-mail ou notification</li>
                <li>En cas de modification mineure, seule la date de mise à jour sera modifiée</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59] mr-3" />
                IX. Contact
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Pour toute question relative à la présente Politique de Confidentialité :
                </p>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="mr-3"></span>
                    <a href="mailto:dataprivacy@sailingloc.com" className="text-[#AD7C59] hover:underline">
                      dataprivacy@sailingloc.com
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-3"></span>
                    <span className="text-gray-600">
                      SailingLoc – Direction Générale, Protection des Données, 123 Quai des Navigateurs, 75000 Paris, France
                    </span>
                  </p>
                  <div className="flex space-x-4 text-sm text-gray-500 mt-4">
                    <span>Entrée en vigueur : 02 mars 2025</span>
                    <span> Dernière mise à jour : 05 mars 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;