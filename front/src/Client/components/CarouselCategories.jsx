import React, { useState } from 'react';

const boatCategories = [
  { name: 'Voiliers', image: '/images/sailBoat.jpeg' },
  { name: 'Bateaux à moteurs', image: '/images/moteurBoat.jpeg' },
  { name: 'Catamarans', image: '/images/catamaran.jpg' },
  { name: 'Bateau fluvial', image: '/images/fluvial.jpg' },
  { name: 'Péniches', image: '/images/bavaria46cruiser.jpg' },
];

const CarouselCategories = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Nombre d'éléments par page selon la taille d'écran
  const getItemsPerPage = () => {
    if (window.innerWidth < 768) return 1;      // Mobile
    if (window.innerWidth < 1024) return 2;     // Tablette
    return 4;                                   // Desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Met à jour automatiquement à chaque redimensionnement
  React.useEffect(() => {
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(boatCategories.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleItems = boatCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-center">Catégories de bateaux</h2>
      <h3 className="text-center">
        Trouvez le bateau qui correspond à votre besoin
      </h3>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
        {visibleItems.map((boat, index) => (
          <div key={index} className="text-center">
            <img
              src={boat.image}
              alt={boat.name}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <p className="mt-2 font-medium">{boat.name}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              currentPage === index ? 'bg-[#4B6A88]' : 'bg-gray-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselCategories;
