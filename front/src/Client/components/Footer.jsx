const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne 1 : Réseaux sociaux */}
        <div>
          <h2 className="text-lg font-bold mb-2">SAILINGLOC</h2>
          <p className="text-sm">Suivez-nous sur les réseaux sociaux et plongez dans l'univers SailingLoc.</p>
          <div className="flex gap-4 mt-4">
            <a href="#"><img src="/instagram-icon.png" alt="Instagram" className="h-6" /></a>
            <a href="#"><img src="/facebook-icon.png" alt="Facebook" className="h-6" /></a>
            <a href="#"><img src="/linkedin-icon.png" alt="LinkedIn" className="h-6" /></a>
          </div>
        </div>

        {/* Colonne 2 : Liens rapides */}
        <div>
          <h2 className="text-lg font-bold mb-2">Liens Rapides</h2>
          <ul className="space-y-1 text-sm">
            <li><a href="#">À Propos</a></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Mentions Légales</a></li>
            <li><a href="#">Politique des Cookies</a></li>
            <li><a href="#">Politique de Confidentialité</a></li>
            <li><a href="#">Plan du site</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Newsletter */}
        <div>
          <h2 className="text-lg font-bold mb-2">Ne manquez aucune opportunité</h2>
          <p className="text-sm">Inscrivez-vous à notre newsletter et recevez les meilleures offres.</p>
          <form className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Entrez votre email"
              className="p-2 rounded text-black flex-1"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 transition text-white px-4 py-2 rounded"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-300">
        ©2023 Pandawan. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
