import Header from "../../components/common/Header";
import Banner from "../../components/common/Banner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { fetchBoatTypes } from "../../services/boatTypeSevices";
import { useEffect } from "react";
import AnimatedSection from "../../components/common/AnimateCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Category = () => {
  const [types, setTypes] = useState([]);

  const loadTypes = async () => {
    try {
      const data = await fetchBoatTypes();
      setTypes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des types de bateaux :", error);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Banner activeBtn={true} />

      <main className="flex-grow py-14 px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h5 className="text-xl md:text-xl text-black mb-2">
              Catégories des Bateaux
            </h5>
            <p className="text-black font-bold text-sm md:text-base">
              Trouvez la catégorie de bateau qui correspond à votre besoin
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={500}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {types.map((cat, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Link to={`/boats?type=${cat.id}`}>
                  <img
                    src={`${API_BASE}${cat.photo_url}`}
                    alt={cat.name}
                    className="w-full h-[20rem] object-cover rounded-[10px] hover:opacity-90 transition"
                  />
                </Link>
                <div className="text-center">
                  <Link to={`/boats?type=${cat.id}`}>
                    <span className="text-sm font-bold text-gray-800 hover:underline">
                      {cat.name}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Category;
