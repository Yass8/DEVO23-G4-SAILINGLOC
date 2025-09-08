import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import Footer from "../../components/common/Footer";

const Destinations = () => {
  // Données de test (sans backend)
  const ports = [
    { id: 1, name: "Port de Nice", city: "Nice", country: "France" },
    { id: 2, name: "Port de Cannes", city: "Cannes", country: "France" },
    { id: 3, name: "Port de Monaco", city: "Monaco", country: "Monaco" },
    { id: 4, name: "Port de Saint-Tropez", city: "Saint-Tropez", country: "France" },
    { id: 5, name: "Port de Antibes", city: "Antibes", country: "France" },
    { id: 6, name: "Port de Menton", city: "Menton", country: "France" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Banner />

      <main className="flex-grow py-14 px-6">
        <div className="text-center mb-12">
          <h5 className="text-xl md:text-xl text-black mb-2">
            Destinations Disponibles
          </h5>
          <p className="text-black font-bold text-sm md:text-base">
            Découvrez nos ports et choisissez votre destination de rêve
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {ports.map((port) => (
            <div key={port.id} className="flex flex-col space-y-3">
              <Link to={`/boats?port=${port.id}`}>
                <div className="w-full h-[12rem] bg-slate-blue rounded-[10px] hover:opacity-90 transition flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon 
                    icon={faMapMarkerAlt} 
                    className="text-white text-4xl"
                  />
                </div>
              </Link>
              <div className="text-center">
                <Link to={`/boats?port=${port.id}`}>
                  <span className="text-sm font-bold text-gray-800 hover:underline block">
                    {port.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {port.city}, {port.country}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Destinations;