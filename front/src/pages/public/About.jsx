import { useEffect, useState } from 'react';
import Preloader from '../../components/common/Preloader';
import ScrollToTop from '../../components/common/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import CarouselTestimonial from '../../components/common/CarouselTestimonial';
import { getTeams } from '../../services/teamServices';

export default function About() {

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams().then((data) => {
      setTeams(data);
    });
  }, []);

  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <Preloader />
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
          <h2 className="mb-2">À propos de SailingLoc</h2>
          <h3 className="text-3xl font-bold mb-4">Naviguez librement, Entre passionnés</h3>
          <p className="mb-4 text-justify">Chez SailingLoc, nous mettons en relation les amoureux de la mer pour faciliter la location de voiliers et de bateaux à moteur entre particuliers. Que vous soyez marin expérimenté ou aventurier en quête de découverte, notre plateforme vous accompagne pour une expérience simple, sécurisée et conviviale sur l’eau.</p>
          <p className="mb-6 text-justify">Découvrez une nouvelle façon de naviguer avec une communauté qui partage la même passion et l’envie d’explorer les horizons en toute liberté.</p>
          <ul className="space-y-3">
            {["Nous facilitons la location entre particuliers", "Une communauté passionnée pour une navigation simple et sécurisée"].map((text, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <FontAwesomeIcon icon={faCheck} className="text-[#b47b56] mt-1 mr-3" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-80 bg-[url('images/sailBoat.jpeg')] rounded-lg bg-cover"></div>
      </section>

      {/* Testimonials Section */}
      <CarouselTestimonial />

      {/* Team Section */}
      <section className="max-w-6xl mx-auto py-5 px-4 text-center">
        <h2 className="mb-2">Équipe SailingLoc</h2>
        <h3 className="text-3xl font-bold mb-10">Notre équipe d'ouvrage</h3>
        <div className="grid  lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {teams.map((team,index) => (            
            <div key={index}  className="bg-white border border-gray-200 rounded-lg shadow-sm">
                
                  <img src={team.image} alt={team.name} className="rounded-t-lg w-full object-cover" />
                <div className="p-5">
                  <div className="">
                    <h4 className="font-bold">{team.name}</h4>
                    <span className="ml-2 text-sm text-gray-500">{team.role}</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
        {/* <div key={idx} className="flex flex-col items-center bg-[#b47b56] p-6 rounded shadow">
              <div className="w-40 h-40 bg-gray-600 rounded-full mb-4"></div> 
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-white">{idx === 0 ? "Fondateur et Directeur Général de SailingLoc" : idx === 1 ? "Responsable Marketing et Communication" : "Responsable Commercial"}</p>
            </div> */}
      </section>
    </div>
  );
}
