import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faAnchor, faUsers, faShieldAlt, faCreditCard, faExclamationTriangle, faLock, faCopyright, faGavel, faEnvelope, faCalendar, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const CGU = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <FontAwesomeIcon icon={faFileContract} className="text-4xl text-[#AD7C59] mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Termes et Conditions Générales d'Utilisation du Service « SailingLoc »</h1>
              <p className="text-gray-600">Date d'entrée en vigueur : 2 Mars 2025</p>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faAnchor} className="text-[#AD7C59] mr-3" />
                1. Définitions
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  Les termes définis ci-dessous auront, dans les présentes conditions générales d'utilisation (ci-après les « <strong>CGU</strong> »), la signification qui leur est attribuée, qu'ils soient utilisés au singulier ou au pluriel.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p><strong>Annonce :</strong> Offre de location ou de co-navigation publiée par un Propriétaire sur le Site.</p>
                    <p><strong>Boat-Manager :</strong> Service d'intermédiation permettant la gestion des états des lieux, la signature des contrats de location et l'accueil des Locataires pour le compte des Propriétaires.</p>
                    <p><strong>CGU :</strong> Les présentes conditions générales d'utilisation.</p>
                    <p><strong>SailingLoc :</strong> Société SailingLoc, spécialisée dans la location de voiliers et bateaux à moteur entre particuliers.</p>
                    <p><strong>Co-Navigation :</strong> Activité de navigation où les frais de détention, d'entretien et d'usage de l'Embarcation sont partagés entre le Propriétaire et les participants.</p>
                    <p><strong>Commissions SailingLoc :</strong> Pourcentage prélevé sur le Prix Propriétaire en rémunération des services de SailingLoc.</p>
                    <p><strong>Frais de service :</strong> Frais liés au fonctionnement de la plateforme, incluant l'assistance client et les services techniques.</p>
                    <p><strong>Contenu :</strong> Tout texte, image, vidéo, information ou autre élément publié par les Utilisateurs sur le Site.</p>
                    <p><strong>Embarcation :</strong> Tout véhicule nautique proposé à la location sur le Site (voiliers, bateaux à moteur, catamarans, etc.).</p>
                    <p><strong>Locataire :</strong> Personne physique ou morale réservant une Embarcation pour une location ou une co-navigation.</p>
                    <p><strong>Location :</strong> Contrat de location d'une Embarcation entre un Propriétaire et un Locataire.</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Options Supplémentaires :</strong> Services additionnels proposés par le Propriétaire (ménage, literie, etc.).</p>
                    <p><strong>Prise en main :</strong> Moment où le Locataire prend possession de l'Embarcation au début de la location.</p>
                    <p><strong>État des lieux d'entrée :</strong> Document décrivant l'état de l'Embarcation au moment de la prise en main.</p>
                    <p><strong>État des lieux de sortie :</strong> Document décrivant l'état de l'Embarcation à la fin de la location.</p>
                    <p><strong>Prix Locataire :</strong> Prix total payé par le Locataire, incluant le Prix Propriétaire et les frais de service.</p>
                    <p><strong>Prix Propriétaire :</strong> Prix fixé par le Propriétaire pour la location de son Embarcation, incluant la commission SailingLoc.</p>
                    <p><strong>Propriétaire :</strong> Personne physique ou morale propriétaire d'une Embarcation proposée à la location sur le Site.</p>
                    <p><strong>Propriétaire Professionnel :</strong> Propriétaire exerçant une activité professionnelle de location d'Embarcations.</p>
                    <p><strong>Propriétaire Particulier :</strong> Propriétaire louant son Embarcation à titre non professionnel.</p>
                    <p><strong>Service :</strong> Service de mise en relation entre Propriétaires et Locataires pour la location ou la co-navigation d'Embarcations.</p>
                    <p><strong>Site :</strong> Plateforme en ligne accessible à l'adresse [www.sailingloc.fr] et l'application mobile « SailingLoc ».</p>
                    <p><strong>Utilisateur :</strong> Tout utilisateur du Site, qu'il soit Propriétaire ou Locataire.</p>
                    <p><strong>Annulation météo :</strong> Annulation d'une réservation en raison de conditions météorologiques défavorables.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="text-[#AD7C59] mr-3" />
                2. Acceptation des CGU
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 mb-4">
                  L'utilisation du Service et du Site est soumise aux présentes CGU. En cochant la case « J'accepte les conditions générales » lors de la création de son compte ou de la souscription d'une offre, l'Utilisateur accepte sans réserve les CGU. En cas de contradiction entre les informations présentes sur le Site et les CGU, ces dernières prévalent.
                </p>
                <p className="text-gray-600">
                  SailingLoc se réserve le droit de modifier les CGU à tout moment. Les modifications prendront effet dès leur publication sur le Site. La poursuite de l'utilisation du Site vaut acceptation des nouvelles CGU.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faAnchor} className="text-[#AD7C59] mr-3" />
                3. Objet du Service
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  SailingLoc propose un service de mise en relation entre Propriétaires et Locataires pour faciliter la location ou la co-navigation d'Embarcations. SailingLoc agit en tant qu'intermédiaire et n'est pas partie au contrat de location conclu entre les Utilisateurs. SailingLoc ne peut être tenue responsable des manquements des Utilisateurs à leurs obligations contractuelles.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#AD7C59] mr-3" />
                4. Accès au Service
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1. Capacité juridique</h3>
                <p className="text-gray-600 mb-4">
                  Le Service est réservé aux personnes majeures ou mineures émancipées, disposant de leur pleine capacité juridique, ainsi qu'aux personnes morales.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2. Création d'un compte</h3>
                <p className="text-gray-600">
                  Pour utiliser le Service, l'Utilisateur doit créer un compte en fournissant une adresse e-mail valide et un numéro de téléphone mobile. L'Utilisateur est responsable de la confidentialité de ses identifiants et s'engage à informer SailingLoc en cas de perte ou d'utilisation frauduleuse de ceux-ci.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCog} className="text-[#AD7C59] mr-3" />
                5. Utilisation du Service
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1. Publication d'une Annonce</h3>
                <p className="text-gray-600 mb-4">
                  Le Propriétaire peut publier une Annonce pour proposer son Embarcation à la location ou à la co-navigation. L'Annonce doit être précise et conforme à la réalité. Le Propriétaire s'engage à fournir des informations exactes sur l'Embarcation, ses caractéristiques, ses disponibilités et son prix.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2. Réservation</h3>
                <p className="text-gray-600 mb-4">
                  Le Locataire peut réserver une Embarcation en sélectionnant les dates et les options souhaitées. Le paiement du Prix Locataire est effectué par carte bancaire via la plateforme. Une fois la réservation confirmée, les coordonnées des Utilisateurs sont échangées pour faciliter la communication.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3. Assurance</h3>
                <p className="text-gray-600 mb-4">
                  Le Propriétaire s'engage à souscrire une assurance couvrant les activités de location ou de co-navigation. SailingLoc propose une assurance optionnelle pour les Locataires, dont les conditions sont disponibles sur le Site.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4. Dépôt de garantie</h3>
                <p className="text-gray-600 mb-4">
                  Le Propriétaire peut exiger un dépôt de garantie pour couvrir les éventuels dommages causés à l'Embarcation. Le montant du dépôt est précisé dans l'Annonce. En cas de dommage, le Propriétaire peut demander le prélèvement du dépôt de garantie.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.5. Évaluation des Utilisateurs</h3>
                <p className="text-gray-600">
                  Après chaque location, les Utilisateurs peuvent s'évaluer mutuellement via un système de notation et de commentaires. Les évaluations sont publiées sur le profil public de l'Utilisateur.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="text-[#AD7C59] mr-3" />
                6. Obligations des Utilisateurs
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1. Obligations du Propriétaire</h3>
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-600 mb-2">Le Propriétaire s'engage à :</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Fournir une Embarcation en bon état et conforme à la description de l'Annonce</li>
                    <li>Souscrire une assurance valide pour l'Embarcation</li>
                    <li>Respecter les formalités administratives et légales liées à la location</li>
                  </ul>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2. Obligations du Locataire</h3>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">Le Locataire s'engage à :</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Utiliser l'Embarcation de manière responsable et conforme à son objet</li>
                    <li>Respecter les conditions de location définies dans le contrat</li>
                    <li>Restituer l'Embarcation dans l'état où il l'a reçue</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-[#AD7C59] mr-3" />
                7. Annulation de la réservation
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1. Annulation par le Locataire</h3>
                <p className="text-gray-600 mb-4">
                  Le Locataire peut annuler une réservation selon les conditions définies dans l'Annonce. En cas d'annulation, le remboursement est effectué conformément à la politique d'annulation choisie par le Propriétaire.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2. Annulation par le Propriétaire</h3>
                <p className="text-gray-600 mb-4">
                  Le Propriétaire ne peut annuler une réservation qu'en cas de force majeure. En cas d'annulation injustifiée, le Propriétaire peut être sanctionné par SailingLoc.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3. Annulation pour cause météo</h3>
                <p className="text-gray-600">
                  En cas de conditions météorologiques défavorables, la réservation peut être annulée. Le Locataire sera remboursé intégralement.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCreditCard} className="text-[#AD7C59] mr-3" />
                8. Paiement
              </h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  Le paiement du Prix Locataire est effectué par carte bancaire via la plateforme. SailingLoc reverse au Propriétaire le Prix Propriétaire, déduction faite de la commission SailingLoc, dans les 24 heures suivant le début de la location. SailingLoc encaisse 10 % de chaque transaction sur le Prix Propriétaire.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faShieldAlt} className="text-[#AD7C59] mr-3" />
                9. Responsabilité
              </h2>
              <div className="bg-red-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  SailingLoc décline toute responsabilité en cas de litige entre les Utilisateurs. Les Utilisateurs sont seuls responsables du respect de leurs obligations contractuelles. SailingLoc ne peut être tenue responsable des dommages causés à l'Embarcation ou des accidents survenus pendant la location.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faLock} className="text-[#AD7C59] mr-3" />
                10. Données personnelles
              </h2>
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  SailingLoc collecte et traite les données personnelles des Utilisateurs conformément à sa 
                  <a href="/politique-confidentialite" className="text-[#AD7C59] hover:underline ml-1">
                    Politique de Confidentialité
                  </a>. Les Utilisateurs disposent d'un droit d'accès, de rectification et de suppression de leurs données.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCopyright} className="text-[#AD7C59] mr-3" />
                11. Propriété intellectuelle
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  Le Site et son contenu sont la propriété exclusive de SailingLoc. Les Utilisateurs s'engagent à ne pas reproduire, modifier ou exploiter les éléments du Site sans autorisation préalable.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faCog} className="text-[#AD7C59] mr-3" />
                12. Modification des CGU
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  SailingLoc se réserve le droit de modifier les CGU à tout moment. Les modifications seront notifiées aux Utilisateurs par e-mail ou via le Site.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faGavel} className="text-[#AD7C59] mr-3" />
                13. Loi applicable et juridiction compétente
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600">
                  Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis aux tribunaux compétents de Paris.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#AD7C59] mr-3" />
                Contact
              </h2>
              <div className="bg-[#AD7C59] text-white p-6 rounded-lg mb-6">
                <p className="text-white mb-4">
                  Pour toute question relative aux CGU, vous pouvez contacter SailingLoc à l'adresse suivante :
                </p>
                <div className="space-y-2">
                  <p className="text-white font-semibold">SailingLoc</p>
                  <p className="text-white">123, Quai des Navigateurs, 75000 Paris, France</p>
                  <p className="text-white">
                    <strong>Email :</strong> 
                    <a href="mailto:info@sailingloc.com" className="text-white hover:underline ml-1">
                      info@sailingloc.com
                    </a>
                  </p>
                  <p className="text-white"><strong>Téléphone :</strong> +33 0601020304</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <FontAwesomeIcon icon={faCalendar} className="text-2xl text-[#AD7C59] mb-2" />
                <p className="text-gray-700 font-semibold">
                  Date de dernière mise à jour : 02 Mars 2025
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

export default CGU;