import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import Footer from "../../components/common/Footer";
import { fetchPorts } from "../../services/portServices";

const Destinations = () => {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les ports depuis l'API
  useEffect(() => {
    const loadPorts = async () => {
      try {
        console.log('🔄 Chargement des ports depuis l\'API...');
        setLoading(true);
        setError(null);
        
        const response = await fetchPorts();
        console.log('✅ Réponse de l\'API:', response);
        
        // Transformer les données si nécessaire
        const transformedPorts = response.map(port => ({
          id: port.id,
          name: port.name,
          city: port.city || 'Ville non spécifiée',
          country: port.country || 'Pays non spécifié',
          description: port.description || '',
          latitude: port.latitude,
          longitude: port.longitude
        }));
        
        console.log('✅ Ports transformés:', transformedPorts);
        setPorts(transformedPorts);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des ports:', error);
        setError('Impossible de charger les destinations. Veuillez réessayer.');
        
        // En cas d'erreur, utiliser des données de fallback
        setPorts([
          { id: 1, name: "Port de Nice", city: "Nice", country: "France" },
          { id: 2, name: "Port de Cannes", city: "Cannes", country: "France" },
          { id: 3, name: "Port de Monaco", city: "Monaco", country: "Monaco" },
          { id: 4, name: "Port de Saint-Tropez", city: "Saint-Tropez", country: "France" },
          { id: 5, name: "Port de Antibes", city: "Antibes", country: "France" },
          { id: 6, name: "Port de Menton", city: "Menton", country: "France" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadPorts();
  }, []);

  // Affichage de chargement
  if (loading) {
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
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="text-4xl text-[#AD7C59] animate-spin"
            />
            <span className="ml-3 text-lg text-gray-600">Chargement des destinations...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
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
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#AD7C59] text-white px-4 py-2 rounded-lg hover:bg-[#B07A40] transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

        {ports.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">Aucune destination disponible pour le moment.</p>
            </div>
          </div>
        ) : (
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Destinations;