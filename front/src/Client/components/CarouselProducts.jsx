import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerHorizontal, faUsers, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const products = [
  {
    name: 'Bavaria cruiser 46',
    image: '/images/bavaria46cruiser.jpg',
    length: '14.27 m',
    capacity: 16,
    price: '616 €',
  },
  {
    name: 'Sun Odyssey 410',
    image: '/images/sunodyssey410.jpg',
    length: '12.35 m',
    capacity: 10,
    price: '542 €',
  },
  {
    name: 'Lagoon 42',
    image: '/images/lagoon42.jpg',
    length: '13.10 m',
    capacity: 12,
    price: '750 €',
  },
  {
    name: 'Beneteau Oceanis 38',
    image: '/images/oceanis38.jpg',
    length: '11.50 m',
    capacity: 8,
    price: '510 €',
  },
  {
    name: 'Dufour 530',
    image: '/images/dufour530.jpg',
    length: '16.35 m',
    capacity: 14,
    price: '680 €',
  },
];

const CarouselProducts = () => {
  const getItemsPerPage = () => {
    if (window.innerWidth < 768) return 1;     // smartphone
    if (window.innerWidth < 1024) return 2;    // tablette
    return 3;                                  // desktop
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentIndex(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const visibleItems = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-4 px-4">
      <h2 className="text-center">Nos bateaux les plus prisés</h2>
      <h3 className="text-center">
        Sélection des modèles les plus loués et appréciés
      </h3>      

      <div className="relative">
        <button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 px-3  bg-[#AD7C59] rounded-[100%] shadow hover:bg-[#4B6A88] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
          {visibleItems.map((product, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <a href="#">
                <img src={product.image} alt={product.name} className="rounded-t-lg w-full h-48 object-cover" />
              </a>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <a href="#"><h4 className="font-bold">{product.name}</h4></a>
                  <p className="font-bold">
                    <span className="text-[#AD7C59] text-2xl font-bold">{product.price}</span> /jour
                  </p>
                </div>
                <p className="mt-2">
                  <FontAwesomeIcon icon={faRulerHorizontal} className='text-[#AD7C59]' /> <span className="ml-1">{product.length}</span>
                  <FontAwesomeIcon icon={faUsers} className='text-[#AD7C59] ml-4' /> <span className="ml-1">{product.capacity} passengers</span>
                </p>
                <div className="text-center">
                  <button className="custom-button mt-4">Voir ce bateau</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 px-3  bg-[#AD7C59] rounded-[100%] shadow hover:bg-[#4B6A88] text-white transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className='flex justify-center my-4'>
        <button className="custom-button">
          Voir tous les bateaux

          </button>
      </div>
    </div>
  );
};

export default CarouselProducts;
