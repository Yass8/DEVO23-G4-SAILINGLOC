import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSitemap, faHome, faUser, faShip, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const PlanDuSite = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon icon={faSitemap} className="text-4xl text-[#AD7C59] mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Plan du Site</h1>
              <p className="text-gray-600">Découvrez l'organisation de notre site SailingLoc</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pages publiques */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faHome} className="mr-3" />
                  Pages Publiques
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="/home" className="hover:text-[#AD7C59] transition-colors">Accueil</a></li>
                  <li><a href="/about" className="hover:text-[#AD7C59] transition-colors">À Propos</a></li>
                  <li><a href="/boats" className="hover:text-[#AD7C59] transition-colors">Nos Bateaux</a></li>
                  <li><a href="/destination" className="hover:text-[#AD7C59] transition-colors">Destinations</a></li>
                  <li><a href="/contact" className="hover:text-[#AD7C59] transition-colors">Contact</a></li>
                  <li><a href="/login" className="hover:text-[#AD7C59] transition-colors">Connexion</a></li>
                  <li><a href="/register" className="hover:text-[#AD7C59] transition-colors">Inscription</a></li>
                </ul>
              </div>

              {/* Espace client */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-3" />
                  Espace Client
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="/my-space/dashboard" className="hover:text-[#AD7C59] transition-colors">Tableau de bord</a></li>
                  <li><a href="/my-space/boats" className="hover:text-[#AD7C59] transition-colors">Mes Bateaux</a></li>
                  <li><a href="/my-space/reservations" className="hover:text-[#AD7C59] transition-colors">Mes Réservations</a></li>
                  <li><a href="/my-space/messages" className="hover:text-[#AD7C59] transition-colors">Messages</a></li>
                  <li><a href="/my-space/profil" className="hover:text-[#AD7C59] transition-colors">Profil</a></li>
                  <li><a href="/my-space/documents" className="hover:text-[#AD7C59] transition-colors">Documents</a></li>
                </ul>
              </div>

              {/* Administration */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faChartBar} className="mr-3" />
                  Administration
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="/admin/sl/dashboard" className="hover:text-[#AD7C59] transition-colors">Tableau de bord</a></li>
                  <li><a href="/admin/sl/users" className="hover:text-[#AD7C59] transition-colors">Utilisateurs</a></li>
                  <li><a href="/admin/sl/boats" className="hover:text-[#AD7C59] transition-colors">Bateaux</a></li>
                  <li><a href="/admin/sl/reservations" className="hover:text-[#AD7C59] transition-colors">Réservations</a></li>
                  <li><a href="/admin/sl/contracts" className="hover:text-[#AD7C59] transition-colors">Contrats</a></li>
                  <li><a href="/admin/sl/payments" className="hover:text-[#AD7C59] transition-colors">Paiements</a></li>
                  <li><a href="/admin/sl/messages" className="hover:text-[#AD7C59] transition-colors">Messages</a></li>
                </ul>
              </div>

              {/* Informations légales */}
              <div className="bg-orange-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faCog} className="mr-3" />
                  Informations Légales
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="/cgu" className="hover:text-[#AD7C59] transition-colors">CGU</a></li>
                  <li><a href="/mentions-legales" className="hover:text-[#AD7C59] transition-colors">Mentions Légales</a></li>
                  <li><a href="/politique-cookies" className="hover:text-[#AD7C59] transition-colors">Politique des Cookies</a></li>
                  <li><a href="/politique-confidentialite" className="hover:text-[#AD7C59] transition-colors">Politique de Confidentialité</a></li>
                  <li><a href="/plan-du-site" className="hover:text-[#AD7C59] transition-colors">Plan du Site</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PlanDuSite;