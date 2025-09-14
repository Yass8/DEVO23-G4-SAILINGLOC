import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faShieldAlt, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PolitiqueCookies = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon icon={faCookie} className="text-4xl text-[#AD7C59] mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Politique relative aux Cookies – SailingLoc</h1>
              <p className="text-gray-600">Entrée en vigueur le 2 mars 2025</p>
            </div>

            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-gray-700">
                  SailingLoc attache une grande importance à la protection de la vie privée et des données à caractère personnel (ci-après les « <strong>Données Personnelles</strong> ») des utilisateurs (ci-après les « <strong>Utilisateurs</strong> ») de son site internet [www.sailingloc.fr] et de son application mobile « SailingLoc – Location de bateaux » (ci-après ensemble le « <strong>Système</strong> »).
                </p>
                <p className="text-gray-700 mt-4">
                  La présente Politique relative aux Cookies (ci-après la « <strong>Politique Cookies</strong> ») vise à vous informer sur la manière dont SailingLoc, en tant que responsable de traitement, collecte vos Données Personnelles par le biais de cookies présents sur notre Système.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCog} className="text-[#AD7C59] mr-3" />
                I. Qu'est-ce qu'un cookie ?
              </h2>
              <p className="text-gray-600 mb-4">
                Un cookie est un fichier électronique déposé sur un terminal (ordinateur, tablette, smartphone, etc.) lors de la consultation d'un site internet ou d'une application. Il permet de reconnaître un utilisateur et de mémoriser ses préférences lors de ses visites.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Important :</strong> Lors de votre première navigation sur le Système SailingLoc, une bannière d'information s'affiche afin de recueillir votre consentement. En poursuivant votre navigation, vous acceptez l'utilisation des cookies conformément à la présente Politique.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#AD7C59] mr-3" />
                II. Les cookies utilisés par SailingLoc
              </h2>
              
              <div className="grid md:grid-cols-1 gap-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Cookies fonctionnels (indispensables)</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Assurent le bon fonctionnement du site (connexion sécurisée, réservation, navigation fluide)</li>
                    <li>• Ces cookies ne peuvent pas être désactivés</li>
                    <li>• <strong>Durée de conservation :</strong> 12 mois</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Cookies de mesure d'audience et statistiques</h3>
                  <p className="text-gray-600">Permettent d'analyser la fréquentation, de mesurer la performance et d'optimiser les contenus.</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Cookies émis par des tiers</h3>
                  <p className="text-gray-600">Certains partenaires (ex. : Google Analytics, Facebook Pixel) peuvent déposer des cookies à des fins de statistiques, de publicité ciblée et de mesure d'efficacité des campagnes.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faChartBar} className="text-[#AD7C59] mr-3" />
                III. Données collectées via les cookies
              </h2>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Adresse IP</li>
                <li>Identifiants mobiles publicitaires</li>
                <li>Historique de navigation (pages consultées, durée de visite)</li>
                <li>Système d'exploitation et type de navigateur</li>
                <li>Informations liées aux transactions éventuelles</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">IV. Gestion de vos cookies</h2>
              <p className="text-gray-600 mb-4">
                Vous pouvez gérer vos préférences directement depuis votre navigateur :
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                  <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#AD7C59] hover:underline">
                    instructions Apple
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#AD7C59] hover:underline">
                    instructions Google
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                  <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences" target="_blank" rel="noopener noreferrer" className="text-[#AD7C59] hover:underline">
                    instructions Mozilla
                  </a>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Opera</h4>
                  <a href="https://help.opera.com/en/latest/web-preferences/#cookies" target="_blank" rel="noopener noreferrer" className="text-[#AD7C59] hover:underline">
                    instructions Opera
                  </a>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">V. Durée de conservation</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>Cookies fonctionnels :</strong> 13 mois maximum (non prorogés automatiquement)</li>
                <li><strong>Cookies tiers :</strong> selon les politiques des partenaires concernés</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">VI. Liste indicative des cookies utilisés</h2>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nom du cookie</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Finalité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">sailingloc_session</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Maintien de la session utilisateur</td>
                      <td className="px-4 py-3 text-sm text-gray-600">24h (session)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">remember_user</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Mémorisation des préférences utilisateur</td>
                      <td className="px-4 py-3 text-sm text-gray-600">12 mois</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">_ga (Google)</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Statistiques Google Analytics</td>
                      <td className="px-4 py-3 text-sm text-gray-600">13 mois</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">_fbp (Meta/Facebook)</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Ciblage publicitaire et mesure d'efficacité</td>
                      <td className="px-4 py-3 text-sm text-gray-600">3 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">VII. Informations complémentaires</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>SailingLoc peut mettre à jour la présente Politique Cookies afin de prendre en compte les évolutions légales, techniques ou organisationnelles</li>
                <li>En cas de modification substantielle, vous en serez informé par e-mail ou notification directe</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">VIII. Contact</h2>
              <div className="bg-[#AD7C59] text-white p-6 rounded-lg">
                <p className="text-white mb-4">
                  Pour toute question relative aux cookies, vous pouvez nous écrire à :
                </p>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="mr-3">📧</span>
                    <a href="mailto:dataprivacy@sailingloc.com" className="text-white hover:underline">
                      dataprivacy@sailingloc.com
                    </a>
                  </p>
                  <p className="flex items-start">
                    <span className="mr-3">📮</span>
                    <span>
                      SailingLoc – Direction Générale, Protection des Données<br />
                      123 Quai des Navigateurs, 75000 Paris, France
                    </span>
                  </p>
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

export default PolitiqueCookies;