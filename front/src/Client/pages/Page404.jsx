import { useEffect, useState } from 'react';
import Preloader from '../components/Preloader';
import ScrollToTop from '../components/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default function Page404() {
  return (
    <div className="bg-[#f5f0e9] text-black min-h-screen flex flex-col">
      <Preloader />
      <ScrollToTop />

      {/* Header Banner */}
      <section className="h-[60vh] bg-cover bg-center flex flex-col justify-center items-center text-center relative" style={{ backgroundImage: "url('/images/hero.jpeg')" }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <h6 className="text-lg text-white z-10">SAILINGLOC</h6>
        <h1 className="text-4xl text-white font-bold z-10">Page introuvable</h1>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-10 bg-[#b47b56]"></div>
      </div>
      <br /><br />
      {/* Not Found Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-8xl font-bold text-gray-700">404</h1>
        <h3 className="text-2xl font-semibold mt-4">Désolé, nous ne trouvons pas cette page !</h3>
        <p className="text-gray-400 max-w-md mt-2">
          La page que vous recherchez a été déplacée, supprimée, renommée ou n'a jamais existé.
        </p>
      </section>

      {/* Divider */}
      <div className="flex justify-center my-6">
        <div className="w-px h-10 bg-[#b47b56]"></div>
      </div>

      {/* Footer Contact */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[{
          icon: faPhone,
          title: "Appelez-nous",
          text: "+33 0601020304",
        }, {
          icon: faEnvelope,
          title: "Envoyez-nous un mail",
          text: "info@sailingloc.com",
        }, {
          icon: faMapMarkerAlt,
          title: "Notre adresse",
          text: "123, Quai des Navigateurs, 75000",
        }].map((item, index) => (
          <div key={index} className="flex items-center p-6 ">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#b47b56] text-white mr-4">
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </div>
            <div className="text-left">
              <h6 className="font-semibold text-black">{item.title}</h6>
              <p className="text-[#b47b56]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}