import React, { useState } from "react";
import { fetchBoatTypes } from "../../services/boatTypeSevices";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CarouselCategories = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Nombre d'éléments par page selon la taille d'écran
  const getItemsPerPage = () => {
    if (window.innerWidth < 768) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablette
    return 4; // Desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [types, setTypes] = useState([]);
  const navigate = useNavigate();
  // Met à jour automatiquement à chaque redimensionnement
  React.useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const totalPages = Math.ceil(types.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  let visibleItems = types.slice(startIndex, startIndex + itemsPerPage);

  if (visibleItems.length < itemsPerPage && types.length > 0) {
    const itemsToAdd = itemsPerPage - visibleItems.length;
    visibleItems = visibleItems.concat(types.slice(0, itemsToAdd));
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-center">Catégories de bateaux</h2>
      <h3 className="text-center">
        Trouvez le bateau qui correspond à votre besoin
      </h3>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
        {visibleItems.map((type, index) => (
          <div key={index} className="text-center">
            <img
              src={`${API_BASE}${type.photo_url}`}
              alt={type.name}
              onClick={() => navigate(`/boats?type=${type.id}`)}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <p className="mt-2 font-medium">
              <span
                onClick={() => navigate(`/boats?type=${type.id}`)}
                className="cursor-pointer hover:underline"
              >
                {type.name}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentPage === index ? "bg-slate-blue" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselCategories;
