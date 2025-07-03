import { useEffect, useState } from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#b47b56]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <ScrollToTop />

      {/* Header Banner */}
      <section className="h-[60vh] bg-cover bg-center flex flex-col justify-center items-center text-center relative" style={{ backgroundImage: "url('/images/hero.jpeg')" }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <h6 className="text-lg text-white z-10">SAILINGLOC</h6>
        <h1 className="text-4xl text-white font-bold z-10">A Propos de Nous</h1>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-[#b47b56] mb-2">À propos de SailingLoc</h3>
          <h2 className="text-3xl font-bold mb-4">Naviguez librement, <span className="text-[#b47b56]">Entre passionnés</span></h2>
          <p className="mb-4">Chez SailingLoc, nous mettons en relation les amoureux de la mer pour faciliter la location de voiliers et de bateaux à moteur entre particuliers. Que vous soyez marin expérimenté ou aventurier en quête de découverte, notre plateforme vous accompagne pour une expérience simple, sécurisée et conviviale sur l’eau.</p>
          <p className="mb-6">Découvrez une nouvelle façon de naviguer avec une communauté qui partage la même passion et l’envie d’explorer les horizons en toute liberté.</p>
          <ul className="space-y-3">
            {["Nous facilitons la location entre particuliers", "Une communauté passionnée pour une navigation simple et sécurisée"].map((text, idx) => (
              <li key={idx} className="flex items-start">
                <FontAwesomeIcon icon={faCheck} className="text-[#b47b56] mt-1 mr-3" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-80 bg-gray-700 rounded-lg"></div> {/* Placeholder image */}
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h3 className="text-[#b47b56] mb-2">Témoignages</h3>
        <h2 className="text-3xl font-bold mb-10">Ce que disent les clients</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Louer un voilier via SailingLoc a été une expérience incroyable. Le bateau était en excellent état, et le processus de réservation était fluide. Nous avons passé une semaine magique à explorer la côte méditerranéenne.", "Nous avons loué un catamaran pour un week-end entre amis, et tout était parfait ! L’équipe de SailingLoc nous a accompagnés à chaque étape, et le bateau était spacieux et confortable. Une expérience à refaire !", "C’était ma première location de bateau, et SailingLoc m’a vraiment facilité la tâche. Le site est intuitif, et j’ai trouvé exactement ce que je cherchais en quelques clics. Le bateau était conforme à la description, et la prise en main s’est faite sans souci."].map((text, idx) => (
            <div key={idx} className="bg-[#b47b56] p-6 rounded shadow flex flex-col justify-between">
              <p className="text-gray-300 mb-4">"{text}"</p>
              <div className="mt-4">
                <h6 className="font-semibold">Client satisfait</h6>
                <p className="text-sm text-white">Customer</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h3 className="text-[#b47b56] mb-2">Équipe SailingLoc</h3>
        <h2 className="text-3xl font-bold mb-10">Notre équipe d'ouvrage</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Paul Voisin", "Sophie Martel", "Julien Morel"].map((name, idx) => (
            <div key={idx} className="flex flex-col items-center bg-[#b47b56] p-6 rounded shadow">
              <div className="w-40 h-40 bg-gray-600 rounded-full mb-4"></div> {/* Placeholder image */}
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-white">{idx === 0 ? "Fondateur et Directeur Général de SailingLoc" : idx === 1 ? "Responsable Marketing et Communication" : "Responsable Commercial"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
